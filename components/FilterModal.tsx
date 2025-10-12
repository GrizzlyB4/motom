import React from 'react';
import { CloseIcon } from './Icons';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: { min: string; max: string };
  setPriceRange: (range: { min: string; max: string }) => void;
  yearRange: { min: string; max: string };
  setYearRange: (range: { min: string; max: string }) => void;
  engineSizeCategory: string;
  setEngineSizeCategory: (category: string) => void;
  onResetFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen, onClose, priceRange, setPriceRange,
  yearRange, setYearRange, engineSizeCategory,
  setEngineSizeCategory, onResetFilters
}) => {
  if (!isOpen) return null;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange({ ...priceRange, [name]: value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setYearRange({ ...yearRange, [name]: value });
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-card-light dark:bg-card-dark w-full max-w-lg rounded-t-xl p-6 shadow-xl relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filtros Avanzados</h2>
          <button onClick={onClose} className="p-2 -mr-2">
            <CloseIcon className="w-6 h-6"/>
          </button>
        </div>

        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">Rango de Precios ($)</label>
                <div className="flex items-center gap-2">
                    <input type="number" name="min" placeholder="Mín" value={priceRange.min} onChange={handlePriceChange} className="form-input" />
                    <span className="text-foreground-muted-dark">-</span>
                    <input type="number" name="max" placeholder="Máx" value={priceRange.max} onChange={handlePriceChange} className="form-input" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Año</label>
                <div className="flex items-center gap-2">
                    <input type="number" name="min" placeholder="Mín" value={yearRange.min} onChange={handleYearChange} className="form-input" />
                    <span className="text-foreground-muted-dark">-</span>
                    <input type="number" name="max" placeholder="Máx" value={yearRange.max} onChange={handleYearChange} className="form-input" />
                </div>
            </div>
            <div>
                <label htmlFor="engineSize" className="block text-sm font-medium mb-2">Cilindrada (cc)</label>
                <select id="engineSize" value={engineSizeCategory} onChange={(e) => setEngineSizeCategory(e.target.value)} className="form-input">
                    <option value="any">Cualquiera</option>
                    <option value="125">&lt;= 125 cc</option>
                    <option value="125-500">125 - 500 cc</option>
                    <option value="501-1000">501 - 1000 cc</option>
                    <option value="1000+">&gt; 1000 cc</option>
                </select>
            </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
            <button onClick={handleReset} className="w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark font-bold py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-border-dark transition-colors">
                Limpiar Filtros
            </button>
            <button onClick={onClose} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity">
                Aplicar
            </button>
        </div>
      </div>
       <style>{`
            .form-input { appearance: none; width: 100%; background-color: transparent; border: 1px solid #2a3c46; border-radius: 0.75rem; padding: 0.75rem 1rem; color: inherit; transition: all 0.2s; } 
            .form-input:focus { outline: none; border-color: #1193d4; box-shadow: 0 0 0 2px rgba(17, 147, 212, 0.5); }
            @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
            .animate-slide-up { animation: slide-up 0.3s ease-out; }
        `}</style>
    </div>
  );
};

export default FilterModal;
