export type MotorcycleCategory = 'All' | 'Sport' | 'Cruiser' | 'Off-Road' | 'Touring';

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
}

export interface User {
  email: string;
  profileImageUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderEmail: string;
  text: string;
  timestamp: number;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  motorcycleId: number;
}