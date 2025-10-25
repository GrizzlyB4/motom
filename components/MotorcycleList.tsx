import React, { useState, useEffect } from 'react';
import { Motorcycle, MotorcycleCategory } from '../types';
import MotorcycleCard from './MotorcycleCard';
import { HeartIcon, BellIcon } from './Icons';
import { motion } from 'framer-motion';

interface MotorcycleListProps {
  motorcycles: Motorcycle[];
  featuredMotorcycles: Motorcycle[];
  onSelectMotorcycle: (moto: Motorcycle) => void;
  selectedCategory: MotorcycleCategory;
  onSelectCategory: (category: MotorcycleCategory) => void;
  favorites: string[];
  onToggleFavorite: (motoId: string) => void;
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
  const visibleMotorcycles = motorcycles.filter(m => m.status !== 'sold');
  
  // State to track when data is stable to prevent animation flashing
  const [isDataStable, setIsDataStable] = useState(false);
  
  useEffect(() => {
    // When data changes, mark as unstable temporarily
    setIsDataStable(false);
    
    
    // After a short delay, mark as stable to allow animations
    const timer = setTimeout(() => {
      setIsDataStable(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [motorcycles, featuredMotorcycles]);

  return (
    <div onClick={onAddHeatmapPoint}>
      {showFeatured && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-4"
        >
          <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark px-4 mb-3">Destacadas</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
            {featuredMotorcycles.map((moto, index) => (
              <motion.div
                key={moto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectMotorcycle(moto)
                }}
                className="flex-shrink-0 w-64 cursor-pointer group"
              >
                <div className="h-full bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-md border border-border-light dark:border-border-dark transition-transform duration-200 hover:scale-[1.03] active:scale-95">
                  <div className="relative">
                    <div
                      className="w-full h-36 bg-cover bg-center"
                      style={{ backgroundImage: `url(${moto.imageUrls[0]})` }}
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(moto.id);
                      }}
                      className={`absolute top-2 right-2 p-1.5 bg-black/40 rounded-full transition-colors ${favorites.includes(moto.id) ? 'text-primary' : 'text-white'}`}
                      aria-label="Añadir a favoritos"
                    >
                      <HeartIcon filled={favorites.includes(moto.id)} className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="p-3">
                    <p className="font-bold truncate text-foreground-light dark:text-foreground-dark group-hover:text-primary transition-colors">{moto.make} {moto.model}</p>
                    <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">{moto.year}</p>
                    <p className="text-lg font-bold text-primary mt-1">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(moto.price)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent click from bubbling to the main container
                onSelectCategory(category);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'text-foreground-light dark:text-foreground-dark bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>
      
      {areFiltersActive && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="px-4 pb-2"
        >
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                // Track heatmap specifically for save search clicks
                if (typeof onAddHeatmapPoint === 'function') {
                  onAddHeatmapPoint(e);
                }
                onSaveSearch(); 
              }} 
              className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary font-bold py-3 px-4 rounded-xl hover:bg-primary/20 transition-colors duration-300 active:scale-95"
            >
                <BellIcon className="w-5 h-5" />
                Crear alerta para esta búsqueda
            </button>
        </motion.div>
      )}

      {visibleMotorcycles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
          {visibleMotorcycles.map((moto, index) => (
            <motion.div
              key={moto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <MotorcycleCard 
                  motorcycle={moto} 
                  onSelect={(e, selectedMoto) => {
                    // Track heatmap specifically for motorcycle card clicks
                    if (typeof onAddHeatmapPoint === 'function') {
                      onAddHeatmapPoint(e);
                    }
                    onSelectMotorcycle(selectedMoto)
                  }} 
                  onToggleFavorite={(e) => {
                    e.stopPropagation();
                    // Track heatmap specifically for favorite clicks
                    if (typeof onAddHeatmapPoint === 'function') {
                      onAddHeatmapPoint(e);
                    }
                    onToggleFavorite(moto.id)
                  }}
                  isFavorite={favorites.includes(moto.id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-16 px-4"
        >
            <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">No se encontraron resultados</h3>
            <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Intenta ajustar tus términos de búsqueda o filtros.</p>
        </motion.div>
      )}
    </div>
  );
};

export default MotorcycleList;