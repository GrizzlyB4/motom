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
  imageUrl: string;
  sellerEmail: string;
  category: Exclude<MotorcycleCategory, 'All'>;
}

export interface User {
  email: string;
}
