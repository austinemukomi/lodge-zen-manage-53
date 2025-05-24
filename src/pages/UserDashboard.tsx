
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Calendar, CreditCard, HelpCircle, Plus, Clock, Search, Star, Heart, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RoomGrid } from "@/components/dashboard/RoomGrid";
import { BookingForm } from "@/components/booking/BookingForm";
import { GuestBookingsList } from "@/components/booking/GuestBookingsList";
import { PaymentSummary } from "@/components/booking/PaymentSummary";
import { useToast } from "@/components/ui/use-toast";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface UserDashboardProps {
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const { profile, loading } = useProfile();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    toast({
      title: "Welcome to Guest Dashboard",
      description: "Book a room or manage your existing bookings."
    });
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4 sm:mb-6">
            <TabsList className={cn(
              "grid w-full bg-white/50 backdrop-blur-sm",
              isMobile ? "grid-cols-2 gap-1" : "grid-cols-4"
            )}>
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm">Dashboard</TabsTrigger>
              <TabsTrigger value="browse" className="text-xs sm:text-sm">Browse</TabsTrigger>
              <TabsTrigger value="bookings" className="text-xs sm:text-sm">Bookings</TabsTrigger>
              <TabsTrigger value="booking-form" className="text-xs sm:text-sm">Book Room</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="pt-4">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back!</h2>
                          <p className="text-blue-100 mb-4">Ready to book your perfect stay?</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="text-sm">Premium Guest</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 text-center">
                          <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-800">3</p>
                          <p className="text-sm text-gray-600">Total Bookings</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 text-center">
                          <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-800">2</p>
                          <p className="text-sm text-gray-600">Favorite Rooms</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 text-center">
                          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-800">4.8</p>
                          <p className="text-sm text-gray-600">Your Rating</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Active Bookings */}
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                          <CardTitle className="text-xl text-gray-800">Your Active Bookings</CardTitle>
                          <Button variant="outline" size="sm" onClick={() => setActiveTab("bookings")} className="hover:bg-blue-50">
                            View All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <GuestBookingsList limit={1} />
                        
                        <div className="mt-4">
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                            onClick={() => setActiveTab("booking-form")}
                          >
                            <Plus className="mr-2 h-4 w-4" /> New Booking
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Sidebar Content */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Special Offers */}
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-800">Special Offers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                            <h4 className="font-semibold text-orange-800 mb-1">Weekend Special</h4>
                            <p className="text-sm text-orange-700 mb-3">20% off on weekend bookings</p>
                            <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                              View Offer
                            </Button>
                          </div>
                          <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                            <h4 className="font-semibold text-green-800 mb-1">Extended Stay Deal</h4>
                            <p className="text-sm text-green-700 mb-3">Stay 4 nights, pay for 3</p>
                            <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                              View Offer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Quick Actions */}
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-800">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start hover:bg-blue-50" onClick={() => setActiveTab("browse")}>
                            <Search className="mr-2 h-4 w-4" />
                            Browse Rooms
                          </Button>
                          <Button variant="outline" className="w-full justify-start hover:bg-purple-50" onClick={() => setActiveTab("bookings")}>
                            <Calendar className="mr-2 h-4 w-4" />
                            My Bookings
                          </Button>
                          <Button variant="outline" className="w-full justify-start hover:bg-green-50">
                            <MapPin className="mr-2 h-4 w-4" />
                            Hotel Services
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="browse" className="pt-4">
              <div className="max-w-7xl mx-auto">
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <CardTitle className="text-xl text-gray-800">Available Rooms</CardTitle>
                        <CardDescription className="text-sm">Browse all available rooms for booking</CardDescription>
                      </div>
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                          type="search"
                          placeholder="Search rooms..."
                          className="pl-8 h-9 w-full rounded-md border border-input text-sm bg-white/80"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RoomGrid filterStatus="AVAILABLE" bookingEnabled={true} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="bookings" className="pt-4">
              <div className="max-w-7xl mx-auto">
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">My Bookings</CardTitle>
                    <CardDescription className="text-sm">View and manage your current and upcoming bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GuestBookingsList />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="booking-form" className="pt-4">
              <div className="max-w-4xl mx-auto">
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">Book a Room</CardTitle>
                    <CardDescription className="text-sm">Select your room and booking details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BookingForm />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
