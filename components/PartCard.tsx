import React from 'react';
import { Part } from '../types';
import { MapPinIcon } from './Icons';

interface PartCardProps {
  part: Part;
  onSelect: (part: Part) => void;
  className?: string;
  style?: React.CSSProperties;
}

const PartCard: React.FC<PartCardProps> = ({ part, onSelect, className, style }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(part.price);
  const isSold = part.status === 'sold';

  const conditionText = {
    'new': 'Nuevo',
    'used': 'Usado',
    'refurbished': 'Restaurado'
  };

  const conditionColor = {
      'new': 'bg-green-500',
      'used': 'bg-yellow-500',
      'refurbished': 'bg-blue-500'
  };

  return (
    <div 
      className={`relative ${isSold ? 'cursor-default' : 'cursor-pointer'} ${className || ''}`}
      onClick={() => !isSold && onSelect(part)}
      style={style}
    >
      <div className={`h-full bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark transition-transform duration-200 ${!isSold ? 'hover:scale-[1.02] active:scale-95' : ''}`}>
        <div className="relative">
            <div 
              className="w-full h-48 bg-center bg-no-repeat bg-cover" 
              style={{ backgroundImage: `url("${part.imageUrls[0]}")` }}
            ></div>
             <div className={`absolute top-3 left-3 z-10 text-white text-xs font-bold px-2 py-1 rounded-full ${conditionColor[part.condition]}`}>
                {conditionText[part.condition]}
            </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark truncate">{part.name}</h3>
          <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1 capitalize">{part.category}</p>
          <div className="flex items-center text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1">
            <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{part.location}</span>
          </div>
          <p className="text-xl font-bold text-primary mt-2">{formattedPrice}</p>
        </div>
      </div>
      {isSold && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center pointer-events-none">
            <div className="bg-green-600 text-white text-base font-bold px-4 py-2 rounded shadow-lg transform -rotate-6">VENDIDO</div>
        </div>
      )}
    </div>
  );
};

export default PartCard;