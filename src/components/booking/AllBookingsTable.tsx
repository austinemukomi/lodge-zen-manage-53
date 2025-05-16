
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Filter, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export const AllBookingsTable: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mock bookings data
  const bookings = [
    { 
      id: "B001", 
      guest: "John Smith", 
      room: "102", 
      checkIn: "May 15, 2023, 2:00 PM", 
      checkOut: "May 18, 2023, 12:00 PM", 
      status: "confirmed",
      amount: "$350",
      paymentStatus: "paid"
    },
    { 
      id: "B002", 
      guest: "Emma Johnson", 
      room: "205", 
      checkIn: "May 15, 2023, 3:00 PM", 
      checkOut: "May 16, 2023, 11:00 AM", 
      status: "confirmed",
      amount: "$120",
      paymentStatus: "pending"
    },
    { 
      id: "B003", 
      guest: "Michael Davis", 
      room: "303", 
      checkIn: "May 15, 2023, 4:30 PM", 
      checkOut: "May 17, 2023, 10:00 AM", 
      status: "confirmed",
      amount: "$240",
      paymentStatus: "paid"
    },
    { 
      id: "B004", 
      guest: "Sarah Wilson", 
      room: "105", 
      checkIn: "May 13, 2023, 2:00 PM", 
      checkOut: "May 15, 2023, 12:00 PM", 
      status: "checked-in",
      amount: "$200",
      paymentStatus: "paid"
    },
    { 
      id: "B005", 
      guest: "Thomas Lee", 
      room: "210", 
      checkIn: "May 14, 2023, 1:00 PM", 
      checkOut: "May 15, 2023, 11:00 AM", 
      status: "checked-in",
      amount: "$100",
      paymentStatus: "paid"
    },
    { 
      id: "B006", 
      guest: "Jessica Brown", 
      room: "401", 
      checkIn: "May 12, 2023, 3:30 PM", 
      checkOut: "May 15, 2023, 10:00 AM", 
      status: "completed",
      amount: "$280",
      paymentStatus: "paid"
    },
    { 
      id: "B007", 
      guest: "David Miller", 
      room: "203", 
      checkIn: "May 10, 2023, 12:00 PM", 
      checkOut: "May 12, 2023, 10:00 AM", 
      status: "completed",
      amount: "$220",
      paymentStatus: "paid"
    },
  ];

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room.includes(searchTerm) ||
      booking.id.includes(searchTerm);
    
    return matchesStatus && matchesSearch;
  });

  // Handle status change for a booking
  const handleStatusChange = (bookingId: string, newStatus: string) => {
    toast({
      title: "Booking Updated",
      description: `Booking ${bookingId} status updated to ${newStatus}.`
    });
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
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.guest}</TableCell>
                  <TableCell>{booking.room}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      <span>{booking.checkIn}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      <span>{booking.checkOut}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{booking.amount}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                      ${booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                      booking.status === 'checked-in' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'}`}>
                      {booking.status === 'confirmed' ? 'Confirmed' : 
                       booking.status === 'checked-in' ? 'Checked In' : 
                       booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">View</Button>
                      {booking.status === 'confirmed' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusChange(booking.id, 'checked-in')}
                        >
                          Check-in
                        </Button>
                      )}
                      {booking.status === 'checked-in' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusChange(booking.id, 'completed')}
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
