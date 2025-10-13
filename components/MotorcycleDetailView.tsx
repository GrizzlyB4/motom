import React from 'react';
import { Motorcycle } from '../types';
import { ArrowLeftIcon, RoadIcon, EngineIcon, TagIcon, ProfileIcon } from './Icons';

interface MotorcycleDetailViewProps {
  motorcycle: Motorcycle;
  onBack: () => void;
}

const SpecItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark text-center shadow-sm">
    <div className="text-primary mb-2">{icon}</div>
    <p className="text-sm font-medium text-foreground-muted-light dark:text-foreground-muted-dark">{label}</p>
    <p className="text-lg font-bold text-foreground-light dark:text-foreground-dark">{value}</p>
  </div>
);


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
        
        <div className="p-4 pb-28">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">{motorcycle.make} {motorcycle.model}</h1>
                <p className="text-lg text-foreground-muted-light dark:text-foreground-muted-dark mt-1">{motorcycle.year}</p>
                <p className="text-3xl font-bold text-primary mt-2">{formattedPrice}</p>
            </div>
            
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-3">Especificaciones Clave</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <SpecItem 
                            icon={<RoadIcon className="w-8 h-8"/>} 
                            label="Kilometraje" 
                            value={`${motorcycle.mileage.toLocaleString('en-US')} km`} 
                        />
                        <SpecItem 
                            icon={<EngineIcon className="w-8 h-8"/>} 
                            label="Cilindrada" 
                            value={`${motorcycle.engineSize} cc`} 
                        />
                        <SpecItem 
                            icon={<TagIcon className="w-8 h-8"/>} 
                            label="Categoría" 
                            value={motorcycle.category} 
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">Descripción</h3>
                    <p className="text-foreground-light dark:text-foreground-dark leading-relaxed whitespace-pre-wrap">{motorcycle.description}</p>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-3">Vendedor</h3>
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 flex items-center gap-3">
                        <ProfileIcon className="w-8 h-8 text-primary"/>
                        <p className="text-md font-medium text-foreground-light dark:text-foreground-dark">{motorcycle.sellerEmail}</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
       <div className="fixed bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-background-light dark:from-background-dark">
            <button 
            onClick={() => alert('¡Mensaje enviado al vendedor!')}
            className="w-full bg-primary text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-lg">
            Contactar al Vendedor
            </button>
        </div>
    </div>
  );
};

export default MotorcycleDetailView;