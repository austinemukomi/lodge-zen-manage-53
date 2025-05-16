
export type UserRole = "ADMIN" | "RECEPTIONIST" | "USER" | "CLEANER";

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "CLEANING" | "RESERVED";

export type RoomType = "standard" | "deluxe" | "suite";

export type BookingDuration = "hourly" | "daily" | "overnight";

export type PaymentMethod = "cash" | "ecocash" | "card";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface RoomCategory {
  id: number;
  name: string;
  description: string;
}

export interface Room {
  id: string;
  number: string;
  roomNumber?: string; // Added to match API response
  type: RoomType;
  status: RoomStatus;
  pricePerHour: number;
  pricePerDay: number;
  priceOvernight: number;
  floor: number;
  capacity: number;
  lastCleaned?: Date;
  
  // Additional properties from API response
  category?: RoomCategory;
  baseHourlyRate?: number;
  baseDailyRate?: number;
  maxOccupancy?: number;
  specialFeatures?: string;
  lastCleanedAt?: string;
}

export interface Guest {
  id: string;
  name: string;
  idNumber: string;
  contact: string;
  email?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  guestId: string;
  checkInDate: Date;
  checkOutDate?: Date;
  duration: BookingDuration;
  status: "pending" | "checked-in" | "checked-out" | "canceled";
  totalPrice: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: "paid" | "pending" | "partial";
  notes?: string;
  createdBy: string;
}
