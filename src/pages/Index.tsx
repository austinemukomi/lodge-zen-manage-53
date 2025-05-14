
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-600">Welcome back!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium text-accent mb-2">Hotel Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Rooms</p>
                  <p className="text-2xl font-semibold">45</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="text-2xl font-semibold text-green-600">28</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupied</p>
                  <p className="text-2xl font-semibold text-purple-600">17</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reserved</p>
                  <p className="text-2xl font-semibold text-amber-600">5</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium text-accent mb-2">Revenue</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Today's Revenue</p>
                <p className="text-2xl font-semibold">$1,250</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-lg font-medium text-green-600">$8,730 <span className="text-xs text-green-500">↑12%</span></p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium text-accent mb-2">Guests</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Check-ins Today</p>
                <p className="text-2xl font-semibold">8</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check-outs Today</p>
                <p className="text-2xl font-semibold">5</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium text-accent mb-2">Staff</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Receptionists</p>
                  <p className="text-2xl font-semibold">4</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cleaners</p>
                  <p className="text-2xl font-semibold">6</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">On Duty</p>
                  <p className="text-2xl font-semibold text-green-600">8</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Off Duty</p>
                  <p className="text-2xl font-semibold">2</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* More admin-specific sections would go here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
