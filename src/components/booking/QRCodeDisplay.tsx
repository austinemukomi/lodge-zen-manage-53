
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Download } from "lucide-react";

interface QRCodeDisplayProps {
  bookingId: string;
  onClose: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ bookingId, onClose }) => {
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
        <Button variant="outline" size="sm" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
