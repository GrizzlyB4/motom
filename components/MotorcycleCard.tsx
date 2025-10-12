import React from 'react';
import { Motorcycle } from '../types';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onSelect: (moto: Motorcycle) => void;
}

const MotorcycleCard: React.FC<MotorcycleCardProps> = ({ motorcycle, onSelect }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(motorcycle.price);

  return (
    <div 
      className="bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
      onClick={() => onSelect(motorcycle)}
    >
      <div 
        className="w-full h-48 bg-center bg-no-repeat bg-cover" 
        style={{ backgroundImage: `url("${motorcycle.imageUrl}")` }}
      ></div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark truncate">{motorcycle.make} {motorcycle.model}</h3>
        <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1">{motorcycle.year} · {motorcycle.engineSize}cc</p>
        <p className="text-xl font-bold text-primary mt-2">{formattedPrice}</p>
      </div>
    </div>
  );
};

export default MotorcycleCard;
