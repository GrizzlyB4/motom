import React from 'react';
import { Part } from '../types';
import { MapPinIcon, HeartIcon, StarIcon } from './Icons';
import { motion } from 'framer-motion';

interface PartCardProps {
  part: Part;
  onSelect: (event: React.MouseEvent, part: Part) => void;
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
    <motion.div 
      className={`relative ${isSold || isReserved ? 'cursor-default' : 'cursor-pointer'} ${className || ''}`}
      onClick={(e) => !isSold && !isReserved && onSelect(e, part)}
      style={style}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`h-full bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark transition-transform duration-200 ${!isSold && !isReserved ? 'hover:scale-[1.02] active:scale-95' : ''}`}>
        <div className="relative">
            <div 
              className="w-full h-48 bg-center bg-no-repeat bg-cover" 
              style={{ backgroundImage: `url("${part.imageUrls[0]}")` }}
            ></div>
             {!isSold && (
                <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(part.id); }}
                className={`absolute top-3 right-3 z-10 p-1.5 bg-black/40 rounded-full transition-colors ${isFavorite ? 'text-primary' : 'text-white'}`}
                aria-label="Añadir a favoritos"
                whileHover={{ scale: 1.1 }}
                >
                <HeartIcon filled={isFavorite} className="w-6 h-6" />
                </motion.button>
            )}
            {part.featured && !isSold && (
                <motion.div 
                  className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    <StarIcon className="w-3 h-3"/>
                    <span>DESTACADO</span>
                </motion.div>
            )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark truncate">{part.name}</h3>
          <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1 capitalize">{part.category}</p>
          <div className="flex items-center text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1">
            <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{part.location}</span>
          </div>
          <motion.p 
            className="text-xl font-bold text-primary mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {formattedPrice}
          </motion.p>
        </div>
      </div>
       {(isSold || isReserved) && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center pointer-events-none">
            <motion.div 
              className={`${isSold ? 'bg-green-600' : 'bg-blue-600'} text-white text-base font-bold px-4 py-2 rounded shadow-lg transform -rotate-6`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
                {isSold ? 'VENDIDO' : 'RESERVADO'}
            </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PartCard;