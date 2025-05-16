
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Room } from "@/utils/types";

interface ManualAssignmentFormProps {
  onComplete?: () => void;
}

export const ManualAssignmentForm: React.FC<ManualAssignmentFormProps> = ({ onComplete }) => {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomId: "",
    guestName: "",
    guestId: "",
    bookingType: "hourly",
    duration: "1",
    totalAmount: 0,
    paymentMethod: "cash"
  });
  const { toast } = useToast();
  
  // Fetch available rooms
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/rooms");
        if (!response.ok) throw new Error("Failed to fetch rooms");
        
        const data = await response.json();
        const availableRooms = data.filter((room: any) => room.status === "AVAILABLE");
        setAvailableRooms(availableRooms);
        
        // Set the first available room if available
        if (availableRooms.length > 0) {
          setFormData(prev => ({
            ...prev,
            roomId: availableRooms[0].id.toString()
          }));
        }
      } catch (error) {
        console.error("Error fetching available rooms:", error);
        toast({
          title: "Error",
          description: "Failed to load available rooms",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableRooms();
  }, []);
  
  // Calculate total amount when relevant fields change
  useEffect(() => {
    if (!formData.roomId) return;
    
    const selectedRoom = availableRooms.find(room => room.id.toString() === formData.roomId);
    if (!selectedRoom) return;
    
    const rate = formData.bookingType === "hourly" ? 
      (selectedRoom.baseHourlyRate || 25) : 
      (selectedRoom.baseDailyRate || 100);
    
    const duration = parseInt(formData.duration);
    const total = rate * duration;
    
    setFormData(prev => ({
      ...prev,
      totalAmount: total
    }));
  }, [formData.roomId, formData.bookingType, formData.duration, availableRooms]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In a real app, you would send this data to your API
      // For now, we'll update the room status
      
      // Update room status
      if (formData.roomId) {
        const response = await fetch(`http://localhost:8080/api/rooms/${formData.roomId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: "OCCUPIED" })
        });
        
        if (!response.ok) throw new Error("Failed to update room status");
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Room Assigned",
        description: `Room successfully assigned to ${formData.guestName}.`,
      });
      
      // Reset form or close
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error assigning room:", error);
      toast({
        title: "Assignment Failed",
        description: "There was an error assigning the room. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getSelectedRoom = () => {
    return availableRooms.find(room => room.id.toString() === formData.roomId);
  };
  
  const selectedRoom = getSelectedRoom();
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomId">Select Available Room</Label>
            <Select
              value={formData.roomId}
              onValueChange={(value) => handleSelectChange("roomId", value)}
              disabled={loading || availableRooms.length === 0}
            >
              <SelectTrigger id="roomId">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map(room => (
                  <SelectItem key={room.id} value={room.id.toString()}>
                    Room {room.roomNumber} - {room.category?.name || "Standard"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              name="guestName"
              value={formData.guestName}
              onChange={handleInputChange}
              placeholder="Full name"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestId">ID Number</Label>
            <Input
              id="guestId"
              name="guestId"
              value={formData.guestId}
              onChange={handleInputChange}
              placeholder="ID card or passport number"
              disabled={loading}
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bookingType">Booking Type</Label>
            <Select
              value={formData.bookingType}
              onValueChange={(value) => handleSelectChange("bookingType", value)}
              disabled={loading}
            >
              <SelectTrigger id="bookingType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Full Day</SelectItem>
                <SelectItem value="overnight">Overnight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration ({formData.bookingType === "hourly" ? "Hours" : "Days"})</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => handleSelectChange("duration", value)}
              disabled={loading}
            >
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formData.bookingType === "hourly" ? (
                  <>
                    <SelectItem value="1">1 Hour</SelectItem>
                    <SelectItem value="2">2 Hours</SelectItem>
                    <SelectItem value="3">3 Hours</SelectItem>
                    <SelectItem value="4">4 Hours</SelectItem>
                    <SelectItem value="6">6 Hours</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="2">2 Days</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="4">4 Days</SelectItem>
                    <SelectItem value="7">1 Week</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleSelectChange("paymentMethod", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRoom && (
            <div className="p-4 bg-gray-50 rounded-lg mt-4">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">Room Rate:</span>
                <span>
                  ${formData.bookingType === "hourly" ? 
                    (selectedRoom.baseHourlyRate || 25) : 
                    (selectedRoom.baseDailyRate || 100)
                  } per {formData.bookingType === "hourly" ? "hour" : "day"}
                </span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t mt-2">
                <span>Total Amount:</span>
                <span>${formData.totalAmount}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        {onComplete && (
          <Button type="button" variant="outline" className="mr-2" onClick={onComplete} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || !formData.roomId}>
          {loading ? "Processing..." : "Assign Room"}
        </Button>
      </div>
    </form>
  );
};
