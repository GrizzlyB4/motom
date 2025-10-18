import React from 'react';
import { Motorcycle } from '../types';
import { HeartIcon, MapPinIcon, StarIcon } from './Icons';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onSelect: (moto: Motorcycle) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const MotorcycleCard: React.FC<MotorcycleCardProps> = ({ motorcycle, onSelect, isFavorite, onToggleFavorite, className, style }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(motorcycle.price);
  const isSold = motorcycle.status === 'sold';
  const isReserved = motorcycle.status === 'reserved';

  return (
    <div 
      className={`relative ${isSold || isReserved ? 'cursor-default' : 'cursor-pointer'} ${className || ''}`}
      onClick={() => !isSold && !isReserved && onSelect(motorcycle)}
      style={style}
    >
      <div className={`h-full bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark transition-transform duration-200 ${!isSold && !isReserved ? 'hover:scale-[1.02] active:scale-95' : ''}`}>
        {motorcycle.featured && !isSold && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                <StarIcon className="w-3 h-3"/>
                <span>DESTACADO</span>
            </div>
        )}
        {!isSold && (
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
        )}

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
      {(isSold || isReserved) && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center pointer-events-none">
            <div className={`${isSold ? 'bg-green-600' : 'bg-blue-600'} text-white text-base font-bold px-4 py-2 rounded shadow-lg transform -rotate-6`}>
                {isSold ? 'VENDIDO' : 'RESERVADO'}
            </div>
        </div>
      )}
    </div>
  );
};

export default MotorcycleCard;