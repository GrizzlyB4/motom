import React from 'react';
import { Part } from '../types';
import { MapPinIcon, HeartIcon, StarIcon } from './Icons';

interface PartCardProps {
  part: Part;
  onSelect: (part: Part) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const PartCard: React.FC<PartCardProps> = ({ part, onSelect, isFavorite, onToggleFavorite, className, style }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(part.price);
  const isSold = part.status === 'sold';
  const isReserved = part.status === 'reserved';

  return (
    <div 
      className={`relative ${isSold || isReserved ? 'cursor-default' : 'cursor-pointer'} ${className || ''}`}
      onClick={() => !isSold && !isReserved && onSelect(part)}
      style={style}
    >
      <div className={`h-full bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark transition-transform duration-200 ${!isSold && !isReserved ? 'hover:scale-[1.02] active:scale-95' : ''}`}>
        <div className="relative">
            <div 
              className="w-full h-36 sm:h-48 bg-center bg-no-repeat bg-cover" 
              style={{ backgroundImage: `url("${part.imageUrls[0]}")` }}
            ></div>
             {!isSold && (
                <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(part.id); }}
                className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1 sm:p-1.5 bg-black/40 rounded-full transition-colors ${isFavorite ? 'text-primary' : 'text-white'}`}
                aria-label="Añadir a favoritos"
                >
                <HeartIcon filled={isFavorite} className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            )}
            {part.featured && !isSold && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex items-center gap-1 bg-yellow-400 text-black text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    <StarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3"/>
                    <span>DESTACADO</span>
                </div>
            )}
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-bold text-foreground-light dark:text-foreground-dark truncate">{part.name}</h3>
          <p className="text-xs sm:text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1 capitalize">{part.category}</p>
          <div className="flex items-center text-xs sm:text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1">
            <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{part.location}</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-primary mt-2">{formattedPrice}</p>
        </div>
      </div>
       {(isSold || isReserved) && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center pointer-events-none">
            <div className={`${isSold ? 'bg-green-600' : 'bg-blue-600'} text-white text-sm sm:text-base font-bold px-3 py-1 sm:px-4 sm:py-2 rounded shadow-lg transform -rotate-6`}>
                {isSold ? 'VENDIDO' : 'RESERVADO'}
            </div>
        </div>
      )}
    </div>
  );
};

export default PartCard;