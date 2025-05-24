
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PaymentSummary } from "./PaymentSummary";
import { QRCodeDisplay } from "./QRCodeDisplay";

interface Booking {
  id: string;
  roomNumber: string;
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: 'confirmed' | 'checked-in' | 'completed' | 'cancelled';
  amount: number;
  isPaid: boolean;
  bookingType: 'hourly' | 'daily' | 'overnight';
}

interface GuestBookingsListProps {
  limit?: number;
}

export const GuestBookingsList: React.FC<GuestBookingsListProps> = ({ limit }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view your bookings",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        const response = await fetch('http://localhost:8080/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error fetching bookings: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match component's expected format if needed
        const formattedBookings: Booking[] = data.map((item: any) => ({
          id: item.id || item.bookingId || '',
          roomNumber: item.roomNumber || (item.room?.roomNumber || ''),
          roomType: item.roomType || (item.room?.roomType || ''),
          checkInDate: new Date(item.checkInDate || item.scheduledCheckIn),
          checkOutDate: new Date(item.checkOutDate || item.scheduledCheckOut),
          status: mapBookingStatus(item.status),
          amount: item.totalCharges || item.amount || 0,
          isPaid: item.isPaid !== undefined ? item.isPaid : true,
          bookingType: item.bookingType?.toLowerCase() || 'daily'
        }));
        
        setBookings(limit ? formattedBookings.slice(0, limit) : formattedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load your bookings';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [limit]);

  // Helper function to map API status values to component's expected format
  const mapBookingStatus = (apiStatus: string): 'confirmed' | 'checked-in' | 'completed' | 'cancelled' => {
    const statusMap: Record<string, 'confirmed' | 'checked-in' | 'completed' | 'cancelled'> = {
      'RESERVED': 'confirmed',
      'CHECKED_IN': 'checked-in',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'OVERDUE': 'checked-in'
    };
    
    return statusMap[apiStatus?.toUpperCase()] || 'confirmed';
  };

  const handleCancel = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to cancel your booking",
          variant: "destructive"
        });
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error cancelling booking: ${response.statusText}`);
      }
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled."
      });
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRemainingTime = (checkOutDate: Date) => {
    const now = new Date();
    const diff = checkOutDate.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading your bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p className="mb-4">You don't have any bookings yet.</p>
        <Button>Book a Room</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <div key={booking.id} className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-blue-50 flex justify-between items-center">
            <div>
              <h4 className="font-medium">{booking.roomType} Room - #{booking.roomNumber}</h4>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  Check-in: {formatDate(booking.checkInDate)} — Check-out: {formatDate(booking.checkOutDate)}
                </span>
              </div>
              {booking.status === 'checked-in' && (
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{getRemainingTime(booking.checkOutDate)}</span>
                </div>
              )}
            </div>
            <div className={`status-badge ${
              booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
              booking.status === 'checked-in' ? 'bg-green-100 text-green-800' :
              booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            } px-3 py-1 rounded-full text-xs font-medium`}>
              {booking.status === 'confirmed' ? 'Confirmed' :
               booking.status === 'checked-in' ? 'Checked In' :
               booking.status === 'completed' ? 'Completed' : 'Cancelled'}
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <div className="flex justify-between mb-3 text-sm">
              <span>Booking Type: <span className="font-medium">{booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}</span></span>
              <span>Total: <span className="font-medium">${booking.amount}</span></span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {booking.status === 'confirmed' && (
                <>
                  {!booking.isPaid && (
                    <Button size="sm" variant="outline" onClick={() => setShowPayment(booking.id)}>
                      Pay Now
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-destructive border-destructive" 
                    onClick={() => handleCancel(booking.id)}>
                    Cancel
                  </Button>
                </>
              )}
              
              {booking.status === 'checked-in' && (
                <div className="text-sm text-gray-600">
                  Checked in by reception staff
                </div>
              )}
              
              {booking.status === 'completed' && (
                <Button size="sm" variant="outline">
                  View Receipt
                </Button>
              )}
            </div>
          </div>
          
          {showPayment === booking.id && (
            <div className="p-4 border-t">
              <PaymentSummary 
                amount={booking.amount} 
                onComplete={() => {
                  setShowPayment(null);
                  toast({
                    title: "Payment Successful",
                    description: "Your payment has been processed successfully."
                  });
                  setBookings(bookings.map(b => 
                    b.id === booking.id ? {...b, isPaid: true} : b
                  ));
                }}
                onCancel={() => setShowPayment(null)} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
