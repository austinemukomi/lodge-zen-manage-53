
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; 
import { BarChart3, LineChart, PieChart } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart as RechartLineChart,
  Line,
  PieChart as RechartPieChart,
  Pie,
  Cell
} from 'recharts';
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

export function ReportsPanel() {
  const [reportPeriod, setReportPeriod] = useState("daily");
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
  }, [toast]);

  // Calculate total revenue from bookings
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalCharges, 0);
  
  // Calculate weekly revenue data
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };
  
  // Group bookings by day of week and calculate daily revenue and expense estimates
  const revenueByDay = bookings.reduce((acc: Record<string, any>, booking) => {
    const day = getDayOfWeek(booking.scheduledCheckIn);
    if (!acc[day]) {
      acc[day] = { name: day, revenue: 0, expenses: 0, profit: 0 };
    }
    acc[day].revenue += booking.totalCharges;
    // Estimate expenses as 60% of revenue for demonstration
    acc[day].expenses = Number((acc[day].revenue * 0.6).toFixed(2));
    acc[day].profit = Number((acc[day].revenue - acc[day].expenses).toFixed(2));
    return acc;
  }, {});
  
  const revenueData = Object.values(revenueByDay);
  
  // Sort days of week in correct order
  const daysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  revenueData.sort((a: any, b: any) => daysOrder.indexOf(a.name) - daysOrder.indexOf(b.name));

  // Calculate occupancy rate over time
  const getTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i += 2) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const ampm = i < 12 ? 'AM' : 'PM';
      slots.push(`${hour} ${ampm}`);
    }
    return slots;
  };

  const timeSlots = getTimeSlots();
  const totalRooms = 45; // Assuming total number of rooms from AdminOverviewStats
  
  const calculateOccupancyByHour = () => {
    const occupancyByHour: Record<string, {name: string, rate: number}> = {};
    
    // Initialize all time slots with 0 occupancy
    timeSlots.forEach((slot, index) => {
      occupancyByHour[slot] = { name: slot, rate: 0 };
    });
    
    // Calculate occupancy for each booking
    bookings.forEach(booking => {
      if (booking.status === "CHECKED_IN" || booking.status === "COMPLETED") {
        const checkIn = new Date(booking.scheduledCheckIn);
        const checkOut = new Date(booking.scheduledCheckOut);
        
        // For each 2-hour slot, check if the booking was active
        for (let i = 0; i < 24; i += 2) {
          const slotStart = new Date(checkIn);
          slotStart.setHours(i, 0, 0, 0);
          
          const slotEnd = new Date(checkIn);
          slotEnd.setHours(i + 2, 0, 0, 0);
          
          // If booking was active during this slot
          if (checkIn < slotEnd && checkOut > slotStart) {
            const hour = i % 12 === 0 ? 12 : i % 12;
            const ampm = i < 12 ? 'AM' : 'PM';
            const slot = `${hour} ${ampm}`;
            
            // Increment occupied rooms count
            occupancyByHour[slot].rate += 1;
          }
        }
      }
    });
    
    // Convert to percentage
    Object.keys(occupancyByHour).forEach(slot => {
      occupancyByHour[slot].rate = Math.round((occupancyByHour[slot].rate / totalRooms) * 100);
    });
    
    return Object.values(occupancyByHour);
  };

  const occupancyData = calculateOccupancyByHour();
  
  // Calculate average occupancy rate
  const averageOccupancy = Math.round(
    occupancyData.reduce((sum, item) => sum + item.rate, 0) / occupancyData.length
  );

  // Calculate room type distribution
  const getRoomTypes = () => {
    const roomTypes: Record<string, number> = {};
    
    bookings.forEach(booking => {
      const features = booking.room.specialFeatures.toLowerCase();
      let type = 'Standard';
      
      if (features.includes('deluxe')) {
        type = 'Deluxe';
      } else if (features.includes('suite')) {
        type = 'Suite';
      }
      
      roomTypes[type] = (roomTypes[type] || 0) + 1;
    });
    
    return Object.entries(roomTypes).map(([name, value]) => ({ name, value }));
  };

  const roomTypeData = getRoomTypes();
  
  // Find most popular room type
  const getMostPopularRoom = () => {
    if (roomTypeData.length === 0) return { name: 'N/A', occupancy: 0 };
    
    const popular = roomTypeData.reduce((max, room) => 
      room.value > max.value ? room : max, { name: '', value: 0 });
      
    const occupancy = Math.round((popular.value / bookings.length) * 100);
    
    return { name: popular.name, occupancy };
  };

  const popularRoom = getMostPopularRoom();

  // Calculate weekly change in revenue (fictional for demo purposes)
  const weeklyChange = Math.round((Math.random() * 30) - 10); // Random between -10% and +20%

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Reports & Analytics</h3>
            <p className="text-gray-600">Loading financial reports and occupancy metrics...</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Reports & Analytics</h3>
            <p className="text-gray-600">Error loading financial reports</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Reports & Analytics</h3>
          <p className="text-gray-600">View financial reports and occupancy metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export
          </Button>
          <Button variant="outline">
            Print
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">Total revenue</p>
            <div className={`text-sm ${weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>
              {weeklyChange >= 0 ? '↑' : '↓'} {Math.abs(weeklyChange)}% from last week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageOccupancy}%</div>
            <p className="text-xs text-gray-500">Current occupancy</p>
            <div className="text-sm text-green-600 mt-2">↑ 8% from last week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Popular Room</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{popularRoom.name}</div>
            <p className="text-xs text-gray-500">Most booked room type</p>
            <div className="text-sm mt-2">{popularRoom.occupancy}% booking rate</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="financial">
        <TabsList className="mb-4">
          <TabsTrigger value="financial" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span>Financial Reports</span>
          </TabsTrigger>
          <TabsTrigger value="occupancy" className="flex items-center">
            <LineChart className="w-4 h-4 mr-2" />
            <span>Occupancy Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            <span>Room Distribution</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Revenue, Expenses & Profit</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setReportPeriod("daily")} 
                    className={reportPeriod === "daily" ? "bg-primary/10" : ""}>
                    Daily
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setReportPeriod("weekly")}
                    className={reportPeriod === "weekly" ? "bg-primary/10" : ""}>
                    Weekly
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setReportPeriod("monthly")}
                    className={reportPeriod === "monthly" ? "bg-primary/10" : ""}>
                    Monthly
                  </Button>
                </div>
              </div>
              <CardDescription>Overview of financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    <Bar dataKey="profit" name="Profit" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="occupancy">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate (24 hours)</CardTitle>
              <CardDescription>Percentage of rooms occupied throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartLineChart data={occupancyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rate" name="Occupancy Rate %" stroke="#4f46e5" activeDot={{ r: 8 }} />
                  </RechartLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Room Type Distribution</CardTitle>
              <CardDescription>Breakdown of room types in the hotel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <Pie
                      data={roomTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {roomTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
