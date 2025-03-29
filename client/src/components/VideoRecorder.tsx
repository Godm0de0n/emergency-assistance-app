import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, StopCircle, Upload, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VideoRecorderProps {
  showAlert: (message: string, type: "success" | "error" | "warning") => void;
}

export default function VideoRecorder({ showAlert }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const uploadVideoMutation = useMutation({
    mutationFn: async (videoData: { fileName: string; mimeType: string }) => {
      const response = await apiRequest("POST", "/api/video/upload", videoData);
      return response.json();
    },
    onSuccess: (data) => {
      showAlert(data.message, "error");
    },
    onError: (error) => {
      showAlert(`Error uploading video: ${(error as Error).message}`, "error");
    },
  });

  useEffect(() => {
    // Clean up when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        
        const videoURL = URL.createObjectURL(blob);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = videoURL;
          videoRef.current.controls = true;
        }

        setRecordingStatus("Recording complete. Ready to upload.");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStatus("Recording in progress...");
    } catch (error) {
      showAlert(`Failed to access camera: ${(error as Error).message}`, "error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
    }
  };

  const uploadVideo = () => {
    if (!videoBlob) {
      showAlert("No video to upload", "error");
      return;
    }

    uploadVideoMutation.mutate({
      fileName: "emergency_recording.webm",
      mimeType: "video/webm"
    });
  };

  return (
    <Card className="mb-8 bg-gray-50 border border-gray-200">
      <CardContent className="pt-5">
        <h2 className="text-lg font-bold mb-4">Video Recording</h2>
        
        {/* Video preview area */}
        <div className="relative bg-black h-48 mb-4 rounded-lg overflow-hidden flex items-center justify-center">
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${videoBlob || isRecording ? "" : "hidden"}`}
          />
          {!videoBlob && !isRecording && (
            <div className="text-white text-center p-4">
              <Video className="h-12 w-12 mx-auto mb-2" />
              <p>Video preview will appear here</p>
            </div>
          )}
        </div>
        
        {/* Video recording controls */}
        <div className="flex space-x-2">
          <Button
            className={`flex-1 py-3 font-bold rounded-lg flex items-center justify-center ${
              isRecording 
                ? "bg-[#DC3545] hover:bg-red-700" 
                : "bg-[#FF0000] hover:bg-red-700"
            }`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <>
                <StopCircle className="mr-2" /> Stop Recording
              </>
            ) : (
              <>
                <Video className="mr-2" /> Start Recording
              </>
            )}
          </Button>
          
          <Button
            className="flex-1 py-3 font-bold rounded-lg flex items-center justify-center"
            disabled={!videoBlob || uploadVideoMutation.isPending}
            onClick={uploadVideo}
            variant={!videoBlob ? "secondary" : "default"}
          >
            {uploadVideoMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2" /> Upload
              </>
            )}
          </Button>
        </div>
        
        {recordingStatus && (
          <div className="mt-2 text-sm text-center">{recordingStatus}</div>
        )}
      </CardContent>
    </Card>
  );
}
