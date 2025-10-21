import React from 'react';
import { Motorcycle, Part } from '../types';
import MotorcycleCard from './MotorcycleCard';
import PartCard from './PartCard';
import { HeartIcon } from './Icons';

interface FavoritesViewProps {
  motorcycles: Motorcycle[];
  parts: Part[];
  onSelectMotorcycle: (moto: Motorcycle) => void;
  onSelectPart: (part: Part) => void;
  onToggleFavorite: (motoId: string) => void;
  onTogglePartFavorite: (partId: string) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ 
  motorcycles, parts, onSelectMotorcycle, onSelectPart, onToggleFavorite, onTogglePartFavorite 
}) => {
  const hasFavorites = motorcycles.length > 0 || parts.length > 0;
  
  return (
    <div className="animate-view-transition">
      {hasFavorites ? (
        <div className="p-4 space-y-8">
          {motorcycles.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-4">Motos Favoritas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {motorcycles.map(moto => (
                  <MotorcycleCard 
                      key={moto.id} 
                      motorcycle={moto} 
                      onSelect={onSelectMotorcycle} 
                      isFavorite={true}
                      onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
          {parts.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-4">Piezas Favoritas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {parts.map(part => (
                  <PartCard 
                      key={part.id} 
                      part={part} 
                      onSelect={onSelectPart} 
                      isFavorite={true}
                      onToggleFavorite={onTogglePartFavorite}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
         <div className="text-center py-20 px-4">
            <HeartIcon className="w-16 h-16 mx-auto text-foreground-muted-light dark:text-foreground-muted-dark mb-4"/>
            <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Aún no tienes favoritos</h3>
            <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Toca el corazón en cualquier anuncio para guardarlo aquí.</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesView;