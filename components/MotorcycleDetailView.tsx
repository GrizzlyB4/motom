import React, { useState, useMemo } from 'react';
import { Motorcycle, User, Offer } from '../types';
import { ArrowLeftIcon, RoadIcon, EngineIcon, TagIcon, ProfileIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon, ShareIcon, MapPinIcon, StarIcon, PlayIcon } from './Icons';
import StarRating from './StarRating';

interface MotorcycleDetailViewProps {
  motorcycle: Motorcycle;
  seller: User;
  allMotorcycles: Motorcycle[];
  onBack: () => void;
  onStartChat: (motorcycle: Motorcycle) => void;
  isFavorite: boolean;
  onToggleFavorite: (motoId: string) => void;
  onViewPublicProfile: (sellerEmail: string) => void;
  onSelectMotorcycle: (moto: Motorcycle) => void;
  onOpenOfferModal: (item: Motorcycle) => void;
  pendingOffer?: Offer;
  currentUser: User;
}

const SpecItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark text-center shadow-sm">
    <div className="text-primary mb-2">{icon}</div>
    <p className="text-sm font-medium text-foreground-muted-light dark:text-foreground-muted-dark">{label}</p>
    <p className="text-lg font-bold text-foreground-light dark:text-foreground-dark">{value}</p>
  </div>
);


const MotorcycleDetailView: React.FC<MotorcycleDetailViewProps> = ({ 
  motorcycle, seller, onBack, onStartChat, isFavorite, onToggleFavorite, 
  onViewPublicProfile, allMotorcycles, onSelectMotorcycle,
  onOpenOfferModal, pendingOffer, currentUser
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(motorcycle.price);

  const media = useMemo(() => {
    const items: { type: 'video' | 'image'; url: string }[] = [];
    if (motorcycle.videoUrl) {
      items.push({ type: 'video', url: motorcycle.videoUrl });
    }
    motorcycle.imageUrls.forEach(url => {
      items.push({ type: 'image', url });
    });
    return items;
  }, [motorcycle]);

  const sellerRating = (seller.totalRatingPoints && seller.numberOfRatings) 
    ? seller.totalRatingPoints / seller.numberOfRatings 
    : 0;

  const similarMotorcycles = useMemo(() => {
    if (!allMotorcycles) return [];
    const priceBuffer = motorcycle.price * 0.20; // 20% buffer
    const minPrice = motorcycle.price - priceBuffer;
    const maxPrice = motorcycle.price + priceBuffer;

    return allMotorcycles.filter(m =>
        m.id !== motorcycle.id &&
        m.status === 'for-sale' &&
        m.category === motorcycle.category &&
        m.price >= minPrice && m.price <= maxPrice
    ).slice(0, 4);
  }, [allMotorcycles, motorcycle]);

  const nextMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
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

  const hasMultipleMedia = media.length > 1;
  const isSeller = currentUser.email === motorcycle.sellerEmail;
  const canMakeOffer = !isSeller && motorcycle.status === 'for-sale';
  const canContact = !isSeller && motorcycle.status !== 'sold' && (motorcycle.status !== 'reserved' || motorcycle.reservedBy === currentUser.email);


  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen animate-view-transition">
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
                      className={`w-7 h-7 transition-all duration-200 ${isFavorite ? 'text-primary scale-110' : 'text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary'}`} 
                  />
              </button>
            </div>
         </div>
       </header>

      <div>
        <div className="relative w-full h-80 bg-black group">
            {media[currentMediaIndex].type === 'image' ? (
                 <div 
                    className="w-full h-full bg-center bg-no-repeat bg-contain"
                    style={{ backgroundImage: `url("${media[currentMediaIndex].url}")` }}
                ></div>
            ) : (
                <video src={media[currentMediaIndex].url} className="w-full h-full object-contain" controls autoPlay playsInline />
            )}
            
            {motorcycle.status === 'reserved' && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                    <div className="bg-blue-600 text-white text-base font-bold px-4 py-2 rounded shadow-lg transform -rotate-6">RESERVADO</div>
                </div>
            )}

            {hasMultipleMedia && (
                <>
                    <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100" aria-label="Anterior">
                        <ChevronLeftIcon className="w-6 h-6"/>
                    </button>
                    <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100" aria-label="Siguiente">
                        <ChevronRightIcon className="w-6 h-6"/>
                    </button>
                </>
            )}
        </div>

        {hasMultipleMedia && (
            <div className="p-2 bg-background-light dark:bg-background-dark">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {media.map((item, index) => (
                        <button key={index} onClick={() => setCurrentMediaIndex(index)} className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${index === currentMediaIndex ? 'border-primary' : 'border-transparent'}`}>
                             <img src={item.type === 'image' ? item.url : motorcycle.imageUrls[0]} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            {item.type === 'video' && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <PlayIcon className="w-8 h-8 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        )}
        
        <div className="p-4 pb-28">
            <div className="animate-fade-in-up mb-6" style={{ animationDelay: '50ms' }}>
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">{motorcycle.make} {motorcycle.model}</h1>
                    {motorcycle.featured && (
                        <div className="flex-shrink-0 flex items-center gap-1.5 bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full">
                            <StarIcon className="w-4 h-4"/>
                            <span>DESTACADO</span>
                        </div>
                    )}
                </div>
                <p className="text-lg text-foreground-muted-light dark:text-foreground-muted-dark mt-1">{motorcycle.year}</p>
                <div className="flex items-center text-foreground-muted-light dark:text-foreground-muted-dark mt-2">
                    <MapPinIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="font-medium text-foreground-light dark:text-foreground-dark">{motorcycle.location}</span>
                </div>
                <p className="text-3xl font-bold text-primary mt-2">{formattedPrice}</p>
            </div>
            
            <div className="space-y-8">
                <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
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

                <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">Descripción</h3>
                    <p className="text-foreground-light dark:text-foreground-dark leading-relaxed whitespace-pre-wrap">{motorcycle.description}</p>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-3">Vendedor</h3>
                    <div onClick={() => onViewPublicProfile(motorcycle.sellerEmail)} className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 flex items-center gap-3 cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors">
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

                {similarMotorcycles.length > 0 && (
                    <div className="animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                        <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-3">Motos Similares</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
                            {similarMotorcycles.map(moto => (
                                <div
                                    key={moto.id}
                                    onClick={() => onSelectMotorcycle(moto)}
                                    className="flex-shrink-0 w-40 bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark cursor-pointer transition-transform duration-200 hover:scale-[1.03]"
                                >
                                    <div
                                        className="w-full h-24 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${moto.imageUrls[0]})` }}
                                    />
                                    <div className="p-2">
                                        <p className="text-sm font-bold truncate">{moto.make} {moto.model}</p>
                                        <p className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">{moto.year}</p>
                                        <p className="text-md font-bold text-primary mt-1">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(moto.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
      </div>
       <div className="fixed bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-background-light dark:from-background-dark">
            <div className="flex items-center gap-3">
                <button 
                onClick={() => onStartChat(motorcycle)}
                disabled={!canContact}
                className="flex-1 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark font-bold py-4 px-8 rounded-xl hover:bg-black/[.05] dark:hover:bg-border-dark transition-all duration-3300 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    Contactar
                </button>
                <button 
                onClick={() => onOpenOfferModal(motorcycle)}
                disabled={!canMakeOffer || !!pendingOffer}
                className="flex-1 bg-primary text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    {pendingOffer ? 'Oferta Pendiente' : 'Hacer Oferta'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default MotorcycleDetailView;
