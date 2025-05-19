import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pencil, Home, List, Upload, Trash2, Power, RefreshCw } from "lucide-react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Type definitions for forms
interface CategoryFormValues {
  name: string;
  description: string;
  baseHourlyRate: number;
  baseDailyRate: number;
  overnightRate: number;
  maxOccupancy: number;
  amenities: string[];
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

interface RoomCategory {
  id: string;
  name: string;
  description: string;
  baseHourlyRate: number;
  baseDailyRate: number;
  overnightRate: number;
  maxOccupancy: number;
  amenities: string[];
  weekendSurcharge: number;
  refundableDeposit: number;
  minimumBookingHours: number;
  active: boolean;
  images?: string[];
  roomCount?: number;
}

interface Room {
  id: string;
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
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      
      // Fetch images for each category
      const categoriesWithImages = await Promise.all(
        data.map(async (category) => {
          try {
            const imageResponse = await fetch(`http://localhost:8080/api/room-categories/${category.id}/images`);
            
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              console.log(imageData);
              return { ...category, images: imageData };
            }
          } catch (error) {
            console.error(`Error fetching images for category ${category.id}:`, error);
          }
          return category;
        })
      );
      
      setRoomCategories(categoriesWithImages);
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
      amenities: [],
      weekendSurcharge: 0,
      refundableDeposit: 0,
      minimumBookingHours: 1,
      active: true
    }
  });

  const editCategoryForm = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
      baseHourlyRate: 0,
      baseDailyRate: 0,
      overnightRate: 0,
      maxOccupancy: 2,
      amenities: [],
      weekendSurcharge: 0,
      refundableDeposit: 0,
      minimumBookingHours: 1,
      active: true
    }
  });

  // Room form setup - changing AVAILABLE to available
  const roomForm = useForm<RoomFormValues>({
    defaultValues: {
      roomNumber: "",
      categoryId: "",
      status: "AVAILABLE", // Changed from "AVAILABLE" to "available" to match RoomStatus type
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

  const handleEditCategorySubmit = async (data: CategoryFormValues) => {
    if (!selectedCategory) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/room-categories/${selectedCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      toast({
        title: "Category Updated",
        description: `${data.name} category has been updated successfully.`,
      });
      
      setEditCategoryOpen(false);
      editCategoryForm.reset();
      // Refresh the categories list
      await fetchRoomCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
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
      await fetchRoomCategories();
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

  const handleCategoryImageUpload = async (categoryId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      
      // Append all selected files to the FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      
      const response = await fetch(`http://localhost:8080/api/room-categories/${categoryId}/images`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload images");
      }
      
      toast({
        title: "Images Uploaded",
        description: "Category images have been uploaded successfully.",
      });
      
      // Refresh the categories list to show updated images
      await fetchRoomCategories();
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/room-categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      toast({
        title: "Category Deleted",
        description: "The room category has been deleted successfully.",
      });
      
      // Refresh the categories list
      await fetchRoomCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/room-categories/${categoryId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update category status");
      }

      toast({
        title: "Status Updated",
        description: `Category status has been ${!currentStatus ? "activated" : "deactivated"} successfully.`,
      });
      
      // Refresh the categories list
      await fetchRoomCategories();
    } catch (error) {
      console.error("Error updating category status:", error);
      toast({
        title: "Error",
        description: "Failed to update category status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (categoryId: string, imageUrl: string) => {
    try {
      const fileName = imageUrl.split('/').pop();
      if (!fileName) return;
      
      const response = await fetch(`http://localhost:8080/api/room-categories/${categoryId}/images`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      toast({
        title: "Image Deleted",
        description: "The image has been deleted successfully.",
      });
      
      // Refresh the categories list
      await fetchRoomCategories();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateRoomStatus = async (roomId: string, newStatus: RoomStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update room status");
      }

      toast({
        title: "Room Status Updated",
        description: `Room status has been updated to ${newStatus.toLowerCase()}.`,
      });
      
      // Refresh the data
      await fetchRoomCategories();
    } catch (error) {
      console.error("Error updating room status:", error);
      toast({
        title: "Error",
        description: "Failed to update room status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = (category: RoomCategory) => {
    setSelectedCategory(category);
    editCategoryForm.reset({
      name: category.name,
      description: category.description,
      baseHourlyRate: category.baseHourlyRate,
      baseDailyRate: category.baseDailyRate,
      overnightRate: category.overnightRate,
      maxOccupancy: category.maxOccupancy,
      amenities: category.amenities || [],
      weekendSurcharge: category.weekendSurcharge,
      refundableDeposit: category.refundableDeposit,
      minimumBookingHours: category.minimumBookingHours,
      active: category.active
    });
    setEditCategoryOpen(true);
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
                              <SelectItem value="AVAILABLE">Available</SelectItem>
                              <SelectItem value="OCCUPIED">Occupied</SelectItem>
                              <SelectItem value="CLEANING">Cleaning</SelectItem>
                              <SelectItem value="RESERVED">Reserved</SelectItem>
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
                        <Select 
                          onValueChange={(value) => {
                            if (!field.value.includes(value)) {
                              field.onChange([...field.value, value]);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select amenities" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {amenitiesOptions.filter(amenity => !field.value.includes(amenity)).map((amenity) => (
                              <SelectItem key={amenity} value={amenity}>{amenity}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map(amenity => (
                            <div key={amenity} className="bg-gray-100 px-2 py-1 rounded-md flex items-center">
                              <span className="text-sm">{amenity}</span>
                              <button 
                                type="button" 
                                className="ml-2 text-gray-500 hover:text-red-500"
                                onClick={() => {
                                  field.onChange(field.value.filter(a => a !== amenity));
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
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
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Category"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Room Category</DialogTitle>
              </DialogHeader>
              <Form {...editCategoryForm}>
                <form onSubmit={editCategoryForm.handleSubmit(handleEditCategorySubmit)} className="space-y-4">
                  <FormField
                    control={editCategoryForm.control}
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
                    control={editCategoryForm.control}
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
                      control={editCategoryForm.control}
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
                      control={editCategoryForm.control}
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
                      control={editCategoryForm.control}
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
                    control={editCategoryForm.control}
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
                    control={editCategoryForm.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amenities</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            if (!field.value.includes(value)) {
                              field.onChange([...field.value, value]);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select amenities" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {amenitiesOptions.filter(amenity => !field.value.includes(amenity)).map((amenity) => (
                              <SelectItem key={amenity} value={amenity}>{amenity}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map(amenity => (
                            <div key={amenity} className="bg-gray-100 px-2 py-1 rounded-md flex items-center">
                              <span className="text-sm">{amenity}</span>
                              <button 
                                type="button" 
                                className="ml-2 text-gray-500 hover:text-red-500"
                                onClick={() => {
                                  field.onChange(field.value.filter(a => a !== amenity));
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={editCategoryForm.control}
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
                      control={editCategoryForm.control}
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
                      control={editCategoryForm.control}
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
                    control={editCategoryForm.control}
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
                  
                  {selectedCategory && (
                    <div className="space-y-4">
                      <FormLabel>Category Images</FormLabel>
                      {/* Show existing images */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {selectedCategory.images && selectedCategory.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={img} 
                              alt={`${selectedCategory.name} ${index+1}`} 
                              className="w-full h-24 object-contain rounded-md" width={24}
                            />
                            <button 
                              type="button"
                              onClick={() => handleDeleteImage(selectedCategory.id, img)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Upload new images */}
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-3 pb-3">
                            <Upload className="w-6 h-6 mb-1 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span>
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={(e) => handleCategoryImageUpload(selectedCategory.id, e.target.files)}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update Category"}
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
              {/* We don't pass onStatusUpdate prop here since RoomGrid doesn't accept it */}
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
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setActiveRoomsTab("categories")}>
                    Manage Categories
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setAddRoomOpen(true)}>
                    Add New Room
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Check Room Availability
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
                     
                      <div className="w-full">
                        {/* Display the first image as a featured image if available */}
                        {category.images && category.images.length > 0 && (
                          <div className="mb-3 w-full">
                            <img 
                              src={category.images[0]} 
                              alt={`${category.name}`}
                              className="w-full h-48 object-contain rounded-md" 
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-medium">{category.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {category.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Array.isArray(category.amenities) &&
                            category.amenities.map((amenity, i) => (
                              <span
                                key={i}
                                className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                              >
                                {amenity}
                              </span>
                            ))}
                        </div>

                        <p className="text-xs mt-2">Rooms: {category.roomCount || 0} | Base Rate: ${category.baseHourlyRate}/hr</p>
                      </div>
                      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        <Button size="sm" variant="outline" onClick={() => setAddRoomOpen(true)}>
                          <PlusCircle className="h-4 w-4 mr-1" /> Add Room
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant={category.active ? "outline" : "default"}
                          onClick={() => toggleCategoryStatus(category.id, category.active)}
                        >
                          <Power className="h-4 w-4 mr-1" /> {category.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the {category.name} category and cannot be undone.
                                Any rooms assigned to this category will be affected.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    {/* Display all category images in a smaller grid */}
                    {category.images && category.images.length > 1 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {category.images.slice(1).map((img, index) => (
                            <img 
                              key={index} 
                              src={img} 
                              alt={`${category.name} ${index+1}`}
                              className="h-20 w-full object-cover rounded-md" 
                            />
                          ))}
                        </div>
                      </div>
                    )}
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
