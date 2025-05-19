
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Calendar, Clock, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Room {
  id: number;
  roomNumber: string;
  status: string;
  floor: number;
  specialFeatures: string;
  lastCleanedAt: string;
}

interface Booking {
  id: number;
  room: Room;
  guestName: string;
  email: string;
  phoneNumber: string;
  type: string;
  date: string;
  startTime: string;
  durationHours: number;
  actualCheckIn: string | null;
  actualCheckOut: string | null;
  bookingCode: string;
  status: string;
  totalCharges: number;
  scheduledCheckOut: string;
  scheduledCheckIn: string;
}

export function BookingsTable() {
  const [activeTab, setActiveTab] = useState("active");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/bookings');
        
        if (!response.ok) {
          throw new Error(`Error fetching bookings: ${response.statusText}`);
        }
        
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateTimeLeft = (checkOutDate: string) => {
    if (!checkOutDate) return "N/A";
    
    const now = new Date();
    const checkOut = new Date(checkOutDate);
    const diff = checkOut.getTime() - now.getTime();
    
    if (diff <= 0) return "-00:00";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Filter bookings by status
  const activeBookings = bookings.filter(booking => 
    booking.status === "CHECKED_IN" || booking.status === "OVERDUE" || booking.status === "RESERVED"
  );
  
  const upcomingBookings = bookings.filter(booking => 
    booking.status === "RESERVED" && new Date(booking.scheduledCheckIn) > new Date()
  );
  
  const pastBookings = bookings.filter(booking => 
    booking.status === "COMPLETED" || booking.status === "CANCELLED"
  );

  const displayBookings = activeTab === "active" ? activeBookings : 
                          activeTab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Bookings Management</h3>
          <p className="text-gray-600">View and manage all bookings</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Calendar className="h-4 w-4 mr-2" /> New Booking
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">History</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search bookings..."
              className="w-full pl-8 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-base font-medium">
            {activeTab === "active" ? "Active Bookings" : 
             activeTab === "upcoming" ? "Upcoming Bookings" : "Booking History"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading bookings...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : displayBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {activeTab === "active" ? "active" : 
                 activeTab === "upcoming" ? "upcoming" : "past"} bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Duration</TableHead>
                    {activeTab === "active" && <TableHead>Time Left</TableHead>}
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.bookingCode}</TableCell>
                      <TableCell>{booking.guestName}</TableCell>
                      <TableCell>{booking.room.roomNumber}</TableCell>
                      <TableCell>{formatDate(booking.actualCheckIn)}</TableCell>
                      <TableCell>{formatDate(booking.actualCheckOut)}</TableCell>
                      <TableCell>{booking.durationHours}</TableCell>
                      {activeTab === "active" && (
                        <TableCell>
                          {booking.status === "CHECKED_IN" ? (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-blue-500" />
                              <span className={calculateTimeLeft(booking.actualCheckIn).startsWith("0") ? "text-red-500 font-medium" : ""}>
                                {calculateTimeLeft(booking.scheduledCheckOut)}
                              </span>
                            </div>
                          ) : booking.status === "OVERDUE" ? (
                            <span className="text-red-500 font-medium">-{calculateTimeLeft(booking.scheduledCheckOut).substring(1)}</span>
                          ) : (
                            <span>N/A</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>${booking.totalCharges}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                          ${booking.status === 'CHECKED_IN' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 
                          booking.status === 'RESERVED' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'}`}>
                          {booking.status === 'CHECKED_IN' ? 'Checked In' : 
                           booking.status === 'OVERDUE' ? 'Overdue' :
                           booking.status === 'RESERVED' ? 'Reserved' :
                           booking.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">View</Button>
                          {(booking.status === 'CHECKED_IN' || booking.status === 'OVERDUE') && (
                            <Button variant="ghost" size="sm">Check out</Button>
                          )}
                          {booking.status === 'RESERVED' && (
                            <Button variant="ghost" size="sm">Check in</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
