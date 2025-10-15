import React from 'react';
import { Motorcycle } from '../types';
import { HeartIcon, MapPinIcon } from './Icons';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onSelect: (moto: Motorcycle) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const MotorcycleCard: React.FC<MotorcycleCardProps> = ({ motorcycle, onSelect, isFavorite, onToggleFavorite, className, style }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(motorcycle.price);

  return (
    <div 
      className={`cursor-pointer ${className || ''}`}
      onClick={() => onSelect(motorcycle)}
      style={style}
    >
      <div className="relative h-full bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark transition-transform duration-200 hover:scale-[1.02] active:scale-95">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(motorcycle.id);
          }}
          className={`absolute top-3 right-3 z-10 p-1.5 bg-black/40 rounded-full transition-colors ${isFavorite ? 'text-primary' : 'text-white'}`}
          aria-label="Añadir a favoritos"
        >
          <HeartIcon filled={isFavorite} className="w-6 h-6" />
        </button>

        <div 
          className="w-full h-48 bg-center bg-no-repeat bg-cover" 
          style={{ backgroundImage: `url("${motorcycle.imageUrls[0]}")` }}
        ></div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark truncate">{motorcycle.make} {motorcycle.model}</h3>
          <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1">{motorcycle.year} · {motorcycle.engineSize}cc</p>
          <div className="flex items-center text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1">
            <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{motorcycle.location}</span>
          </div>
          <p className="text-xl font-bold text-primary mt-2">{formattedPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default MotorcycleCard;
