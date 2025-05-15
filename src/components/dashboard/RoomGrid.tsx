
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Room, RoomStatus } from "@/utils/types";
import { 
  Bed, 
  Users, 
  Clock, 
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface RoomCardProps {
  room: Room;
  onClick: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  const statusClasses = {
    available: "bg-green-100 text-green-800",
    occupied: "bg-red-100 text-red-800",
    cleaning: "bg-yellow-100 text-yellow-800",
    reserved: "bg-blue-100 text-blue-800",
  };

  const statusIcon = {
    available: <div className="w-3 h-3 bg-room-available rounded-full animate-status-pulse mr-1.5" />,
    occupied: <div className="w-3 h-3 bg-room-occupied rounded-full animate-status-pulse mr-1.5" />,
    cleaning: <div className="w-3 h-3 bg-room-cleaning rounded-full animate-status-pulse mr-1.5" />,
    reserved: <div className="w-3 h-3 bg-room-reserved rounded-full animate-status-pulse mr-1.5" />,
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

  return (
    <div 
      className={cn(
        "room-card border rounded-lg p-4 shadow-sm flex flex-col justify-between h-full",
        `border-l-4 border-l-${room.status === 'available' ? 'green' : room.status === 'occupied' ? 'red' : room.status === 'cleaning' ? 'yellow' : 'blue'}-500`
      )}
      onClick={() => onClick(room)}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg">Room {room.roomNumber}</h3>
          <div className={cn(
            "px-2 py-0.5 rounded-full text-xs flex items-center",
            statusClasses[room.status]
          )}>
            {statusIcon[room.status]}
            <span>{statusLabel[room.status]}</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Bed className="w-4 h-4 mr-2" /> 
            <span>{room.categoryName || "Standard"}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="w-4 h-4 mr-2" /> 
            <span>Capacity: {room.maxOccupancy || 2}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-2" /> 
            <span>${room.baseHourlyRate}/hour • ${room.baseDailyRate}/day</span>
          </div>
        </div>
      </div>
      
      <Button 
        variant={room.status === "available" ? "default" : "outline"}
        size="sm"
        className="w-full mt-2"
        disabled={room.status !== "available"}
      >
        {room.status === "available" ? "Book Now" : statusLabel[room.status]}
      </Button>
    </div>
  );
};

interface RoomGridProps {
  className?: string;
  onStatusUpdate?: (roomId: string, newStatus: RoomStatus) => Promise<void>;
}

export function RoomGrid({ className, onStatusUpdate }: RoomGridProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [filter, setFilter] = useState<RoomStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/rooms");
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data = await response.json();
      setRooms(data);
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

  const handleRoomClick = (room: Room) => {
    console.log("Room clicked:", room);
    // Open room details modal or navigate to room details page
    if (onStatusUpdate) {
      // If onStatusUpdate is provided, we can use it
      // This is optional since we've made the prop optional
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (selectedFloor && room.floor !== selectedFloor) return false;
    if (filter !== "all" && room.status !== filter) return false;
    return true;
  });
  
  // Get unique floors
  const floors = [...new Set(rooms.map(room => room.floor))];

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
            variant={filter === "available" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("available")}
            className="border-room-available text-room-available hover:bg-green-50"
          >
            Available
          </Button>
          <Button
            variant={filter === "occupied" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("occupied")}
            className="border-room-occupied text-room-occupied hover:bg-red-50"
          >
            Occupied
          </Button>
          <Button
            variant={filter === "cleaning" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("cleaning")}
            className="border-room-cleaning text-room-cleaning hover:bg-yellow-50"
          >
            Cleaning
          </Button>
          <Button
            variant={filter === "reserved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("reserved")}
            className="border-room-reserved text-room-reserved hover:bg-blue-50"
          >
            Reserved
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onClick={handleRoomClick} />
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
