export type MotorcycleCategory = 'All' | 'Sport' | 'Cruiser' | 'Off-Road' | 'Touring';
export type PartCategory = 'All' | 'Exhausts' | 'Brakes' | 'Tires' | 'Suspension' | 'Electronics';
export type PartCondition = 'new' | 'used' | 'refurbished';
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface Offer {
  id: string;
  itemId: string;
  itemType: 'motorcycle' | 'part';
  buyerEmail: string;
  sellerEmail: string;
  offerAmount: number;
  status: OfferStatus;
  timestamp: number;
}

export interface Motorcycle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineSize: number;
  description: string;
  imageUrls: string[];
  videoUrl?: string;
  sellerEmail: string;
  category: Exclude<MotorcycleCategory, 'All'>;
  status: 'for-sale' | 'sold' | 'reserved';
  location: string;
  featured?: boolean;
  reservedBy?: string;
  stats?: {
    views: number;
    favorites: number;
    chats: number;
  };
}

export interface Part {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrls: string[];
  videoUrl?: string;
  sellerEmail: string;
  category: Exclude<PartCategory, 'All'>;
  condition: PartCondition;
  compatibility: string[]; // e.g., ['Yamaha MT-07 2021-2023', 'Yamaha R7']
  status: 'for-sale' | 'sold' | 'reserved';
  location: string;
  featured?: boolean;
  reservedBy?: string;
  stats?: {
    views: number;
    favorites: number;
    chats: number;
  };
}

export interface User {
  id?: string;
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
  motorcycle_id?: string;
  part_id?: string;
}

export interface SavedSearch {
  id: string;
  searchType: 'motorcycle' | 'part';
  searchTerm: string;
  locationFilter: string;
  priceRange: { min: string; max: string };
  // Motorcycle specific
  motorcycleCategory?: MotorcycleCategory;
  yearRange?: { min: string; max: string };
  engineSizeCategory?: string;
  // Part specific
  partCategory?: PartCategory;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}