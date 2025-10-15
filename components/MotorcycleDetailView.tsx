import React, { useState } from 'react';
import { Motorcycle } from '../types';
import { ArrowLeftIcon, RoadIcon, EngineIcon, TagIcon, ProfileIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon, ShareIcon } from './Icons';

interface MotorcycleDetailViewProps {
  motorcycle: Motorcycle;
  onBack: () => void;
  onStartChat: (motorcycle: Motorcycle) => void;
  isFavorite: boolean;
  onToggleFavorite: (motoId: number) => void;
  onViewPublicProfile: (sellerEmail: string) => void;
}

const SpecItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark text-center shadow-sm">
    <div className="text-primary mb-2">{icon}</div>
    <p className="text-sm font-medium text-foreground-muted-light dark:text-foreground-muted-dark">{label}</p>
    <p className="text-lg font-bold text-foreground-light dark:text-foreground-dark">{value}</p>
  </div>
);


const MotorcycleDetailView: React.FC<MotorcycleDetailViewProps> = ({ motorcycle, onBack, onStartChat, isFavorite, onToggleFavorite, onViewPublicProfile }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(motorcycle.price);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % motorcycle.imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + motorcycle.imageUrls.length) % motorcycle.imageUrls.length);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Mira esta ${motorcycle.make} ${motorcycle.model} en MotoMarket`,
      text: `¡Echa un vistazo a esta ${motorcycle.make} ${motorcycle.model} por ${formattedPrice}!`,
      url: window.location.href, // In a real app, this would be a persistent URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share, no need to show error
        console.log('Share was cancelled or failed', err);
      }
    } else {
      // Fallback for browsers without Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('¡Enlace copiado al portapapeles!');
      } catch (err) {
        console.error('Failed to copy link: ', err);
        alert('No se pudo copiar el enlace.');
      }
    }
  };

  const hasMultipleImages = motorcycle.imageUrls.length > 1;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
       <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
         <div className="px-4 py-3 h-[57px] flex items-center justify-between">
            <button onClick={onBack} className="p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark" />
            </button>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="p-2" aria-label="Compartir">
                  <ShareIcon className="w-6 h-6 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary transition-colors" />
              </button>
              <button onClick={() => onToggleFavorite(motorcycle.id)} className="p-2 -mr-2" aria-label="Añadir a favoritos">
                  <HeartIcon 
                      filled={isFavorite} 
                      className={`w-7 h-7 transition-colors ${isFavorite ? 'text-primary' : 'text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary'}`} 
                  />
              </button>
            </div>
         </div>
       </header>

      <div>
        <div className="relative w-full h-80 bg-black">
            <div 
                className="w-full h-full bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url("${motorcycle.imageUrls[currentImageIndex]}")` }}
            ></div>

            {hasMultipleImages && (
                <>
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors" aria-label="Imagen anterior">
                        <ChevronLeftIcon className="w-6 h-6"/>
                    </button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors" aria-label="Siguiente imagen">
                        <ChevronRightIcon className="w-6 h-6"/>
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                        {motorcycle.imageUrls.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
        
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
                    <div onClick={() => onViewPublicProfile(motorcycle.sellerEmail)} className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 flex items-center gap-3 cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors">
                        <ProfileIcon className="w-8 h-8 text-primary"/>
                        <div className="flex-grow">
                            <p className="text-md font-medium text-foreground-light dark:text-foreground-dark">{motorcycle.sellerEmail}</p>
                            <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">Ver perfil y anuncios</p>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-foreground-muted-light dark:text-foreground-muted-dark"/>
                    </div>
                </div>
            </div>

        </div>
      </div>
       <div className="fixed bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-background-light dark:from-background-dark">
            <button 
            onClick={() => onStartChat(motorcycle)}
            className="w-full bg-primary text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-lg">
            Contactar al Vendedor
            </button>
        </div>
    </div>
  );
};

export default MotorcycleDetailView;