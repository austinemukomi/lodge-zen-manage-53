
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Calendar, Users, CreditCard } from "lucide-react";

export function AdminOverviewStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Rooms</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-gray-500 mt-1">28 available, 17 occupied</p>
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
              <p className="text-2xl font-bold">$2,450</p>
              <p className="text-xs text-gray-500 mt-1">↑15% from yesterday</p>
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
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-gray-500 mt-1">12 Check-ins, 8 Check-outs</p>
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
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-gray-500 mt-1">8 On duty, 4 Off duty</p>
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
