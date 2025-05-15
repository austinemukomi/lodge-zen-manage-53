
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pencil, Home, List, Upload } from "lucide-react";
import { RoomGrid } from "@/components/dashboard/RoomGrid";
import { StatusLegend } from "@/components/dashboard/StatusLegend";
import { RoomType, RoomStatus } from "@/utils/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

// Type definitions for forms
interface CategoryFormValues {
  name: string;
  description: string;
  baseHourlyRate: number;
  baseDailyRate: number;
  overnightRate: number;
  maxOccupancy: number;
  amenities: string;
  weekendSurcharge: number;
  refundableDeposit: number;
  minimumBookingHours: number;
  active: boolean;
}

interface RoomFormValues {
  roomNumber: string;
  categoryId: string;
  status: RoomStatus;
  floor: number;
  specialFeatures: string;
  weekendSurcharge: number;
  refundableDeposit: number;
  minimumBookingHours: number;
  active: boolean;
}

// Available amenities options
const amenitiesOptions = [
  "WiFi",
  "Air Conditioning",
  "TV",
  "Mini Bar",
  "Refrigerator",
  "Safe",
  "Balcony",
  "Ocean View",
  "City View",
  "Coffee Maker",
  "Room Service",
  "Private Bathroom",
  "King Bed",
  "Queen Bed",
  "Twin Beds"
];

export function RoomsManagement() {
  const [activeRoomsTab, setActiveRoomsTab] = useState("status-board");
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [roomCategories, setRoomCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoomCategories();
  }, []);

  // Fetch room categories from API
  const fetchRoomCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/room-categories");
      if (!response.ok) {
        throw new Error("Failed to fetch room categories");
      }
      const data = await response.json();
      setRoomCategories(data);
    } catch (error) {
      console.error("Error fetching room categories:", error);
      toast({
        title: "Error",
        description: "Failed to load room categories. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Category form setup
  const categoryForm = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
      baseHourlyRate: 0,
      baseDailyRate: 0,
      overnightRate: 0,
      maxOccupancy: 2,
      amenities: "",
      weekendSurcharge: 0,
      refundableDeposit: 0,
      minimumBookingHours: 1,
      active: true
    }
  });

  // Room form setup
  const roomForm = useForm<RoomFormValues>({
    defaultValues: {
      roomNumber: "",
      categoryId: "",
      status: "available",
      floor: 1,
      specialFeatures: "",
      weekendSurcharge: 0,
      refundableDeposit: 0,
      minimumBookingHours: 1,
      active: true
    }
  });

  // Form submission handlers
  const handleCategorySubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/room-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      toast({
        title: "Category Added",
        description: `${data.name} category has been added successfully.`,
      });
      
      setAddCategoryOpen(false);
      categoryForm.reset();
      // Refresh the categories list
      await fetchRoomCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomSubmit = async (data: RoomFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/rooms?categoryId=${data.categoryId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add room");
      }

      toast({
        title: "Room Added",
        description: `Room ${data.roomNumber} has been added successfully.`,
      });
      
      setAddRoomOpen(false);
      roomForm.reset();
    } catch (error) {
      console.error("Error adding room:", error);
      toast({
        title: "Error",
        description: "Failed to add room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Room Management</h3>
          <p className="text-gray-600">Manage room categories, status and details</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={addRoomOpen} onOpenChange={setAddRoomOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
              </DialogHeader>
              <Form {...roomForm}>
                <form onSubmit={roomForm.handleSubmit(handleRoomSubmit)} className="space-y-4">
                  <FormField
                    control={roomForm.control}
                    name="roomNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={roomForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roomCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={roomForm.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={roomForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange as any} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="occupied">Occupied</SelectItem>
                              <SelectItem value="cleaning">Cleaning</SelectItem>
                              <SelectItem value="reserved">Reserved</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={roomForm.control}
                    name="specialFeatures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Features</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Special features or notes about this room" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={roomForm.control}
                      name="weekendSurcharge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekend Surcharge</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={roomForm.control}
                      name="refundableDeposit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Refundable Deposit</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={roomForm.control}
                      name="minimumBookingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min. Booking Hours</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={roomForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            This room will be available for booking if active.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Room"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Room Category</DialogTitle>
              </DialogHeader>
              <Form {...categoryForm}>
                <form onSubmit={categoryForm.handleSubmit(handleCategorySubmit)} className="space-y-4">
                  <FormField
                    control={categoryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Standard, Deluxe, Suite" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={categoryForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe this room category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={categoryForm.control}
                      name="baseHourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={categoryForm.control}
                      name="baseDailyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Daily Rate ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={categoryForm.control}
                      name="overnightRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Overnight Rate ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={categoryForm.control}
                    name="maxOccupancy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Occupancy</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={categoryForm.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amenities</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select amenities" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {amenitiesOptions.map((amenity) => (
                              <SelectItem key={amenity} value={amenity}>{amenity}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={categoryForm.control}
                      name="weekendSurcharge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekend Surcharge ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={categoryForm.control}
                      name="refundableDeposit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Refundable Deposit ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={categoryForm.control}
                      name="minimumBookingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min. Booking Hours</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={categoryForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            This category will be available for room assignments if active.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <FormLabel>Category Images</FormLabel>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" multiple />
                      </label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Category"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="status-board" value={activeRoomsTab} onValueChange={setActiveRoomsTab}>
        <TabsList className="flex-wrap">
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
            <Button className="w-fit" onClick={() => setAddCategoryOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add New Category
            </Button>
            
            <div className="grid gap-4">
              {roomCategories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-medium">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <p className="text-xs mt-1">Rooms: {category.roomCount || 0}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setAddRoomOpen(true)}>
                          <PlusCircle className="h-4 w-4 mr-1" /> Add Room
                        </Button>
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
