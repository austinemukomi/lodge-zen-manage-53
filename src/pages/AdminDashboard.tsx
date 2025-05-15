
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoomGrid } from "@/components/dashboard/RoomGrid";
import { StatusLegend } from "@/components/dashboard/StatusLegend";
import { 
  BarChart3, 
  Calendar, 
  Users, 
  CreditCard, 
  Home, 
  PlusCircle, 
  Boxes, 
  FileText, 
  Clock 
} from "lucide-react";
import { AdminOverviewStats } from "@/components/admin/AdminOverviewStats";
import { RoomsManagement } from "@/components/admin/RoomsManagement";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { EmployeeManagement } from "@/components/admin/EmployeeManagement";
import { ReportsPanel } from "@/components/admin/ReportsPanel";
import { useToast } from "@/components/ui/use-toast";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    onLogout();
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
              <TabsTrigger value="overview" className="flex items-center">
                <Home className="w-4 h-4 mr-2" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="rooms" className="flex items-center">
                <Boxes className="w-4 h-4 mr-2" />
                <span>Rooms</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>Employees</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                <span>Reports</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <AdminOverviewStats />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                    <CardDescription>Perform common tasks quickly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("rooms")}>
                      <Home className="mr-2 h-4 w-4" /> Manage Rooms
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("bookings")}>
                      <Calendar className="mr-2 h-4 w-4" /> View Bookings
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("employees")}>
                      <Users className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("reports")}>
                      <BarChart3 className="mr-2 h-4 w-4" /> View Reports
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Upcoming Check-outs</CardTitle>
                    <CardDescription>Check-outs in the next 2 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-amber-50 p-2 rounded-md">
                        <div>
                          <p className="text-sm font-medium">Room 102 - John Smith</p>
                          <p className="text-xs text-gray-500">Check out in 45 mins</p>
                        </div>
                        <Clock className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="flex justify-between items-center bg-red-50 p-2 rounded-md">
                        <div>
                          <p className="text-sm font-medium">Room 205 - Emma Johnson</p>
                          <p className="text-xs text-gray-500">Check out in 15 mins</p>
                        </div>
                        <Clock className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex justify-between items-center bg-amber-50 p-2 rounded-md">
                        <div>
                          <p className="text-sm font-medium">Room 310 - Mike Davis</p>
                          <p className="text-xs text-gray-500">Check out in 1hr 30m</p>
                        </div>
                        <Clock className="h-4 w-4 text-amber-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Today's Summary</CardTitle>
                    <CardDescription>Key metrics for today</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Check-ins:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Check-outs:</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue:</span>
                      <span className="font-medium text-green-600">$2,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Occupancy Rate:</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pending Payments:</span>
                      <span className="font-medium text-amber-600">3</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="rooms">
              <RoomsManagement />
            </TabsContent>
            
            <TabsContent value="bookings">
              <BookingsTable />
            </TabsContent>
            
            <TabsContent value="employees">
              <EmployeeManagement />
            </TabsContent>
            
            <TabsContent value="reports">
              <ReportsPanel />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
