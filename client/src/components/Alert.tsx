import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface AlertProps {
  message: string;
  type: "success" | "error" | "warning";
}

export default function Alert({ message, type }: AlertProps) {
  const bgColor = 
    type === "success" ? "bg-[#28A745]" : 
    type === "error" ? "bg-[#FF0000]" : 
    "bg-[#FFC107]";
  
  const Icon = 
    type === "success" ? CheckCircle : 
    type === "error" ? AlertCircle : 
    AlertTriangle;

  return (
    <div className={`mb-5 rounded-lg p-4 text-white text-center ${bgColor} flex items-center justify-center`}>
      <Icon className="h-5 w-5 mr-2" />
      <span>{message}</span>
    </div>
  );
}
