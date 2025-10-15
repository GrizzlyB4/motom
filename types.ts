export type MotorcycleCategory = 'All' | 'Sport' | 'Cruiser' | 'Off-Road' | 'Touring';
export type PartCategory = 'All' | 'Exhausts' | 'Brakes' | 'Tires' | 'Suspension' | 'Electronics';
export type PartCondition = 'new' | 'used' | 'refurbished';

export interface Motorcycle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineSize: number;
  description: string;
  imageUrls: string[];
  sellerEmail: string;
  category: Exclude<MotorcycleCategory, 'All'>;
  status: 'for-sale' | 'sold';
  location: string;
  featured?: boolean;
}

export interface Part {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrls: string[];
  sellerEmail: string;
  category: Exclude<PartCategory, 'All'>;
  condition: PartCondition;
  compatibility: string[]; // e.g., ['Yamaha MT-07 2021-2023', 'Yamaha R7']
  status: 'for-sale' | 'sold';
  location: string;
}

export interface User {
  name: string;
  email: string;
  profileImageUrl?: string;
  totalRatingPoints?: number;
  numberOfRatings?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderEmail: string;
  text: string;
  timestamp: number;
  isRead?: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  motorcycleId: number;
}

export interface SavedSearch {
  id: string;
  searchTerm: string;
  locationFilter: string;
  category: MotorcycleCategory;
  priceRange: { min: string; max: string };
  yearRange: { min: string; max: string };
  engineSizeCategory: string;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}