import React from 'react';
import { Motorcycle } from '../types';
import MotorcycleCard from './MotorcycleCard';
import { HeartIcon } from './Icons';

interface FavoritesViewProps {
  motorcycles: Motorcycle[];
  onSelectMotorcycle: (moto: Motorcycle) => void;
  favorites: number[];
  onToggleFavorite: (motoId: number) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ motorcycles, onSelectMotorcycle, favorites, onToggleFavorite }) => {
  return (
    <div>
      {motorcycles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
          {motorcycles.map(moto => (
            <MotorcycleCard 
                key={moto.id} 
                motorcycle={moto} 
                onSelect={onSelectMotorcycle} 
                isFavorite={favorites.includes(moto.id)}
                onToggleFavorite={onToggleFavorite}
            />
          ))}
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
