
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const Bookings = () => {
  // Sample bookings data
  const bookings = [
    {
      id: "1",
      guestName: "John Smith",
      roomNumber: "101",
      checkIn: "2025-05-13T14:00:00",
      checkOut: "2025-05-14T12:00:00",
      status: "checked-in",
      duration: "overnight",
      paymentStatus: "paid"
    },
    {
      id: "2",
      guestName: "Jane Doe",
      roomNumber: "203",
      checkIn: "2025-05-15T10:00:00",
      checkOut: "2025-05-15T18:00:00",
      status: "pending",
      duration: "hourly",
      paymentStatus: "pending"
    },
    {
      id: "3",
      guestName: "Robert Johnson",
      roomNumber: "302",
      checkIn: "2025-05-12T12:00:00",
      checkOut: "2025-05-13T10:00:00",
      status: "checked-out",
      duration: "overnight",
      paymentStatus: "paid"
    }
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "checked-out":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status badge styling
  const getPaymentBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "partial":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Bookings</h2>
              <p className="text-gray-600">Manage all guest bookings and reservations</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white border border-gray-200 rounded-md">
                <button className="px-3 py-2 border-r border-gray-200">
                  <ChevronLeft className="h-5 w-5 text-gray-500" />
                </button>
                <div className="px-4 py-2 flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm">May 2025</span>
                </div>
                <button className="px-3 py-2 border-l border-gray-200">
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="mr-1 h-4 w-4" /> New Booking
              </Button>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Room {booking.roomNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(booking.checkIn)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(booking.checkOut)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{booking.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status === "checked-in" ? "Checked In" : 
                           booking.status === "checked-out" ? "Checked Out" : 
                           booking.status === "pending" ? "Pending" : "Canceled"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentBadgeClass(booking.paymentStatus)}`}>
                          {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-primary">View</Button>
                        <Button variant="ghost" size="sm" className="text-gray-600">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">3</span> results
                </div>
                <div className="flex-1 flex justify-end">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled className="ml-3">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Bookings;
