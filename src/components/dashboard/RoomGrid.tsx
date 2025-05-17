import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Room, RoomStatus } from "@/utils/types";
import { 
  Bed, 
  Users, 
  Clock, 
  Calendar,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RoomCardProps {
  room: Room;
  onStatusChange: (roomId: string, newStatus: RoomStatus) => Promise<void>;
  bookingEnabled?: boolean;
  onBookRoom?: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onStatusChange, bookingEnabled = false, onBookRoom }) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus>(room.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Convert status to lowercase for consistency in UI
  const normalizedStatus = room.status.toLowerCase() as "available" | "occupied" | "cleaning" | "reserved";

  const statusClasses = {
    available: "bg-green-100 text-green-800",
    occupied: "bg-red-100 text-red-800",
    cleaning: "bg-yellow-100 text-yellow-800",
    reserved: "bg-blue-100 text-blue-800",
  };

  const statusIcon = {
    available: <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-1.5" />,
    occupied: <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-1.5" />,
    cleaning: <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse mr-1.5" />,
    reserved: <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-1.5" />,
  };

  const roomTypeLabel = {
    standard: "Standard",
    deluxe: "Deluxe",
    suite: "Suite",
  };

  const statusLabel = {
    available: "Available",
    occupied: "Occupied",
    cleaning: "Cleaning",
    reserved: "Reserved",
  };

  const handleStatusChange = async () => {
    try {
      setIsSubmitting(true);
      await onStatusChange(room.id, selectedStatus);
      toast({
        title: "Status Updated",
        description: `Room ${room.number} status updated to ${selectedStatus}`,
      });
      setIsEditingStatus(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update room status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookRoom = () => {
    if (onBookRoom) {
      onBookRoom(room.id);
    }
  };

  // Helper function to determine if a room is available
  const isAvailable = () => {
    return room.status === "AVAILABLE" || room.status === "available";
  };

  return (
    <div 
      className={cn(
        "room-card border rounded-lg p-4 shadow-sm flex flex-col justify-between h-full",
        `border-l-4 border-l-${normalizedStatus === 'available' ? 'green' : normalizedStatus === 'occupied' ? 'red' : normalizedStatus === 'cleaning' ? 'yellow' : 'blue'}-500`
      )}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg">Room {room.number}</h3>
          <div className="flex items-center gap-2">
            <div className={cn(
              "px-2 py-0.5 rounded-full text-xs flex items-center",
              statusClasses[normalizedStatus]
            )}>
              {statusIcon[normalizedStatus]}
              <span>{statusLabel[normalizedStatus]}</span>
            </div>
            {!bookingEnabled && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsEditingStatus(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Bed className="w-4 h-4 mr-2" /> 
            <span>{room.category?.name || (room.type ? roomTypeLabel[room.type] : "Standard")}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="w-4 h-4 mr-2" /> 
            <span>Capacity: {room.maxOccupancy || room.capacity || 2}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-2" /> 
            <span>${room.baseHourlyRate || room.pricePerHour || 25}/hour • ${room.baseDailyRate || room.pricePerDay || 100}/day</span>
          </div>
          
          {room.specialFeatures && (
            <div className="text-gray-600 text-sm mt-2">
              <p className="italic">{room.specialFeatures}</p>
            </div>
          )}
        </div>
      </div>
      
      {bookingEnabled ? (
        <Button 
          variant={isAvailable() ? "default" : "outline"}
          size="sm"
          className="w-full mt-2"
          disabled={!isAvailable()}
          onClick={handleBookRoom}
        >
          {isAvailable() ? "Book Now" : "Not Available"}
        </Button>
      ) : (
        <Button 
          variant={isAvailable() ? "default" : "outline"}
          size="sm"
          className="w-full mt-2"
          disabled={!isAvailable()}
        >
          {isAvailable() ? "Assign Room" : statusLabel[normalizedStatus]}
        </Button>
      )}

      <Dialog open={isEditingStatus} onOpenChange={setIsEditingStatus}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Room Status</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select 
              value={selectedStatus} 
              onValueChange={(value) => setSelectedStatus(value as RoomStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
                <SelectItem value="CLEANING">Cleaning</SelectItem>
                <SelectItem value="RESERVED">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingStatus(false)}>Cancel</Button>
            <Button 
              onClick={handleStatusChange} 
              disabled={isSubmitting || selectedStatus === room.status}
            >
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface RoomGridProps {
  className?: string;
  onStatusUpdate?: (roomId: string, newStatus: RoomStatus) => Promise<void>;
  filterStatus?: RoomStatus | "all";
  bookingEnabled?: boolean;
  onBookRoom?: (roomId: string) => void;
}

export function RoomGrid({ 
  className, 
  onStatusUpdate,
  filterStatus = "all",
  bookingEnabled = false,
  onBookRoom
}: RoomGridProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [filter, setFilter] = useState<RoomStatus | "all">(filterStatus);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (filterStatus !== "all") {
      setFilter(filterStatus);
    }
  }, [filterStatus]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/rooms");
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data = await response.json();
      
      // Convert API response to match our Room type
      const formattedRooms = data.map((room: any) => {
        // Keep the original status format from API
        const status = room.status as RoomStatus;
        
        return {
          id: room.id.toString(),
          number: room.roomNumber,
          type: room.category?.name?.toLowerCase().includes("deluxe") ? "deluxe" : 
                room.category?.name?.toLowerCase().includes("suite") ? "suite" : "standard",
          status,
          pricePerHour: room.baseHourlyRate || 25,
          pricePerDay: room.baseDailyRate || 100,
          floor: room.floor,
          capacity: room.maxOccupancy || 2,
          lastCleaned: room.lastCleanedAt ? new Date(room.lastCleanedAt) : undefined,
          category: room.category,
          baseHourlyRate: room.baseHourlyRate || 25,
          baseDailyRate: room.baseDailyRate || 100,
          maxOccupancy: room.maxOccupancy || 2,
          specialFeatures: room.specialFeatures
        };
      });
      
      setRooms(formattedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "Error",
        description: "Failed to load rooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (roomId: string, newStatus: RoomStatus) => {
    try {
      // For RESERVED status, use a boolean value in the request body
      const isReserved = newStatus === "RESERVED" || newStatus === "reserved";
      
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus.toUpperCase(),
          reserved: isReserved // Add the boolean value for RESERVED status
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update room status");
      }

      // Update local state
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? { ...room, status: newStatus } : room
        )
      );

      return Promise.resolve();
    } catch (error) {
      console.error("Error updating room status:", error);
      return Promise.reject(error);
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (selectedFloor && room.floor !== selectedFloor) return false;
    if (filter !== "all") {
      // Case insensitive comparison for status filtering
      const normalizedRoomStatus = room.status.toUpperCase();
      const normalizedFilter = filter.toUpperCase();
      if (normalizedRoomStatus !== normalizedFilter) return false;
    }
    return true;
  });
  
  // Get unique floors
  const floors = [...new Set(rooms.map(room => room.floor))];

  const handleBookRoom = (roomId: string) => {
    if (onBookRoom) {
      onBookRoom(roomId);
    } else {
      toast({
        title: "Booking Initiated",
        description: "Please complete the booking form to reserve this room."
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading rooms...</div>;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedFloor === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFloor(null)}
          >
            All Floors
          </Button>
          
          {floors.map(floor => (
            <Button
              key={floor}
              variant={selectedFloor === floor ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFloor(floor)}
            >
              Floor {floor}
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "AVAILABLE" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("AVAILABLE")}
            className="text-green-700 border-green-200 hover:bg-green-50"
          >
            Available
          </Button>
          <Button
            variant={filter === "OCCUPIED" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("OCCUPIED")}
            className="text-red-700 border-red-200 hover:bg-red-50"
          >
            Occupied
          </Button>
          <Button
            variant={filter === "CLEANING" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("CLEANING")}
            className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
          >
            Cleaning
          </Button>
          <Button
            variant={filter === "RESERVED" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("RESERVED")}
            className="text-blue-700 border-blue-200 hover:bg-blue-50"
          >
            Reserved
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onStatusChange={onStatusUpdate || handleStatusUpdate}
              bookingEnabled={bookingEnabled}
              onBookRoom={handleBookRoom}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No rooms match the current filters
          </div>
        )}
      </div>
    </div>
  );
}
