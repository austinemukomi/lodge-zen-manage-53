
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RoomGrid } from "@/components/dashboard/RoomGrid";
import { StatusLegend } from "@/components/dashboard/StatusLegend";
import { Button } from "@/components/ui/button";
import { Calendar, CheckSquare, Plus, UserCheck, UserX } from "lucide-react";

interface ReceptionistDashboardProps {
  onLogout: () => void;
}

const ReceptionistDashboard = ({ onLogout }: ReceptionistDashboardProps) => {
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
                    Request Room Cleaning
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

export default ReceptionistDashboard;
