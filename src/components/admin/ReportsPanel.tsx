
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; 
import { BarChart3, LineChart, PieChart } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart as RechartLineChart,
  Line,
  PieChart as RechartPieChart,
  Pie,
  Cell
} from 'recharts';

export function ReportsPanel() {
  const [reportPeriod, setReportPeriod] = useState("daily");

  // Mock data for financial reports
  const revenueData = [
    { name: 'Mon', revenue: 1200, expenses: 800, profit: 400 },
    { name: 'Tue', revenue: 1500, expenses: 900, profit: 600 },
    { name: 'Wed', revenue: 1300, expenses: 850, profit: 450 },
    { name: 'Thu', revenue: 1400, expenses: 950, profit: 450 },
    { name: 'Fri', revenue: 1800, expenses: 1000, profit: 800 },
    { name: 'Sat', revenue: 2200, expenses: 1200, profit: 1000 },
    { name: 'Sun', revenue: 1900, expenses: 1100, profit: 800 },
  ];

  // Mock data for occupancy rate
  const occupancyData = [
    { name: '12 AM', rate: 70 },
    { name: '2 AM', rate: 75 },
    { name: '4 AM', rate: 78 },
    { name: '6 AM', rate: 65 },
    { name: '8 AM', rate: 50 },
    { name: '10 AM', rate: 45 },
    { name: '12 PM', rate: 60 },
    { name: '2 PM', rate: 70 },
    { name: '4 PM', rate: 85 },
    { name: '6 PM', rate: 90 },
    { name: '8 PM', rate: 95 },
    { name: '10 PM', rate: 80 },
  ];

  // Mock data for room type distribution
  const roomTypeData = [
    { name: 'Standard', value: 25 },
    { name: 'Deluxe', value: 15 },
    { name: 'Suite', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Reports & Analytics</h3>
          <p className="text-gray-600">View financial reports and occupancy metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export
          </Button>
          <Button variant="outline">
            Print
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-gray-500">This week</p>
            <div className="text-sm text-green-600 mt-2">↑ 15% from last week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-gray-500">Current occupancy</p>
            <div className="text-sm text-green-600 mt-2">↑ 8% from last week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Popular Room</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Deluxe</div>
            <p className="text-xs text-gray-500">Most booked room type</p>
            <div className="text-sm mt-2">92% occupancy rate</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="financial">
        <TabsList className="mb-4">
          <TabsTrigger value="financial" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span>Financial Reports</span>
          </TabsTrigger>
          <TabsTrigger value="occupancy" className="flex items-center">
            <LineChart className="w-4 h-4 mr-2" />
            <span>Occupancy Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            <span>Room Distribution</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Revenue, Expenses & Profit</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setReportPeriod("daily")} 
                    className={reportPeriod === "daily" ? "bg-primary/10" : ""}>
                    Daily
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setReportPeriod("weekly")}
                    className={reportPeriod === "weekly" ? "bg-primary/10" : ""}>
                    Weekly
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setReportPeriod("monthly")}
                    className={reportPeriod === "monthly" ? "bg-primary/10" : ""}>
                    Monthly
                  </Button>
                </div>
              </div>
              <CardDescription>Overview of financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    <Bar dataKey="profit" name="Profit" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="occupancy">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate (24 hours)</CardTitle>
              <CardDescription>Percentage of rooms occupied throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartLineChart data={occupancyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rate" name="Occupancy Rate %" stroke="#4f46e5" activeDot={{ r: 8 }} />
                  </RechartLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Room Type Distribution</CardTitle>
              <CardDescription>Breakdown of room types in the hotel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <Pie
                      data={roomTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {roomTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
