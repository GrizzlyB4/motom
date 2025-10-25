import React, { useState, useEffect } from 'react';
import { Part, PartCategory } from '../types';
import PartCard from './PartCard';
import { HeartIcon, BellIcon } from './Icons';
import { motion } from 'framer-motion';

interface PartListProps {
  parts: Part[];
  onSelectPart: (part: Part) => void;
  selectedCategory: PartCategory;
  onSelectCategory: (category: PartCategory) => void;
  onAddHeatmapPoint: (event: React.MouseEvent) => void;
  onSaveSearch: () => void;
  areFiltersActive: boolean;
  favorites: string[];
  onToggleFavorite: (partId: string) => void;
}

const categories: PartCategory[] = ['All', 'Exhausts', 'Brakes', 'Tires', 'Suspension', 'Electronics'];

const PartList: React.FC<PartListProps> = ({ 
    parts, onSelectPart, selectedCategory, onSelectCategory, 
    onAddHeatmapPoint, onSaveSearch, areFiltersActive, favorites, onToggleFavorite
}) => {
  
  const visibleParts = parts.filter(p => p.status !== 'sold');
  
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
  }, [parts]);

  return (
    <div onClick={onAddHeatmapPoint}>
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onSelectCategory(category); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${ selectedCategory === category ? 'bg-primary text-white' : 'text-foreground-light dark:text-foreground-dark bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark' }`}
            >
              {category === 'All' ? 'Todo' : category}
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

      {visibleParts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
          {visibleParts.map((part, index) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <PartCard 
                  part={part} 
                  onSelect={(e, selectedPart) => {
                    // Track heatmap specifically for part card clicks
                    if (typeof onAddHeatmapPoint === 'function') {
                      onAddHeatmapPoint(e);
                    }
                    onSelectPart(selectedPart)
                  }} 
                  onToggleFavorite={(e) => {
                    e.stopPropagation();
                    // Track heatmap specifically for favorite clicks
                    if (typeof onAddHeatmapPoint === 'function') {
                      onAddHeatmapPoint(e);
                    }
                    onToggleFavorite(part.id)
                  }}
                  isFavorite={favorites.includes(part.id)}
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

export default PartList;