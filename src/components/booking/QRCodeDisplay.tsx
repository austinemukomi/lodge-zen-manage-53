
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Download, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QRCodeDisplayProps {
  bookingId: string;
  onClose: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ bookingId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const { toast } = useToast();
  
  const handleCheckIn = async () => {
    try {
      setLoading(true);
      // Call the check-in API with POST method
      const response = await fetch(`http://localhost:8080/api/guest/check-in/by-code?bookingCode=${bookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error("Check-in failed");
      }
      
      setChecked(true);
      toast({
        title: "Check-in Successful!",
        description: "Your timer has started. Enjoy your stay!",
      });
      
      // After 2 seconds, close the QR display
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Error during check-in:", error);
      toast({
        title: "Check-in Failed",
        description: "There was an error processing your check-in. Please try again or contact reception.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    toast({
      title: "QR Code Downloaded",
      description: "The QR code has been downloaded to your device."
    });
    // In a real app, this would download an actual QR code image
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-lg font-medium">Check-in QR Code</h3>
      <p className="text-sm text-gray-500 text-center">Present this code at reception or scan at our self-service kiosk</p>
      
      <div className="bg-gray-200 w-48 h-48 rounded-xl flex items-center justify-center">
        {/* This would be a real QR code in production */}
        <div className="text-gray-400 text-center">
          <div className="mb-2">QR Code for</div>
          <div className="font-mono font-bold">{bookingId}</div>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-600">
        <Clock className="h-4 w-4 mr-1" />
        <span>Valid for 24 hours</span>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="flex items-center" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        {!checked ? (
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center"
            onClick={handleCheckIn}
            disabled={loading}
          >
            <Check className="h-4 w-4 mr-2" />
            {loading ? "Processing..." : "Check In Now"}
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
};
