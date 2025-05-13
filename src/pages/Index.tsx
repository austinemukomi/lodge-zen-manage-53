
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RoomGrid } from "@/components/dashboard/RoomGrid";
import { StatusLegend } from "@/components/dashboard/StatusLegend";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Room Overview</h2>
              <p className="text-gray-600">Manage rooms and view their current status</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="mr-1 h-4 w-4" /> New Booking
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <RoomGrid />
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <StatusLegend />
              
              <div className="bg-white p-5 rounded-lg shadow-sm border">
                <h3 className="font-medium text-lg mb-3">Today's Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rooms</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available</span>
                    <span className="font-medium text-room-available">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Occupied</span>
                    <span className="font-medium text-room-occupied">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Needs Cleaning</span>
                    <span className="font-medium text-room-cleaning">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reserved</span>
                    <span className="font-medium text-room-reserved">1</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm border">
                <h3 className="font-medium text-lg mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Create New Booking
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Check-in Guest
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Check-out Guest
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Mark Room as Cleaned
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

export default Dashboard;
