import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Documentation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <Button
        className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-text font-semibold rounded-lg flex items-center justify-between px-4"
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
      >
        <span>Developer Documentation</span>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </Button>
      
      {isOpen && (
        <Card className="mt-2 bg-gray-50 border border-gray-200">
          <CardContent className="p-4 text-sm">
            <h3 className="font-bold mb-2">API Integration</h3>
            <p className="mb-2">This application requires integration with the following services:</p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-1">Location Services API - To capture user coordinates</li>
              <li className="mb-1">SMS Notification Service - To send emergency alerts</li>
              <li className="mb-1">Google Drive API - For video upload functionality</li>
            </ul>
            
            <h3 className="font-bold mb-2">Implementation Notes</h3>
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-xs mb-2 whitespace-pre-wrap">
              {`// Location capture implementation
navigator.geolocation.getCurrentPosition((position) => {
  const coords = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  };
  // Send coordinates to emergency service
});`}
            </div>
            
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-xs whitespace-pre-wrap">
              {`// Google Drive upload implementation
function uploadToGoogleDrive(videoBlob) {
  const metadata = {
    name: 'emergency_recording.mp4',
    mimeType: 'video/mp4'
  };
  // Use Google Drive API to upload
}`}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
