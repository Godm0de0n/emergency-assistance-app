import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getCurrentLocation } from "@/lib/location";

interface SosButtonProps {
  showAlert: (message: string, type: "success" | "error" | "warning") => void;
  phoneInfo: { countryCode: string; phoneNumber: string } | null;
}

export default function SosButton({ showAlert, phoneInfo }: SosButtonProps) {
  const sendSosMutation = useMutation({
    mutationFn: async (locationData: { latitude: string; longitude: string }) => {
      const response = await apiRequest("POST", "/api/sos", locationData);
      return response.json();
    },
    onSuccess: (data) => {
      showAlert(data.message, "error");
    },
    onError: (error) => {
      showAlert(
        `Error sending SOS alert: ${(error as Error).message}`,
        "error"
      );
    },
  });

  const handleSosRequest = async () => {
    // Validate phone number first
    if (!phoneInfo || !phoneInfo.phoneNumber) {
      showAlert("Please enter a valid phone number first", "error");
      return;
    }

    try {
      const location = await getCurrentLocation();
      if (location) {
        sendSosMutation.mutate({
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
        });
      }
    } catch (error) {
      showAlert(
        `Unable to access location services: ${(error as Error).message}`,
        "error"
      );
    }
  };

  return (
    <div className="mb-8">
      <Button
        className="w-full py-6 bg-[#FF0000] hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center text-xl h-auto"
        onClick={handleSosRequest}
        disabled={sendSosMutation.isPending}
      >
        {sendSosMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending Alert...
          </>
        ) : (
          <>
            <AlertTriangle className="mr-2 h-5 w-5" /> SOS EMERGENCY
          </>
        )}
      </Button>
      <p className="text-xs text-gray-500 mt-2 text-center">
        This will send your location and phone number to emergency services
      </p>
    </div>
  );
}
