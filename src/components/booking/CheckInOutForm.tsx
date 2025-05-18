import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Search, UserCheck, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CheckInOutFormProps {
  onComplete?: () => void;
  fullPage?: boolean;
}

export const CheckInOutForm: React.FC<CheckInOutFormProps> = ({ onComplete, fullPage = false }) => {
  const [activeTab, setActiveTab] = useState("check-in");
  const [bookingCode, setBookingCode] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [foundBooking, setFoundBooking] = useState<any | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Mock bookings data
  const checkInBookings = [
    { id: "B001", guest: "John Smith", room: "102", checkIn: "May 15, 2023, 2:00 PM", checkOut: "May 18, 2023, 12:00 PM", status: "confirmed" },
    { id: "B002", guest: "Emma Johnson", room: "205", checkIn: "May 15, 2023, 3:00 PM", checkOut: "May 16, 2023, 11:00 AM", status: "confirmed" },
    { id: "B003", guest: "Michael Davis", room: "303", checkIn: "May 15, 2023, 4:30 PM", checkOut: "May 17, 2023, 10:00 AM", status: "confirmed" },
  ];
  
  const checkOutBookings = [
    { id: "B004", guest: "Sarah Wilson", room: "105", checkIn: "May 13, 2023, 2:00 PM", checkOut: "May 15, 2023, 12:00 PM", status: "checked-in" },
    { id: "B005", guest: "Thomas Lee", room: "210", checkIn: "May 14, 2023, 1:00 PM", checkOut: "May 15, 2023, 11:00 AM", status: "checked-in" },
    { id: "B006", guest: "Jessica Brown", room: "401", checkIn: "May 12, 2023, 3:30 PM", checkOut: "May 15, 2023, 10:00 AM", status: "checked-in" },
  ];
  
  const handleSearch = async () => {
    setLoading(true);
    
    try {
      if (bookingCode) {
        // Use the booking details API to get information by booking code
        const response = await fetch(`http://localhost:8080/api/guest/details/${bookingCode}`);
        
        if (!response.ok) {
          throw new Error("Failed to find booking");
        }
        
        const data = await response.json();
        setFoundBooking({
          id: data.bookingId,
          room: data.roomNumber,
          guest: data.guestName,
          checkIn: data.checkInTime
        });
      } else {
        // Check by guest details
        const params = new URLSearchParams();
        if (roomNumber) params.append("roomNumber", roomNumber);
        if (guestName) params.append("guestName", guestName);
        
        const response = await fetch(`http://localhost:8080/api/guest/check-in/by-details?${params}`);
        
        if (!response.ok) {
          throw new Error("Failed to find booking");
        }
        
        const data = await response.json();
        setFoundBooking(data);
      }
    } catch (error) {
      console.error("Search error:", error);
      
      // Fallback to mock data for demo
      const searchByCode = bookingCode.trim() !== "";
      const searchTerm = searchByCode ? bookingCode : guestName || roomNumber;
      
      let found = null;
      
      if (activeTab === "check-in") {
        found = checkInBookings.find((booking) => 
          searchByCode ? booking.id === searchTerm : 
          guestName ? booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) :
          booking.room === searchTerm
        );
      } else {
        found = checkOutBookings.find((booking) => 
          searchByCode ? booking.id === searchTerm : 
          guestName ? booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) :
          booking.room === searchTerm
        );
      }
      
      if (found) {
        setFoundBooking(found);
      } else {
        toast({
          title: "No booking found",
          description: "Could not find a booking matching your search criteria.",
          variant: "destructive"
        });
        setFoundBooking(null);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const monitorBooking = async (code: string) => {
    try {
      setMonitorLoading(true);
      const response = await fetch(`http://localhost:8080/api/guest/monitor/${code}`);
      
      if (!response.ok) {
        throw new Error("Failed to monitor booking");
      }
      
      const data = await response.json();
      setTimeRemaining(data.timeRemaining );
    } catch (error) {
      console.error("Error monitoring booking:", error);
      setTimeRemaining("Error");
    } finally {
      setMonitorLoading(false);
    }
  };
  
  const handleProcess = async () => {
    if (!foundBooking) return;
    
    setLoading(true);
    
    try {
      if (activeTab === "check-in") {
        let response;
        
        if (bookingCode) {
          // Check in by code - Using POST method
          response = await fetch(`http://localhost:8080/api/guest/check-in/by-code?bookingCode=${bookingCode}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } else {
          // Check in by details - Using POST method
          const params = new URLSearchParams();
          if (roomNumber) params.append("roomNumber", roomNumber);
          if (guestName) params.append("guestName", guestName);
          
          response = await fetch(`http://localhost:8080/api/guest/check-in/by-details?${params}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        
        if (!response.ok) {
          throw new Error("Check-in failed");
        }
        
        // Start monitoring the booking time
        if (bookingCode) {
          await monitorBooking(bookingCode);
        }
        
        // Update room status to occupied
        if (foundBooking.room) {
          await fetch(`http://localhost:8080/api/rooms/${foundBooking.room}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: "OCCUPIED" })
          });
        }
        
        toast({
          title: "Check-in Successful",
          description: `${foundBooking.guest} has been checked in to Room ${foundBooking.room}.`
        });
      } else {
        
        // Use the correct checkout API with POST method
        console.log("Booking Code:", bookingCode);

        await fetch(`http://localhost:8080/api/guest/check-out?bookingCode=${bookingCode}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
      
        // Update room status to CLEANING after check-out
        if (foundBooking.room) {
          await fetch(`http://localhost:8080/api/rooms/${foundBooking.room}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: "CLEANING" })
          });
        }
      
        toast({
          title: "Check-out Successful",
          description: `${foundBooking.guest} has been checked out from Room ${foundBooking.room}.`
        });
      }
      
      // Reset form
      setBookingCode("");
      setRoomNumber("");
      setGuestName("");
      setFoundBooking(null);
      setTimeRemaining(null);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error(`Error during ${activeTab}:`, error);
      toast({
        title: `${activeTab === "check-in" ? "Check-in" : "Check-out"} Failed`,
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="check-in" className="flex items-center">
            <UserCheck className="w-4 h-4 mr-2" />
            <span>Check-In</span>
          </TabsTrigger>
          <TabsTrigger value="check-out" className="flex items-center">
            <UserX className="w-4 h-4 mr-2" />
            <span>Check-Out</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="check-in" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookingCode">Booking Code</Label>
              <Input
                id="bookingCode"
                placeholder="Enter booking code"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
              />
            </div>
            
            <div className="text-center">
              <p className="text-gray-500">- OR -</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="e.g. 101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestName">Guest Name</Label>
                <Input
                  id="guestName"
                  placeholder="Guest name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={handleSearch} disabled={loading || (!bookingCode && !roomNumber && !guestName)}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          
          {fullPage && (
            <Card className="mt-6">
              <div className="p-4">
                <h3 className="font-medium mb-4">Today's Expected Check-ins</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Check-in Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checkInBookings.map(booking => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>{booking.guest}</TableCell>
                        <TableCell>{booking.room}</TableCell>
                        <TableCell>{booking.checkIn}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => {
                            setFoundBooking(booking);
                            setBookingCode(booking.id);
                          }}>
                            Check-in
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="check-out" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookingCodeOut">Booking Code</Label>
              <Input
                id="bookingCodeOut"
                placeholder="Enter booking code"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
              />
            </div>
            
            <div className="text-center">
              <p className="text-gray-500">- OR -</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumberOut">Room Number</Label>
                <Input
                  id="roomNumberOut"
                  placeholder="e.g. 101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestNameOut">Guest Name</Label>
                <Input
                  id="guestNameOut"
                  placeholder="Guest name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={handleSearch} disabled={loading || (!bookingCode && !roomNumber && !guestName)}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          
          {fullPage && (
            <Card className="mt-6">
              <div className="p-4">
                <h3 className="font-medium mb-4">Today's Expected Check-outs</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Check-out Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checkOutBookings.map(booking => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>{booking.guest}</TableCell>
                        <TableCell>{booking.room}</TableCell>
                        <TableCell>{booking.checkOut}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => {
                            setFoundBooking(booking);
                            setBookingCode(booking.id);
                          }}>
                            Check-out
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {foundBooking && (
        <Card className="p-4 border-2 border-primary mt-6">
          <h3 className="font-medium text-lg mb-3">
            {activeTab === "check-in" ? "Check-in Details" : "Check-out Details"}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-medium">{foundBooking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Room Number</p>
                <p className="font-medium">{foundBooking.room}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guest Name</p>
                <p className="font-medium">{foundBooking.guest}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{activeTab === "check-in" ? "Check-in Time" : "Check-out Time"}</p>
                <p className="font-medium">{activeTab === "check-in" ? foundBooking.checkIn : foundBooking.checkOut}</p>
              </div>
            </div>
            
            {bookingCode && activeTab === "check-in" && (
              <div className="pt-2 pb-2">
                <Button 
                  variant="outline" 
                  onClick={() => monitorBooking(bookingCode)}
                  disabled={monitorLoading}
                  className="w-full"
                >
                  {monitorLoading ? "Checking..." : "Check Remaining Time"}
                </Button>
                
                {timeRemaining && (
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">Remaining Time</p>
                    <p className="font-medium text-lg">{timeRemaining}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-4 border-t flex justify-end">
              <Button onClick={handleProcess} disabled={loading} className="min-w-[150px]">
                {loading ? 
                  (activeTab === "check-in" ? "Checking In..." : "Checking Out...") : 
                  (activeTab === "check-in" ? "Complete Check-in" : "Complete Check-out")
                }
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
