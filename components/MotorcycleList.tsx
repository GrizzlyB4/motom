import React from 'react';
import { Motorcycle, MotorcycleCategory } from '../types';
import MotorcycleCard from './MotorcycleCard';

interface MotorcycleListProps {
  motorcycles: Motorcycle[];
  onSelectMotorcycle: (moto: Motorcycle) => void;
  selectedCategory: MotorcycleCategory;
  onSelectCategory: (category: MotorcycleCategory) => void;
  favorites: number[];
  onToggleFavorite: (motoId: number) => void;
}

const categories: MotorcycleCategory[] = ['All', 'Sport', 'Cruiser', 'Off-Road', 'Touring'];

const MotorcycleList: React.FC<MotorcycleListProps> = ({ motorcycles, onSelectMotorcycle, selectedCategory, onSelectCategory, favorites, onToggleFavorite }) => {
  return (
    <div>
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'text-foreground-light dark:text-foreground-dark bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

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
         <div className="text-center py-16 px-4">
            <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">No se encontraron resultados</h3>
            <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Intenta ajustar tus términos de búsqueda o filtros.</p>
        </div>
      )}
    </div>
  );
};

export default MotorcycleList;