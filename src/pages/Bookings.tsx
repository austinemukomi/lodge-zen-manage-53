
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

interface BookingsProps {
  onLogout: () => void;
}

const Bookings: React.FC<BookingsProps> = ({ onLogout }) => {
  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Bookings</h2>
            <p className="text-gray-600">Manage all bookings</p>
          </div>
          
          {/* Bookings content goes here */}
          <div className="text-center text-gray-500 mt-12">
            <p>No bookings available at the moment.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Bookings;
