import React, { useState } from 'react';
import { Motorcycle, Part } from '../types';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Motorcycle | Part;
  onMakeOffer: (amount: number) => void;
}

const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onClose, item, onMakeOffer }) => {
  const [offerAmount, setOfferAmount] = useState('');
  const [error, setError] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = () => {
    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Por favor, introduce un importe válido.');
      return;
    }
    setError('');
    onMakeOffer(amount);
  };
  
  const itemName = 'make' in item ? `${item.make} ${item.model}` : item.name;
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-card-light dark:bg-card-dark w-full max-w-sm rounded-xl p-6 shadow-xl m-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-4">Hacer una Oferta</h2>
        <div className="flex items-center gap-4 p-3 bg-background-light dark:bg-background-dark rounded-lg mb-4">
            <img src={item.imageUrls[0]} alt={itemName} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
            <div>
                <p className="font-semibold text-foreground-light dark:text-foreground-dark">{itemName}</p>
                <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">Precio: {formattedPrice}</p>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">Tu oferta ($)</label>
            <input 
                type="number" 
                placeholder={`ej: ${Math.round(item.price * 0.9)}`}
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="form-input w-full text-lg" 
            />
            {error && <p className="text-sm text-primary mt-2">{error}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
            <button onClick={onClose} className="w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark font-bold py-3 px-4 rounded-xl hover:bg-black/[.05] dark:hover:bg-border-dark transition-colors">Cancelar</button>
            <button onClick={handleSubmit} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity">Enviar Oferta</button>
        </div>
      </div>
      <style>{`@keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-fade-in { animation: fade-in 0.2s ease-out; } .form-input { appearance: none; width: 100%; background-color: transparent; border: 1px solid #2a3c46; border-radius: 0.75rem; padding: 0.75rem 1rem; color: inherit; transition: all 0.2s; } .form-input:focus { outline: none; border-color: #1193d4; box-shadow: 0 0 0 2px rgba(17, 147, 212, 0.5); }`}</style>
    </div>
  );
};

export default OfferModal;
