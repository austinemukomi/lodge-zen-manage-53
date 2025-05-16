
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
  const [showQr, setShowQr] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockBookings: Booking[] = [
          {
            id: 'b001',
            roomNumber: '204',
            roomType: 'Deluxe',
            checkInDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // tomorrow
            checkOutDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days later
            status: 'confirmed',
            amount: 450,
            isPaid: true,
            bookingType: 'daily'
          },
          {
            id: 'b002',
            roomNumber: '305',
            roomType: 'Standard',
            checkInDate: new Date(),
            checkOutDate: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), // 5 hours later
            status: 'checked-in',
            amount: 125,
            isPaid: true,
            bookingType: 'hourly'
          },
          {
            id: 'b003',
            roomNumber: '502',
            roomType: 'Suite',
            checkInDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // a week later
            checkOutDate: new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000), // 9 days later
            status: 'confirmed',
            amount: 650,
            isPaid: false,
            bookingType: 'overnight'
          }
        ];
        
        setBookings(limit ? mockBookings.slice(0, limit) : mockBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [limit]);

  const handleCancel = (bookingId: string) => {
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been successfully cancelled."
    });
    setBookings(bookings.filter(booking => booking.id !== bookingId));
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
                  <Button size="sm" variant="outline" onClick={() => setShowQr(booking.id)}>
                    Generate QR Code
                  </Button>
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
                <Button size="sm" variant="outline">
                  Check Out Early
                </Button>
              )}
              
              {booking.status === 'completed' && (
                <Button size="sm" variant="outline">
                  View Receipt
                </Button>
              )}
            </div>
          </div>
          
          {showQr === booking.id && (
            <div className="p-4 border-t">
              <QRCodeDisplay bookingId={booking.id} onClose={() => setShowQr(null)} />
            </div>
          )}
          
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
