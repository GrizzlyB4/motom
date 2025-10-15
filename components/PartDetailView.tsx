import React, { useState } from 'react';
import { Part, User } from '../types';
import { ArrowLeftIcon, ProfileIcon, ChevronRightIcon, ShareIcon, MapPinIcon } from './Icons';
import StarRating from './StarRating';

interface PartDetailViewProps {
  part: Part;
  seller: User;
  onBack: () => void;
  onViewPublicProfile: (sellerEmail: string) => void;
}

const PartDetailView: React.FC<PartDetailViewProps> = ({ 
  part, seller, onBack, onViewPublicProfile
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(part.price);

  const sellerRating = (seller.totalRatingPoints && seller.numberOfRatings) 
    ? seller.totalRatingPoints / seller.numberOfRatings 
    : 0;
    
  const conditionText = { 'new': 'Nuevo', 'used': 'Usado', 'refurbished': 'Restaurado' };

  const handleShare = async () => {
    const shareData = {
      title: `Mira esta pieza: ${part.name} en MotoMarket`,
      text: `¡Echa un vistazo a esta pieza: ${part.name} por ${formattedPrice}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share was cancelled or failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('¡Enlace copiado al portapapeles!');
      } catch (err) {
        console.error('Failed to copy link: ', err);
        alert('No se pudo copiar el enlace.');
      }
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
       <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
         <div className="px-4 py-3 h-[57px] flex items-center justify-between">
            <button onClick={onBack} className="p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark" />
            </button>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="p-2 -mr-2" aria-label="Compartir">
                  <ShareIcon className="w-6 h-6 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary transition-colors" />
              </button>
            </div>
         </div>
       </header>

      <div>
        <div className="relative w-full h-80 bg-black">
            <div 
                className="w-full h-full bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url("${part.imageUrls[currentImageIndex]}")` }}
            ></div>
        </div>
        
        <div className="p-4 pb-28">
            <div className="animate-fade-in-up mb-6" style={{ animationDelay: '50ms' }}>
                <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">{part.name}</h1>
                <p className="text-lg text-foreground-muted-light dark:text-foreground-muted-dark mt-1 capitalize">{conditionText[part.condition]} · {part.category}</p>
                <div className="flex items-center text-foreground-muted-light dark:text-foreground-muted-dark mt-2">
                    <MapPinIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="font-medium text-foreground-light dark:text-foreground-dark">{part.location}</span>
                </div>
                <p className="text-3xl font-bold text-primary mt-2">{formattedPrice}</p>
            </div>
            
            <div className="space-y-8">
                <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">Compatibilidad</h3>
                     <div className="flex flex-wrap gap-2">
                        {part.compatibility.map((item, index) => (
                            <span key={index} className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-sm font-medium px-3 py-1 rounded-full">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">Descripción</h3>
                    <p className="text-foreground-light dark:text-foreground-dark leading-relaxed whitespace-pre-wrap">{part.description}</p>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-3">Vendedor</h3>
                    <div onClick={() => onViewPublicProfile(part.sellerEmail)} className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 flex items-center gap-3 cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors">
                        {seller.profileImageUrl ? (
                            <img src={seller.profileImageUrl} alt="Foto del vendedor" className="w-12 h-12 object-cover rounded-full flex-shrink-0" />
                        ) : (
                            <ProfileIcon className="w-12 h-12 text-primary flex-shrink-0"/>
                        )}
                        <div className="flex-grow">
                            <p className="text-md font-medium text-foreground-light dark:text-foreground-dark">{seller.name}</p>
                            <p className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">{seller.email}</p>
                            <div className="flex items-center gap-1 mt-1">
                                {seller.numberOfRatings ? (
                                    <>
                                        <StarRating rating={sellerRating} size="sm" readOnly />
                                        <span className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">({seller.numberOfRatings})</span>
                                    </>
                                ) : (
                                    <p className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">Sin valoraciones</p>
                                )}
                            </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-foreground-muted-light dark:text-foreground-muted-dark"/>
                    </div>
                </div>
            </div>
        </div>
      </div>
       <div className="fixed bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-background-light dark:from-background-dark">
            <button 
            className="w-full bg-primary text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg active:scale-95">
            Contactar al Vendedor
            </button>
        </div>
    </div>
  );
};

export default PartDetailView;
