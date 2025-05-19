
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Filter, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export const AllBookingsTable: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
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
    if (!dateString) return "N/A";
    
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

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room.roomNumber.includes(searchTerm) ||
      booking.bookingCode.includes(searchTerm);
    
    return matchesStatus && matchesSearch;
  });

  // Handle status change for a booking
  const handleStatusChange = (bookingId: string, newStatus: string) => {
    toast({
      title: "Booking Updated",
      description: `Booking ${bookingId} status updated to ${newStatus}.`
    });
  };

  const getStatusLabel = (status: string) => {
    switch(status.toUpperCase()) {
      case 'CHECKED_IN': return 'Checked In';
      case 'OVERDUE': return 'Overdue';
      case 'RESERVED': return 'Reserved';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by guest, room, ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="checked_in">Checked In</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading bookings...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map(booking => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.bookingCode}</TableCell>
                    <TableCell>{booking.guestName}</TableCell>
                    <TableCell>{booking.room.roomNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        <span>{formatDate(booking.scheduledCheckIn)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-gray-400" />
                        <span>{formatDate(booking.scheduledCheckOut)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>${booking.totalCharges}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${booking.status === 'RESERVED' ? 'bg-blue-100 text-blue-800' : 
                        booking.status === 'CHECKED_IN' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                        booking.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                        'bg-red-100 text-red-800'}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">View</Button>
                        {booking.status === 'RESERVED' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(booking.bookingCode, 'checked-in')}
                          >
                            Check-in
                          </Button>
                        )}
                        {booking.status === 'CHECKED_IN' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(booking.bookingCode, 'completed')}
                          >
                            Check-out
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No bookings matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
};
