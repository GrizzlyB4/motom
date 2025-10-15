import React from 'react';
import { Motorcycle, MotorcycleCategory } from '../types';
import MotorcycleCard from './MotorcycleCard';
import { HeartIcon, BellIcon } from './Icons';

interface MotorcycleListProps {
  motorcycles: Motorcycle[];
  featuredMotorcycles: Motorcycle[];
  onSelectMotorcycle: (moto: Motorcycle) => void;
  selectedCategory: MotorcycleCategory;
  onSelectCategory: (category: MotorcycleCategory) => void;
  favorites: number[];
  onToggleFavorite: (motoId: number) => void;
  onAddHeatmapPoint: (event: React.MouseEvent) => void;
  searchTerm: string;
  onSaveSearch: () => void;
  areFiltersActive: boolean;
}

const categories: MotorcycleCategory[] = ['All', 'Sport', 'Cruiser', 'Off-Road', 'Touring'];

const MotorcycleList: React.FC<MotorcycleListProps> = ({ 
    motorcycles, onSelectMotorcycle, selectedCategory, onSelectCategory, 
    favorites, onToggleFavorite, onAddHeatmapPoint, featuredMotorcycles, searchTerm,
    onSaveSearch, areFiltersActive
}) => {
  
  const showFeatured = featuredMotorcycles.length > 0 && selectedCategory === 'All' && searchTerm === '';

  return (
    <div onClick={onAddHeatmapPoint}>
      {showFeatured && (
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark px-4 mb-3">Destacadas</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
            {featuredMotorcycles.map(moto => (
              <div
                key={moto.id}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectMotorcycle(moto)
                }}
                className="flex-shrink-0 w-64 bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-md border border-border-light dark:border-border-dark cursor-pointer transition-transform duration-200 hover:scale-[1.03] group"
              >
                <div className="relative">
                  <div
                    className="w-full h-36 bg-cover bg-center"
                    style={{ backgroundImage: `url(${moto.imageUrls[0]})` }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(moto.id);
                    }}
                    className={`absolute top-2 right-2 p-1.5 bg-black/40 rounded-full transition-colors ${favorites.includes(moto.id) ? 'text-primary' : 'text-white'}`}
                    aria-label="Añadir a favoritos"
                  >
                    <HeartIcon filled={favorites.includes(moto.id)} className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="font-bold truncate text-foreground-light dark:text-foreground-dark group-hover:text-primary transition-colors">{moto.make} {moto.model}</p>
                  <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">{moto.year}</p>
                  <p className="text-lg font-bold text-primary mt-1">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(moto.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={(e) => {
                e.stopPropagation(); // Prevent click from bubbling to the main container
                onSelectCategory(category);
              }}
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
      
      {areFiltersActive && (
        <div className="px-4 pb-2">
            <button
                onClick={(e) => { e.stopPropagation(); onSaveSearch(); }}
                className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary font-bold py-3 px-4 rounded-xl hover:bg-primary/20 transition-colors duration-300"
            >
                <BellIcon className="w-5 h-5" />
                Crear alerta para esta búsqueda
            </button>
        </div>
      )}

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