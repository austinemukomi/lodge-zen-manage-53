
import React, { useState } from "react";
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

export function BookingsTable() {
  const [activeTab, setActiveTab] = useState("active");

  // Mock bookings data
  const activeBookings = [
    { 
      id: "B001", 
      guest: "John Smith", 
      room: "102", 
      checkIn: "Today 08:30 AM", 
      checkOut: "Today 06:00 PM", 
      duration: "Daily",
      timeLeft: "03:45",
      amount: "$90",
      status: "checked-in"
    },
    { 
      id: "B002", 
      guest: "Emma Johnson", 
      room: "205", 
      checkIn: "Today 10:15 AM", 
      checkOut: "Today 04:15 PM", 
      duration: "Hourly",
      timeLeft: "00:15",
      amount: "$45",
      status: "checked-in"
    },
    { 
      id: "B003", 
      guest: "Mike Davis", 
      room: "310", 
      checkIn: "Today 12:00 PM", 
      checkOut: "Today 07:30 PM", 
      duration: "Daily",
      timeLeft: "01:30",
      amount: "$120",
      status: "checked-in"
    },
    { 
      id: "B004", 
      guest: "Sarah Williams", 
      room: "401", 
      checkIn: "Yesterday 08:00 PM", 
      checkOut: "Today 10:00 AM", 
      duration: "Overnight",
      timeLeft: "-00:30",
      amount: "$180",
      status: "overdue"
    },
    { 
      id: "B005", 
      guest: "David Brown", 
      room: "105", 
      checkIn: "Tomorrow 10:00 AM", 
      checkOut: "Tomorrow 06:00 PM", 
      duration: "Daily",
      timeLeft: "N/A",
      amount: "$85",
      status: "reserved"
    },
  ];

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
        <Tabs defaultValue="active" className="w-full md:w-auto">
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
          <CardTitle className="text-base font-medium">Active Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
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
                  <TableHead>Time Left</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.guest}</TableCell>
                    <TableCell>{booking.room}</TableCell>
                    <TableCell>{booking.checkIn}</TableCell>
                    <TableCell>{booking.checkOut}</TableCell>
                    <TableCell>{booking.duration}</TableCell>
                    <TableCell>
                      {booking.status === "checked-in" ? (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-blue-500" />
                          <span className={booking.timeLeft.startsWith("0") ? "text-red-500 font-medium" : ""}>
                            {booking.timeLeft}
                          </span>
                        </div>
                      ) : booking.status === "overdue" ? (
                        <span className="text-red-500 font-medium">{booking.timeLeft}</span>
                      ) : (
                        <span>{booking.timeLeft}</span>
                      )}
                    </TableCell>
                    <TableCell>{booking.amount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${booking.status === 'checked-in' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                        {booking.status === 'checked-in' ? 'Checked In' : 
                         booking.status === 'overdue' ? 'Overdue' : 'Reserved'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">View</Button>
                        {booking.status === 'checked-in' && (
                          <Button variant="ghost" size="sm">Check out</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
