import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Room } from "@/utils/types";
import { PaymentSummary } from "./PaymentSummary";

interface BookingFormProps {
  selectedRoomId?: string;
  isReceptionist?: boolean;
  onComplete?: () => void;
}

export const BookingForm = ({ selectedRoomId, isReceptionist = false, onComplete }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    roomId: selectedRoomId || "",
    guestName: "",
    email: "",
    phoneNumber: "",
    bookingType: "daily",
    date: new Date(),
    startTime: "12:00",
    durationHours: 3,
    specialRequests: ""
  });
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [fetchingRooms, setFetchingRooms] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Fetch available rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setFetchingRooms(true);
        const response = await fetch('http://localhost:8080/api/rooms?status=AVAILABLE');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error fetching rooms: ${response.statusText}`);
        }
        
        const data = await response.json();
        setRooms(data);
        
        // If selectedRoomId is provided and exists in fetched rooms, use it
        if (selectedRoomId) {
          const selectedRoom = data.find((room: Room) => room.id === selectedRoomId);
          if (selectedRoom) {
            setFormData(prev => ({
              ...prev,
              roomId: selectedRoomId
            }));
          }
        }
        
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load available rooms",
          variant: "destructive"
        });
      } finally {
        setFetchingRooms(false);
      }
    };
    
    fetchRooms();
  }, [selectedRoomId]);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle date change from calendar
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        date: date
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare the booking data for API
      const bookingData = {
        roomId: formData.roomId,
        guestName: formData.guestName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        bookingType: formData.bookingType.toUpperCase(),
        specialRequests: formData.specialRequests,
        date: format(formData.date, "yyyy-MM-dd"),
        startTime: formData.startTime,
        durationHours: parseInt(formData.durationHours.toString())
      };
      
      // Send booking request to API
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token && !isReceptionist) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData)
      });
      
      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Booking failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setBookingId(data.id || data.bookingId);
      setTotalAmount(data.totalCharges || data.amount || 100);
      
      // Show payment form for guest bookings
      if (!isReceptionist) {
        setShowPaymentForm(true);
      } else {
        // For receptionist bookings, just show success toast
        toast({
          title: "Booking Successful",
          description: `Booking has been created successfully. Booking ID: ${data.id || data.bookingId}`,
        });
        
        if (onComplete) {
          onComplete();
        }
      }
      
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Error",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle booking completion after payment
  const handleBookingComplete = () => {
    toast({
      title: "Booking Successful",
      description: `Your booking has been confirmed. Booking ID: ${bookingId}`,
    });
    
    // Reset form
    setFormData({
      roomId: "",
      guestName: "",
      email: "",
      phoneNumber: "",
      bookingType: "daily",
      date: new Date(),
      startTime: "12:00",
      durationHours: 3,
      specialRequests: ""
    });
    
    setShowPaymentForm(false);
    
    if (onComplete) {
      onComplete();
    }
  };

  // Get available times for booking
  const getTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minute.toString().padStart(2, '0');
        times.push(`${hourStr}:${minuteStr}`);
      }
    }
    return times;
  };

  // Get room price based on type
  const getRoomPrice = (roomId: string, type: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return 0;
    
    switch(type.toLowerCase()) {
      case 'hourly':
        return room.hourlyRate || 25;
      case 'overnight':
        return room.overnightRate || 120;
      case 'daily':
      default:
        return room.dailyRate || 80;
    }
  };
  
  if (showPaymentForm && bookingId) {
    return (
      <PaymentSummary 
        amount={totalAmount} 
        onComplete={handleBookingComplete} 
        onCancel={() => setShowPaymentForm(false)}
      />
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="roomId">Select Room</Label>
        <Select
          name="roomId"
          value={formData.roomId}
          onValueChange={(value) => setFormData({ ...formData, roomId: value })}
          disabled={fetchingRooms}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a room" />
          </SelectTrigger>
          <SelectContent>
            {fetchingRooms ? (
              <SelectItem value="" disabled>Loading rooms...</SelectItem>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.roomNumber} - {room.roomType}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>No rooms available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="guestName">Guest Name</Label>
        <Input
          type="text"
          id="guestName"
          name="guestName"
          value={formData.guestName}
          onChange={handleInputChange}
          placeholder="Enter guest name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter email"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Enter phone number"
          required
        />
      </div>
      
      <div>
        <Label>Booking Type</Label>
        <RadioGroup
          defaultValue={formData.bookingType}
          onValueChange={(value) => setFormData({ ...formData, bookingType: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hourly" id="hourly" />
            <Label htmlFor="hourly">Hourly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily">Daily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="overnight" id="overnight" />
            <Label htmlFor="overnight">Overnight</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={handleDateChange}
                disabled={(date) =>
                  date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Select
            name="startTime"
            value={formData.startTime}
            onValueChange={(value) => setFormData({ ...formData, startTime: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {getTimeOptions().map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="durationHours">Duration (Hours)</Label>
        <Input
          type="number"
          id="durationHours"
          name="durationHours"
          value={formData.durationHours}
          onChange={handleInputChange}
          placeholder="Enter duration in hours"
          min="1"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Input
          type="textarea"
          id="specialRequests"
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleInputChange}
          placeholder="Enter any special requests"
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Booking"}
        </Button>
      </div>
    </form>
  );
};
