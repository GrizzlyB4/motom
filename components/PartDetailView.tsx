import React, { useState, useMemo } from 'react';
import { Part, User, Offer } from '../types';
import { ArrowLeftIcon, ProfileIcon, ChevronRightIcon, ShareIcon, MapPinIcon, HeartIcon, StarIcon, PlayIcon } from './Icons';
import StarRating from './StarRating';
import { motion } from 'framer-motion';

interface PartDetailViewProps {
  part: Part;
  seller: User;
  onBack: () => void;
  onViewPublicProfile: (sellerEmail: string) => void;
  onStartChat: (part: Part) => void;
  isFavorite: boolean;
  onToggleFavorite: (partId: string) => void;
  onOpenOfferModal: (item: Part) => void;
  pendingOffer?: Offer;
  currentUser: User;
}

const PartDetailView: React.FC<PartDetailViewProps> = ({ 
  part, seller, onBack, onViewPublicProfile, onStartChat, isFavorite, onToggleFavorite,
  onOpenOfferModal, pendingOffer, currentUser
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(part.price);

  const media = useMemo(() => {
    const items: { type: 'video' | 'image'; url: string }[] = [];
    if (part.videoUrl) {
      items.push({ type: 'video', url: part.videoUrl });
    }
    part.imageUrls.forEach(url => {
      items.push({ type: 'image', url });
    });
    return items;
  }, [part]);

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
  
  const isSeller = currentUser.email === part.sellerEmail;
  const canMakeOffer = !isSeller && part.status === 'for-sale';
  const canContact = !isSeller && part.status !== 'sold' && (part.status !== 'reserved' || part.reservedBy === currentUser.email);
  const hasMultipleMedia = media.length > 1;

  return (
    <motion.div 
      className="bg-background-light dark:bg-background-dark min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
       <motion.header 
         className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark"
         initial={{ y: -50, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ duration: 0.3, delay: 0.1 }}
       >
         <div className="px-4 py-3 h-[57px] flex items-center justify-between">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onBack} 
              className="p-2 -ml-2"
            >
                <ArrowLeftIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark" />
            </motion.button>
            <div className="flex items-center gap-2">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleShare} 
                className="p-2" 
                aria-label="Compartir"
              >
                  <ShareIcon className="w-6 h-6 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary transition-colors" />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleFavorite(part.id)} 
                className="p-2 -mr-2" 
                aria-label="Añadir a favoritos"
                whileHover={{ scale: 1.1 }}
              >
                  <HeartIcon 
                      filled={isFavorite} 
                      className={`w-7 h-7 transition-all duration-200 ${isFavorite ? 'text-primary scale-110' : 'text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary'}`} 
                  />
              </motion.button>
            </div>
         </div>
       </motion.header>

      <div>
        <motion.div 
          className="relative w-full h-80 bg-black group"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 320, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
             {media[currentMediaIndex].type === 'image' ? (
                <div 
                    className="w-full h-full bg-center bg-no-repeat bg-contain"
                    style={{ backgroundImage: `url("${media[currentMediaIndex].url}")` }}
                ></div>
            ) : (
                <video src={media[currentMediaIndex].url} className="w-full h-full object-contain" controls autoPlay playsInline />
            )}

            {part.status === 'reserved' && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                    <div className="bg-blue-600 text-white text-base font-bold px-4 py-2 rounded shadow-lg transform -rotate-6">RESERVADO</div>
                </div>
            )}
        </motion.div>

        {hasMultipleMedia && (
             <motion.div 
              className="p-2 bg-background-light dark:bg-background-dark"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {media.map((item, index) => (
                        <motion.button 
                          key={index} 
                          onClick={() => setCurrentMediaIndex(index)} 
                          className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${index === currentMediaIndex ? 'border-primary' : 'border-transparent'}`}
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ y: -5 }}
                        >
                             <img src={item.type === 'image' ? item.url : part.imageUrls[0]} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            {item.type === 'video' && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <PlayIcon className="w-8 h-8 text-white" />
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        )}
        
        <div className="p-4 pb-28">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
                 <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">{part.name}</h1>
                    {part.featured && (
                        <motion.div 
                          className="flex-shrink-0 flex items-center gap-1.5 bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
                        >
                            <StarIcon className="w-4 h-4"/>
                            <span>DESTACADO</span>
                        </motion.div>
                    )}
                </div>
                <p className="text-lg text-foreground-muted-light dark:text-foreground-muted-dark mt-1 capitalize">{conditionText[part.condition]} · {part.category}</p>
                <div className="flex items-center text-foreground-muted-light dark:text-foreground-muted-dark mt-2">
                    <MapPinIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="font-medium text-foreground-light dark:text-foreground-dark">{part.location}</span>
                </div>
                <motion.p 
                  className="text-3xl font-bold text-primary mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {formattedPrice}
                </motion.p>
            </motion.div>
            
            <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">Compatibilidad</h3>
                     <div className="flex flex-wrap gap-2">
                        {part.compatibility.map((item, index) => (
                            <motion.span 
                              key={index} 
                              className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-sm font-medium px-3 py-1 rounded-full"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2, delay: 0.6 + index * 0.05 }}
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">Descripción</h3>
                    <p className="text-foreground-light dark:text-foreground-dark leading-relaxed whitespace-pre-wrap">{part.description}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-3">Vendedor</h3>
                    <motion.div 
                      onClick={() => onViewPublicProfile(part.sellerEmail)} 
                      className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 flex items-center gap-3 cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
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
                    </motion.div>
                </motion.div>
            </div>
        </div>
      </div>
       <motion.div 
         className="fixed bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-background-light dark:from-background-dark"
         initial={{ y: 100, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ duration: 0.3, delay: 0.5 }}
       >
            <div className="flex items-center gap-3">
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStartChat(part)}
                    disabled={!canContact}
                    className="flex-1 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark font-bold py-4 px-8 rounded-xl hover:bg-black/[.05] dark:hover:bg-border-dark transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ y: -3 }}
                >
                    Contactar
                </motion.button>
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOpenOfferModal(part)}
                    disabled={!canMakeOffer || !!pendingOffer}
                    className="flex-1 bg-primary text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ y: -3 }}
                >
                    {pendingOffer ? 'Oferta Pendiente' : 'Hacer Oferta'}
                </motion.button>
            </div>
        </motion.div>
    </motion.div>
  );
};

export default PartDetailView;
