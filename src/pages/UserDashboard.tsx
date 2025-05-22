
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Calendar, CreditCard, HelpCircle, Plus, Clock, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RoomGrid } from "@/components/dashboard/RoomGrid";
import { BookingForm } from "@/components/booking/BookingForm";
import { GuestBookingsList } from "@/components/booking/GuestBookingsList";
import { PaymentSummary } from "@/components/booking/PaymentSummary";
import { useToast } from "@/components/ui/use-toast";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

interface UserDashboardProps {
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const { profile, loading } = useProfile();
  const isMobile = useIsMobile();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerContent, setDrawerContent] = useState<string | null>(null);
  
  // Show welcome toast once on component mount
  useEffect(() => {
    toast({
      title: "Welcome to Guest Dashboard",
      description: "Book a room or manage your existing bookings."
    });
  }, []);

  const openDrawerWithContent = (content: string) => {
    setDrawerContent(content);
    setOpenDrawer(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F9FAFB]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Guest Dashboard</h2>
            <p className="text-sm md:text-base text-gray-600">Browse, book, and manage your room reservations</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="overflow-x-auto flex flex-nowrap w-full md:w-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="browse">Browse Rooms</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="booking-form">Book a Room</TabsTrigger>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  {/* Active Bookings Section */}
                  <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg md:text-xl font-medium">Your Active Bookings</h3>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("bookings")}>
                        View All
                      </Button>
                    </div>
                    
                    <GuestBookingsList limit={1} />
                    
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-accent hover:bg-accent/90"
                        onClick={() => setActiveTab("booking-form")}
                      >
                        <Plus className="mr-1 h-4 w-4" /> New Booking
                      </Button>
                    </div>
                  </div>
                  
                  {/* Special Offers Section */}
                  <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-medium mb-4">Special Offers</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <h4 className="font-medium">Weekend Special</h4>
                        <p className="text-sm mb-2">20% off on weekend bookings</p>
                        <Button size="sm" variant="outline">View Offer</Button>
                      </div>
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                        <h4 className="font-medium">Extended Stay Deal</h4>
                        <p className="text-sm mb-2">Stay 4 nights, pay for 3</p>
                        <Button size="sm" variant="outline">View Offer</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-1 space-y-4 md:space-y-6">
                  {/* User Quick Panel */}
                  <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                        {!loading && profile ? 
                          (profile.firstName?.charAt(0) || '') + (profile.lastName?.charAt(0) || '') || 
                          profile.username?.substring(0, 2).toUpperCase() || 'JD' : 'JD'}
                      </div>
                      <h3 className="text-lg font-medium mt-3">
                        {!loading && profile ? 
                          `${profile.firstName || ''} ${profile.lastName || ''}` || profile.username : 
                          "Loading..."}
                      </h3>
                      <p className="text-sm text-gray-600">Guest Member</p>
                      <div className="mt-4 w-full">
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => isMobile ? openDrawerWithContent("profile") : setActiveTab("profile")}
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between items-center py-2 border-t">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                          <span>Total Stays</span>
                        </div>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-t">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-600" />
                          <span>Payment Methods</span>
                        </div>
                        <span className="font-medium">2</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-t">
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 mr-2 text-gray-600" />
                          <span>Notifications</span>
                        </div>
                        <span className="font-medium">On</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                    <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Generate QR for Check-in
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="h-4 w-4 mr-2" />
                        Request Early Check-in
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <CreditCard className="h-4 w-4 mr-2" />
                        View Payment History
                      </Button>
                    </div>
                  </div>
                  
                  {/* Help Section */}
                  <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-accent" />
                      Need Help?
                    </h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Contact Reception
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Request Room Service
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Report an Issue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="browse" className="pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>Available Rooms</CardTitle>
                      <CardDescription>Browse all available rooms for booking</CardDescription>
                    </div>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="search"
                        placeholder="Search rooms..."
                        className="pl-8 h-9 w-full rounded-md border border-input"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <RoomGrid filterStatus="AVAILABLE" bookingEnabled={true} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                  <CardDescription>View and manage your current and upcoming bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <GuestBookingsList />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="booking-form" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Book a Room</CardTitle>
                  <CardDescription>Select your room and booking details</CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile" className="pt-4">
              <ProfileEditor />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Mobile Drawer for forms */}
      {isMobile && (
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerContent className="h-[85vh] max-h-[85vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {drawerContent === "profile" ? "Edit Profile" : 
                   drawerContent === "booking" ? "Book a Room" : "Form"}
                </h3>
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm">Close</Button>
                </DrawerClose>
              </div>
              
              {drawerContent === "profile" && <ProfileEditor />}
              {drawerContent === "booking" && <BookingForm />}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default UserDashboard;
