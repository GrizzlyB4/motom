import React from 'react';
import { Part, PartCategory } from '../types';
import PartCard from './PartCard';
import { HeartIcon, BellIcon } from './Icons';

interface PartListProps {
  parts: Part[];
  onSelectPart: (part: Part) => void;
  selectedCategory: PartCategory;
  onSelectCategory: (category: PartCategory) => void;
  onAddHeatmapPoint: (event: React.MouseEvent) => void;
  onSaveSearch: () => void;
  areFiltersActive: boolean;
  favorites: number[];
  onToggleFavorite: (partId: number) => void;
}

const categories: PartCategory[] = ['All', 'Exhausts', 'Brakes', 'Tires', 'Suspension', 'Electronics'];

const PartList: React.FC<PartListProps> = ({ 
    parts, onSelectPart, selectedCategory, onSelectCategory, 
    onAddHeatmapPoint, onSaveSearch, areFiltersActive, favorites, onToggleFavorite
}) => {
  
  const visibleParts = parts.filter(p => p.status !== 'sold');

  return (
    <div onClick={onAddHeatmapPoint}>
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={(e) => { e.stopPropagation(); onSelectCategory(category); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${ selectedCategory === category ? 'bg-primary text-white' : 'text-foreground-light dark:text-foreground-dark bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark' }`}
            >
              {category === 'All' ? 'Todo' : category}
            </button>
          ))}
        </div>
      </div>
      
      {areFiltersActive && (
        <div className="px-4 pb-2 animate-fade-in-up" style={{animationDelay: '100ms'}}>
            <button onClick={(e) => { e.stopPropagation(); onSaveSearch(); }} className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary font-bold py-3 px-4 rounded-xl hover:bg-primary/20 transition-colors duration-300 active:scale-95">
                <BellIcon className="w-5 h-5" />
                Crear alerta para esta búsqueda
            </button>
        </div>
      )}

      {visibleParts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
          {visibleParts.map((part, index) => (
            <PartCard 
                key={part.id} 
                part={part} 
                onSelect={onSelectPart} 
                isFavorite={favorites.includes(part.id)}
                onToggleFavorite={onToggleFavorite}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
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

export default PartList;