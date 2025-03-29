import { useState } from "react";
import SosButton from "@/components/SosButton";
import PhoneNumberForm from "@/components/PhoneNumberForm";
import VideoRecorder from "@/components/VideoRecorder";
import Alert from "@/components/Alert";

export type AlertType = {
  message: string;
  type: "success" | "error" | "warning" | null;
};

export default function Home() {
  const [alert, setAlert] = useState<AlertType>({
    message: "",
    type: null,
  });
  
  const [phoneInfo, setPhoneInfo] = useState<{
    countryCode: string;
    phoneNumber: string;
  } | null>(null);

  const showAlert = (message: string, type: "success" | "error" | "warning") => {
    setAlert({ message, type });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setAlert({ message: "", type: null });
    }, 5000);
  };

  return (
    <div className="max-w-md mx-auto p-5 min-h-screen">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Emergency Assistance</h1>
        <p className="text-sm text-gray-600">
          Press SOS for immediate help or use video recording to document emergencies
        </p>
      </header>

      {alert.type && <Alert message={alert.message} type={alert.type} />}

      <SosButton 
        showAlert={showAlert} 
        phoneInfo={phoneInfo}
      />

      <PhoneNumberForm 
        showAlert={showAlert}
        setPhoneInfo={setPhoneInfo}
      />

      <VideoRecorder 
        showAlert={showAlert} 
      />

      <footer className="text-center text-xs text-gray-500 mt-8">
        <p>Emergency Assistance Application v1.0</p>
        <p>In a real emergency, always call your local emergency number directly.</p>
        <p className="text-xs text-gray-400 mt-1">Created with by Abhisek</p>
      </footer>
    </div>
  );
}
