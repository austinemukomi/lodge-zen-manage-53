
import React from "react";

export function StatusLegend() {
  const statuses = [
    {
      name: "Available",
      color: "bg-room-available",
      description: "Room is clean and ready for check-in",
    },
    {
      name: "Occupied",
      color: "bg-room-occupied",
      description: "Room is currently in use by a guest",
    },
    {
      name: "Needs Cleaning",
      color: "bg-room-cleaning",
      description: "Room needs to be cleaned before next guest",
    },
    {
      name: "Reserved",
      color: "bg-room-reserved",
      description: "Room is booked but guest hasn't checked in yet",
    },
  ];

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border">
      <h3 className="font-medium text-lg mb-3">Room Status Legend</h3>
      <div className="space-y-3">
        {statuses.map((status) => (
          <div key={status.name} className="flex items-start">
            <div className={`w-4 h-4 ${status.color} rounded-full mt-1 mr-3`}></div>
            <div>
              <p className="font-medium">{status.name}</p>
              <p className="text-sm text-gray-500">{status.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
