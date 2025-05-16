
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Room } from "@/utils/types";

interface BookingFormProps {
  selectedRoomId?: string;
  isReceptionist?: boolean;
  onComplete?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ 
  selectedRoomId, 
  isReceptionist = false,
  onComplete 
}) => {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomId: selectedRoomId || "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    bookingType: "hourly",
    date: new Date(),
    startTime: "12:00",
    duration: "1", // hours or days depending on bookingType
    totalAmount: 0,
    payNow: true
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
        
        // Set the first available room if none is selected
        if (!selectedRoomId && availableRooms.length > 0) {
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
  }, [selectedRoomId]);
  
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
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In a real app, you would send this data to your API
      // For now, we'll simulate a successful booking
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Update room status
      if (formData.roomId) {
        const response = await fetch(`http://localhost:8080/api/rooms/${formData.roomId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: "RESERVED" })
        });
        
        if (!response.ok) throw new Error("Failed to update room status");
      }
      
      toast({
        title: "Booking Successful!",
        description: `Your booking for ${format(formData.date, "PPP")} has been confirmed.`,
      });
      
      // Reset form or redirect
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
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
            <Label htmlFor="roomId">Select Room</Label>
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
            <Label htmlFor="guestEmail">Email</Label>
            <Input
              id="guestEmail"
              name="guestEmail"
              type="email"
              value={formData.guestEmail}
              onChange={handleInputChange}
              placeholder="Email address"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestPhone">Phone Number</Label>
            <Input
              id="guestPhone"
              name="guestPhone"
              value={formData.guestPhone}
              onChange={handleInputChange}
              placeholder="Phone number"
              disabled={loading}
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
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-400" />
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>
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
              value={formData.payNow ? "now" : "later"}
              onValueChange={(value) => handleSelectChange("payNow", value === "now" ? "true" : "false")}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Pay Now</SelectItem>
                <SelectItem value="later">Pay at Check-out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {selectedRoom && (
        <Card className="p-4 bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Room:</span>
            <span className="font-medium">Room {selectedRoom.roomNumber} ({selectedRoom.category?.name || "Standard"})</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Rate:</span>
            <span className="font-medium">
              ${formData.bookingType === "hourly" ? 
                (selectedRoom.baseHourlyRate || 25) : 
                (selectedRoom.baseDailyRate || 100)
              } per {formData.bookingType === "hourly" ? "hour" : "day"}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Duration:</span>
            <span className="font-medium">
              {formData.duration} {formData.bookingType === "hourly" ? 
                (parseInt(formData.duration) === 1 ? "hour" : "hours") : 
                (parseInt(formData.duration) === 1 ? "day" : "days")
              }
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="font-medium">Total:</span>
            <span className="font-medium text-lg">${formData.totalAmount}</span>
          </div>
        </Card>
      )}
      
      <div className="flex justify-end">
        {onComplete && (
          <Button type="button" variant="outline" className="mr-2" onClick={onComplete} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || !formData.roomId}>
          {loading ? "Processing..." : "Complete Booking"}
        </Button>
      </div>
    </form>
  );
};
