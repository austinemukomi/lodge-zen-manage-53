
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Calendar, Users, CreditCard } from "lucide-react";
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

interface Employee {
  id: number;
  name: string;
  role: string;
  status: string;
  department: string;
  email: string;
}

export function AdminOverviewStats() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    todayRevenue: 0,
    revenueChange: 0,
    totalBookings: 0,
    checkIns: 0,
    checkOuts: 0,
    totalStaff: 0,
    onDutyStaff: 0,
    offDutyStaff: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch rooms data
        const roomsResponse = await fetch('http://localhost:8080/api/rooms');
        if (!roomsResponse.ok) {
          throw new Error(`Error fetching rooms: ${roomsResponse.statusText}`);
        }
        const roomsData = await roomsResponse.json();
        setRooms(roomsData);
        
        // Fetch bookings data
        const bookingsResponse = await fetch('http://localhost:8080/api/bookings');
        if (!bookingsResponse.ok) {
          throw new Error(`Error fetching bookings: ${bookingsResponse.statusText}`);
        }
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
        
        // Fetch employees data
        const employeesResponse = await fetch('http://localhost:8080/api/admin/users');
        if (!employeesResponse.ok) {
          throw new Error(`Error fetching employees: ${employeesResponse.statusText}`);
        }
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
        
        // Calculate stats using the fetched data
        calculateStats(roomsData, bookingsData, employeesData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
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
    
    fetchData();
  }, [toast]);

  const calculateStats = (roomData: Room[], bookingData: Booking[], employeeData: Employee[]) => {
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Total rooms count from actual room data
    const totalRooms = roomData.length;
    
    // Calculate number of rooms occupied (based on CHECKED_IN status)
    const occupiedRooms = bookingData.filter(booking => booking.status === "CHECKED_IN").length;
    const availableRooms = totalRooms - occupiedRooms;
    
    // Today's revenue (bookings with check-in date today)
    const todayBookings = bookingData.filter(booking => {
      const bookingDate = new Date(booking.scheduledCheckIn);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime();
    });
    
    const todayRevenue = todayBookings.reduce((sum, booking) => sum + booking.totalCharges, 0);
    
    // Check-ins and check-outs for today
    const todayCheckIns = todayBookings.length;
    const todayCheckOuts = bookingData.filter(booking => {
      const checkOutDate = new Date(booking.scheduledCheckOut);
      checkOutDate.setHours(0, 0, 0, 0);
      return checkOutDate.getTime() === today.getTime();
    }).length;

    // Calculate revenue change (using available data - this is an estimate)
    const yesterdayDate = new Date(today);
    yesterdayDate.setDate(today.getDate() - 1);
    
    const yesterdayBookings = bookingData.filter(booking => {
      const bookingDate = new Date(booking.scheduledCheckIn);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === yesterdayDate.getTime();
    });
    
    const yesterdayRevenue = yesterdayBookings.reduce((sum, booking) => sum + booking.totalCharges, 0);
    
    // Calculate percentage change, handle division by zero
    const revenueChange = yesterdayRevenue === 0 
      ? todayRevenue > 0 ? 100 : 0 
      : Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100);
    
    // Staff calculations from employee data
    const totalStaff = employeeData.length;
    const onDutyStaff = employeeData.filter(employee => employee.status === "ON_DUTY").length;
    const offDutyStaff = totalStaff - onDutyStaff;
    
    setStats({
      totalRooms,
      availableRooms,
      occupiedRooms,
      todayRevenue,
      revenueChange,
      totalBookings: bookingData.length,
      checkIns: todayCheckIns,
      checkOuts: todayCheckOuts,
      totalStaff,
      onDutyStaff,
      offDutyStaff
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Rooms</p>
              <p className="text-2xl font-bold">{stats.totalRooms}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.availableRooms} available, {stats.occupiedRooms} occupied
              </p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Bed className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
              <p className="text-2xl font-bold">${stats.todayRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.revenueChange >= 0 ? '↑' : '↓'}
                {Math.abs(stats.revenueChange)}% from yesterday
              </p>
            </div>
            <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Bookings</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.checkIns} Check-ins, {stats.checkOuts} Check-outs
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Staff</p>
              <p className="text-2xl font-bold">{stats.totalStaff}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.onDutyStaff} On duty, {stats.offDutyStaff} Off duty
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
