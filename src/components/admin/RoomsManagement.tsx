
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pencil, Home, List } from "lucide-react";
import { RoomGrid } from "@/components/dashboard/RoomGrid";
import { StatusLegend } from "@/components/dashboard/StatusLegend";
import { RoomType, RoomStatus } from "@/utils/types";

export function RoomsManagement() {
  const [activeRoomsTab, setActiveRoomsTab] = useState("status-board");

  // Mock room categories data
  const roomCategories = [
    { id: "1", name: "Standard", description: "Basic room with essential amenities", count: 25 },
    { id: "2", name: "Deluxe", description: "Spacious room with premium features", count: 15 },
    { id: "3", name: "Suite", description: "Luxurious suite with separate living area", count: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Room Management</h3>
          <p className="text-gray-600">Manage room categories, status and details</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> Add Room
          </Button>
          <Button variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>
      </div>

      <Tabs defaultValue="status-board" value={activeRoomsTab} onValueChange={setActiveRoomsTab}>
        <TabsList>
          <TabsTrigger value="status-board" className="flex items-center">
            <Home className="w-4 h-4 mr-2" />
            <span>Room Status Board</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <List className="w-4 h-4 mr-2" />
            <span>Room Categories</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="status-board" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <RoomGrid />
            </div>
            
            <div className="space-y-6">
              <StatusLegend />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Room Status Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Available:</span>
                      <span className="text-sm font-medium text-green-600">28</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Occupied:</span>
                      <span className="text-sm font-medium text-red-600">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cleaning:</span>
                      <span className="text-sm font-medium text-amber-600">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Reserved:</span>
                      <span className="text-sm font-medium text-blue-600">2</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium">Total Rooms:</span>
                      <span className="text-sm font-medium">45</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Update Room Status
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Assign Room to Guest
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Request Room Cleaning
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <div className="grid gap-6">
            <Button className="w-fit">
              <PlusCircle className="h-4 w-4 mr-2" /> Add New Category
            </Button>
            
            <div className="grid gap-4">
              {roomCategories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <p className="text-xs mt-1">Rooms: {category.count}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
