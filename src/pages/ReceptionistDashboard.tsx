
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RoomGrid } from "@/components/dashboard/RoomGrid";
import { StatusLegend } from "@/components/dashboard/StatusLegend";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckSquare, Plus, UserCheck, UserX, Search, Clock } from "lucide-react";
import { ManualAssignmentForm } from "@/components/booking/ManualAssignmentForm";
import { BookingForm } from "@/components/booking/BookingForm";
import { CheckInOutForm } from "@/components/booking/CheckInOutForm";
import { AllBookingsTable } from "@/components/booking/AllBookingsTable";

interface ReceptionistDashboardProps {
  onLogout: () => void;
}

const ReceptionistDashboard: React.FC<ReceptionistDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showCheckInForm, setShowCheckInForm] = useState(false);

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Receptionist Dashboard</h2>
              <p className="text-gray-600">Manage guest check-ins and room availability</p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="rooms">Room Status</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="check-in-out">Check-In/Out</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <Card className="mb-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Button 
                          className="h-24 flex-col gap-2 bg-accent hover:bg-accent/90"
                          onClick={() => {
                            setShowAssignForm(true);
                            setShowBookingForm(false);
                            setShowCheckInForm(false);
                          }}
                        >
                          <Plus className="h-6 w-6" />
                          <span>Manual Room Assignment</span>
                        </Button>
                        
                        <Button 
                          className="h-24 flex-col gap-2 bg-accent hover:bg-accent/90"
                          onClick={() => {
                            setShowBookingForm(true);
                            setShowAssignForm(false);
                            setShowCheckInForm(false);
                          }}
                        >
                          <Calendar className="h-6 w-6" />
                          <span>New Booking</span>
                        </Button>
                        
                        <Button 
                          className="h-24 flex-col gap-2 bg-accent hover:bg-accent/90"
                          onClick={() => {
                            setShowCheckInForm(true);
                            setShowAssignForm(false);
                            setShowBookingForm(false);
                          }}
                        >
                          <UserCheck className="h-6 w-6" />
                          <span>Check-In/Out</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {showAssignForm && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Manual Room Assignment</CardTitle>
                        <CardDescription>Walk-in guests and special assignments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ManualAssignmentForm onComplete={() => setShowAssignForm(false)} />
                      </CardContent>
                    </Card>
                  )}
                  
                  {showBookingForm && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>New Booking</CardTitle>
                        <CardDescription>Create a new booking for a guest</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <BookingForm isReceptionist={true} onComplete={() => setShowBookingForm(false)} />
                      </CardContent>
                    </Card>
                  )}
                  
                  {showCheckInForm && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Guest Check-In/Out</CardTitle>
                        <CardDescription>Process guest check-ins and check-outs</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CheckInOutForm onComplete={() => setShowCheckInForm(false)} />
                      </CardContent>
                    </Card>
                  )}
                  
                  <RoomGrid />
                </div>
                
                <div className="lg:col-span-1 space-y-6">
                  <StatusLegend />
                  
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h3 className="font-medium text-lg mb-3">Today's Tasks</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                        <span className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Check-ins</span>
                        </span>
                        <span className="font-medium text-blue-600">5</span>
                      </div>
                      <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <span className="flex items-center">
                          <UserX className="h-4 w-4 mr-2 text-green-600" />
                          <span>Check-outs</span>
                        </span>
                        <span className="font-medium text-green-600">3</span>
                      </div>
                      <div className="flex items-center justify-between bg-purple-50 p-2 rounded">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                          <span>Reservations</span>
                        </span>
                        <span className="font-medium text-purple-600">7</span>
                      </div>
                      <div className="flex items-center justify-between bg-yellow-50 p-2 rounded">
                        <span className="flex items-center">
                          <CheckSquare className="h-4 w-4 mr-2 text-yellow-600" />
                          <span>Room Inspections</span>
                        </span>
                        <span className="font-medium text-yellow-600">4</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h3 className="font-medium text-lg mb-3">Upcoming Check-outs</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-amber-50 p-2 rounded-md">
                        <div>
                          <p className="text-sm font-medium">Room 102 - John Smith</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> 45 mins remaining
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Check-out</Button>
                      </div>
                      <div className="flex justify-between items-center bg-red-50 p-2 rounded-md">
                        <div>
                          <p className="text-sm font-medium">Room 205 - Emma Johnson</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> 15 mins remaining
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Check-out</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rooms">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-medium">Room Status Overview</h3>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="search"
                      placeholder="Search rooms..."
                      className="w-full pl-8 h-9 rounded-md border border-input"
                    />
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </div>
              </div>
              <RoomGrid />
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>All Bookings</CardTitle>
                      <CardDescription>Manage all current and upcoming bookings</CardDescription>
                    </div>
                    <Button onClick={() => setActiveTab("dashboard")}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Booking
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AllBookingsTable />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="check-in-out">
              <Card>
                <CardHeader>
                  <CardTitle>Check-In/Out Management</CardTitle>
                  <CardDescription>Process guest check-ins and check-outs</CardDescription>
                </CardHeader>
                <CardContent>
                  <CheckInOutForm fullPage={true} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
