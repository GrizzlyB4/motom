import React from 'react';
import { Motorcycle } from '../types';
import { ArrowLeftIcon } from './Icons';

interface MotorcycleDetailViewProps {
  motorcycle: Motorcycle;
  onBack: () => void;
}

const MotorcycleDetailView: React.FC<MotorcycleDetailViewProps> = ({ motorcycle, onBack }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(motorcycle.price);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
       <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
         <div className="px-4 py-3 h-[57px] flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark" />
            </button>
         </div>
       </header>

      <div>
        <div 
            className="w-full h-80 bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url("${motorcycle.imageUrl}")` }}
        ></div>
        
        <div className="p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">{motorcycle.make} {motorcycle.model}</h2>
                    <p className="text-md text-foreground-muted-light dark:text-foreground-muted-dark mt-1">{motorcycle.year} · {motorcycle.engineSize}cc · {motorcycle.mileage.toLocaleString('en-US')} km</p>
                </div>
                <p className="text-2xl font-bold text-primary">{formattedPrice}</p>
            </div>
          
            <div className="mt-6">
                <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-2">Descripción</h3>
                <p className="text-foreground-light dark:text-foreground-dark leading-relaxed whitespace-pre-wrap">{motorcycle.description}</p>
            </div>

            <div className="mt-8 fixed bottom-4 left-4 right-4 z-20">
                <button 
                onClick={() => alert('¡Mensaje enviado al vendedor!')}
                className="w-full bg-primary text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-lg">
                Contactar al Vendedor
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MotorcycleDetailView;
