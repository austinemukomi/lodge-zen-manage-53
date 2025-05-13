
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Room, RoomStatus } from "@/utils/types";
import { 
  Bed, 
  Users, 
  Clock, 
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample data for rooms
const sampleRooms: Room[] = [
  {
    id: "1",
    number: "101",
    type: "standard",
    status: "available",
    pricePerHour: 20,
    pricePerDay: 100,
    priceOvernight: 80,
    floor: 1,
    capacity: 2
  },
  {
    id: "2",
    number: "102",
    type: "standard",
    status: "occupied",
    pricePerHour: 20,
    pricePerDay: 100,
    priceOvernight: 80,
    floor: 1,
    capacity: 2
  },
  {
    id: "3",
    number: "103",
    type: "deluxe",
    status: "cleaning",
    pricePerHour: 30,
    pricePerDay: 150,
    priceOvernight: 120,
    floor: 1,
    capacity: 3
  },
  {
    id: "4",
    number: "201",
    type: "suite",
    status: "reserved",
    pricePerHour: 50,
    pricePerDay: 250,
    priceOvernight: 200,
    floor: 2,
    capacity: 4
  },
  {
    id: "5",
    number: "202",
    type: "standard",
    status: "available",
    pricePerHour: 20,
    pricePerDay: 100,
    priceOvernight: 80,
    floor: 2,
    capacity: 2
  },
  {
    id: "6",
    number: "203",
    type: "deluxe",
    status: "available",
    pricePerHour: 30,
    pricePerDay: 150,
    priceOvernight: 120,
    floor: 2,
    capacity: 3
  },
  {
    id: "7",
    number: "301",
    type: "suite",
    status: "occupied",
    pricePerHour: 50,
    pricePerDay: 250,
    priceOvernight: 200,
    floor: 3,
    capacity: 4
  },
  {
    id: "8",
    number: "302",
    type: "standard",
    status: "cleaning",
    pricePerHour: 20,
    pricePerDay: 100,
    priceOvernight: 80,
    floor: 3,
    capacity: 2
  }
];

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
      className={cn("room-card", room.status)}
      onClick={() => onClick(room)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">Room {room.number}</h3>
        <div className={cn(
          "status-badge",
          room.status
        )}>
          <div className="flex items-center">
            {statusIcon[room.status]}
            <span>{statusLabel[room.status]}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex items-center text-gray-600 text-sm mt-2">
          <Bed className="w-4 h-4 mr-2" /> 
          <span>{roomTypeLabel[room.type]}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mt-2">
          <Users className="w-4 h-4 mr-2" /> 
          <span>Capacity: {room.capacity}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mt-2">
          <Clock className="w-4 h-4 mr-2" /> 
          <span>${room.pricePerHour}/hour • ${room.pricePerDay}/day</span>
        </div>
      </div>
      
      <div className="mt-3">
        <Button 
          variant={room.status === "available" ? "default" : "outline"}
          size="sm"
          className="w-full"
          disabled={room.status !== "available"}
        >
          {room.status === "available" ? "Book Now" : statusLabel[room.status]}
        </Button>
      </div>
    </div>
  );
};

interface RoomGridProps {
  className?: string;
}

export function RoomGrid({ className }: RoomGridProps) {
  const [rooms] = useState<Room[]>(sampleRooms);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [filter, setFilter] = useState<RoomStatus | "all">("all");
  
  const handleRoomClick = (room: Room) => {
    console.log("Room clicked:", room);
    // Open room details modal or navigate to room details page
  };

  const filteredRooms = rooms.filter(room => {
    if (selectedFloor && room.floor !== selectedFloor) return false;
    if (filter !== "all" && room.status !== filter) return false;
    return true;
  });
  
  // Get unique floors
  const floors = [...new Set(rooms.map(room => room.floor))];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
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
        
        <div className="flex items-center space-x-2">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} onClick={handleRoomClick} />
        ))}
      </div>
    </div>
  );
}
