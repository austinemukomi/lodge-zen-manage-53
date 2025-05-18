
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AllBookingsTable } from "@/components/booking/AllBookingsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

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
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <AllBookingsTable />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Bookings;
