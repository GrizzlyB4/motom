import React from 'react';
import { User, Motorcycle, SavedSearch, Part } from '../types';
import { ProfileIcon, LogoutIcon, EditIcon, TrashIcon, StarIcon, HeartIcon, EyeIcon, ChatIcon } from './Icons';
import StarRating from './StarRating';
import { motion } from 'framer-motion';

interface ProfileViewProps {
  currentUser: User;
  userMotorcycles: Motorcycle[];
  userParts: Part[];
  onGoToSell: () => void;
  onSelectMotorcycle: (moto: Motorcycle) => void;
  onSelectPart: (part: Part) => void;
  onLogout: () => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
  onUpdateProfileImage: (imageUrl: string) => void;
  onEditItem: (item: Motorcycle | Part) => void;
  onMarkAsSold: (itemId: string, type: 'motorcycle' | 'part') => void;
  onPromoteItem: (itemId: string, type: 'motorcycle' | 'part') => void;
  savedSearches: SavedSearch[];
  onDeleteSearch: (searchId: string) => void;
  onNavigateToFavorites: () => void;
  onCancelSale: (itemId: string, type: 'motorcycle' | 'part') => void;
  onDeleteItem: (itemId: string, type: 'motorcycle' | 'part') => void;
}

const formatSearchCriteria = (search: SavedSearch): string => {
    const parts: string[] = [];
    if (search.searchTerm) parts.push(`'${search.searchTerm}'`);
    if (search.locationFilter) parts.push(`en '${search.locationFilter}'`);
    
    if (search.searchType === 'motorcycle') {
        if (search.motorcycleCategory && search.motorcycleCategory !== 'All') parts.push(search.motorcycleCategory);
        if (search.priceRange && search.priceRange.min && search.priceRange.max) parts.push(`$${search.priceRange.min}-$${search.priceRange.max}`);
        if (search.yearRange && search.yearRange.min && search.yearRange.max) parts.push(`${search.yearRange.min}-${search.yearRange.max}`);
        if (search.engineSizeCategory && search.engineSizeCategory !== 'any') {
            const categories = {'125': '<= 125cc', '125-500': '125-500cc', '501-1000': '501-1000cc', '1000+': '> 1000cc'};
            parts.push(categories[search.engineSizeCategory as keyof typeof categories]);
        }
    } else {
        if (search.partCategory && search.partCategory !== 'All') parts.push(search.partCategory);
        if (search.priceRange && search.priceRange.min && search.priceRange.max) parts.push(`$${search.priceRange.min}-$${search.priceRange.max}`);
    }

    if (parts.length === 0) return search.searchType === 'motorcycle' ? 'Cualquier moto' : 'Cualquier pieza';
    return `${search.searchType === 'motorcycle' ? 'Motos' : 'Piezas'}: ${parts.join(', ')}`;
};

const StatItem: React.FC<{ icon: React.ReactNode; value: number }> = ({ icon, value }) => (
    <div className="flex items-center gap-1.5">
        {icon}
        <span className="font-semibold">{value.toLocaleString('en-US')}</span>
    </div>
);

const ProfileView: React.FC<ProfileViewProps> = ({ 
    currentUser, userMotorcycles, userParts, onGoToSell, onSelectMotorcycle, onSelectPart, onLogout, 
    notificationPermission, onRequestPermission, onUpdateProfileImage, 
    onEditItem, onMarkAsSold, onPromoteItem, savedSearches, onDeleteSearch, onNavigateToFavorites,
    onCancelSale,
    onDeleteItem
}) => {

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (!file.type.startsWith('image/')) {
              alert('Por favor, selecciona un archivo de imagen.');
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                onUpdateProfileImage(reader.result);
              }
          };
          reader.readAsDataURL(file);
      }
  };
  
  const activeAndReservedMotorcycleListings = userMotorcycles.filter(m => m.status === 'for-sale' || m.status === 'reserved');
  const soldMotorcycleListings = userMotorcycles.filter(m => m.status === 'sold');
  const activeAndReservedPartListings = userParts.filter(p => p.status === 'for-sale' || p.status === 'reserved');
  const soldPartListings = userParts.filter(p => p.status === 'sold');
  const userRating = (currentUser.totalRatingPoints && currentUser.numberOfRatings)
    ? currentUser.totalRatingPoints / currentUser.numberOfRatings
    : 0;
  
  const allSoldItems = [
    ...soldMotorcycleListings.map(item => ({ ...item, type: 'motorcycle' as const })),
    ...soldPartListings.map(item => ({ ...item, type: 'part' as const }))
  ].sort((a, b) => b.id - a.id); // Sort by ID, assuming newer items have higher IDs

  return (
    <motion.div 
      className="p-4 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 mb-8 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center gap-4">
            <input
                type="file"
                id="profile-image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageChange}
            />
            <motion.label 
              htmlFor="profile-image-upload" 
              className="relative cursor-pointer group flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                {currentUser.profileImageUrl ? (
                    <img src={currentUser.profileImageUrl} alt="Foto de perfil" className="w-16 h-16 rounded-full object-cover"/>
                ) : (
                    <div className="w-16 h-16 rounded-full bg-background-light dark:bg-background-dark flex items-center justify-center border border-border-light dark:border-border-dark">
                        <ProfileIcon className="w-10 h-10 text-primary" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <EditIcon className="w-6 h-6 text-white" />
                </div>
            </motion.label>
            <div>
                <motion.h2 
                  className="text-xl font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {currentUser.name}
                </motion.h2>
                <motion.p 
                  className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {currentUser.email}
                </motion.p>
                 <motion.div 
                  className="flex items-center gap-1 mt-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                    {currentUser.numberOfRatings ? (
                        <>
                            <StarRating rating={userRating} size="sm" readOnly />
                            <span className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">({currentUser.numberOfRatings} valoraciones)</span>
                        </>
                    ) : (
                        <p className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">Aún no tienes valoraciones</p>
                    )}
                </motion.div>
            </div>
        </div>
        <motion.button 
          onClick={onLogout} 
          className="p-2 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
            <LogoutIcon className="w-6 h-6"/>
        </motion.button>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.button 
          onClick={onNavigateToFavorites} 
          className="flex items-center gap-3 bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-4 hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
            <HeartIcon className="w-6 h-6 text-primary"/>
            <span className="font-bold text-foreground-light dark:text-foreground-dark">Mis Favoritos</span>
        </motion.button>
         <motion.div 
          className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-4"
          whileHover={{ y: -3 }}
        >
            <h3 className="text-sm font-bold mb-1">Notificaciones</h3>
            {notificationPermission === 'granted' ? (
              <motion.p 
                className="text-xs text-green-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                Activadas
              </motion.p>
            ) : (
              <motion.button 
                onClick={onRequestPermission} 
                className="text-xs text-primary font-semibold hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Activar
              </motion.button>
            )}
        </motion.div>
      </motion.div>


      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
            <div className="flex justify-between items-center mb-4">
                <motion.h3 
                  className="text-lg font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  Mis Anuncios de Motos ({activeAndReservedMotorcycleListings.length})
                </motion.h3>
                <motion.button
                    onClick={onGoToSell}
                    className="bg-primary/20 text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary/30 transition-colors duration-300 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    + Vender
                </motion.button>
            </div>

            {activeAndReservedMotorcycleListings.length > 0 ? (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
                {activeAndReservedMotorcycleListings.map((moto, index) => {
                const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(moto.price);
                const isReserved = moto.status === 'reserved';
                return (
                    <motion.div 
                      key={moto.id} 
                      className="bg-card-light dark:bg-card-dark p-3 rounded-xl flex flex-col gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      whileHover={{ y: -3 }}
                    >
                        <div className="flex items-center gap-3">
                            <div onClick={() => onSelectMotorcycle(moto)} className="flex-grow flex items-center gap-3 cursor-pointer">
                                <img src={moto.imageUrls[0]} alt={`${moto.make} ${moto.model}`} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="font-bold">{moto.make} {moto.model}</p>
                                    <p className="text-sm text-primary">{formattedPrice}</p>
                                    {isReserved && <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">RESERVADO</span>}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {isReserved ? (
                                    <motion.button 
                                      onClick={(e) => { e.stopPropagation(); onCancelSale(moto.id, 'motorcycle'); }} 
                                      className="text-xs font-semibold text-orange-600 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-2 rounded-md transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Volver a Publicar
                                    </motion.button>
                                ) : (
                                    <>
                                    {moto.featured ? (
                                        <div className="flex items-center gap-1 text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-3 py-2 rounded-md">
                                            <StarIcon className="w-4 h-4" />
                                            <span>Promocionado</span>
                                        </div>
                                    ) : (
                                        <motion.button 
                                          onClick={(e) => { e.stopPropagation(); onPromoteItem(moto.id, 'motorcycle'); }} 
                                          className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-md transition-colors"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          Promocionar
                                        </motion.button>
                                    )}
                                    <motion.button 
                                      onClick={(e) => { e.stopPropagation(); onEditItem(moto); }} 
                                      className="p-2 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-blue-500 rounded-full hover:bg-blue-500/10 transition-colors" 
                                      aria-label="Editar anuncio"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <EditIcon className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button 
                                      onClick={(e) => { e.stopPropagation(); onMarkAsSold(moto.id, 'motorcycle'); }} 
                                      className="text-xs font-semibold text-green-600 bg-green-500/10 hover:bg-green-500/20 px-3 py-2 rounded-md transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Vendido
                                    </motion.button>
                                    <motion.button 
                                      onClick={(e) => { e.stopPropagation(); onDeleteItem(moto.id, 'motorcycle'); }} 
                                      className="p-2 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors" 
                                      aria-label="Eliminar anuncio"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </motion.button>
                                    </>
                                )}
                            </div>
                        </div>
                        {moto.featured && moto.stats && (
                            <motion.div 
                              className="border-t border-border-light dark:border-border-dark pt-3 flex justify-around items-center text-xs text-foreground-muted-light dark:text-foreground-muted-dark"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                            >
                                <StatItem icon={<EyeIcon className="w-4 h-4" />} value={moto.stats.views} />
                                <StatItem icon={<HeartIcon className="w-4 h-4" />} value={moto.stats.favorites} />
                                <StatItem icon={<ChatIcon className="w-4 h-4" />} value={moto.stats.chats} />
                            </motion.div>
                        )}
                    </motion.div>
                );
                })}
            </motion.div>
            ) : (
            <motion.div 
              className="text-center py-12 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
                <h4 className="text-lg font-semibold">Aún no has publicado ninguna moto</h4>
                <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2 mb-6">¡Anímate a vender!</p>
                <motion.button 
                  onClick={onGoToSell} 
                  className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Vender mi Moto
                </motion.button>
            </motion.div>
            )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
            <motion.h3 
              className="text-lg font-bold mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              Mis Piezas en Venta ({activeAndReservedPartListings.length})
            </motion.h3>
             {activeAndReservedPartListings.length > 0 ? (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
                {activeAndReservedPartListings.map((part, index) => {
                const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(part.price);
                const isReserved = part.status === 'reserved';
                return (
                    <motion.div 
                      key={part.id} 
                      className="bg-card-light dark:bg-card-dark p-3 rounded-xl flex flex-col gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                      whileHover={{ y: -3 }}
                    >
                        <div className="flex items-center gap-3">
                            <div onClick={() => onSelectPart(part)} className="flex-grow flex items-center gap-3 cursor-pointer">
                                <img src={part.imageUrls[0]} alt={part.name} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="font-bold">{part.name}</p>
                                    <p className="text-sm text-primary">{formattedPrice}</p>
                                    {isReserved && <span className="text-xs font-bold text-blue-500 bg-blue-550/10 px-2 py-0.5 rounded-full">RESERVADO</span>}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {isReserved ? (
                                    <motion.button 
                                      onClick={(e) => { e.stopPropagation(); onCancelSale(part.id, 'part'); }} 
                                      className="text-xs font-semibold text-orange-600 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-2 rounded-md transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Volver a Publicar
                                    </motion.button>
                                ) : (
                                    <>
                                    {part.featured ? (
                                        <div className="flex items-center gap-1 text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-3 py-2 rounded-md">
                                            <StarIcon className="w-4 h-4" />
                                            <span>Promocionado</span>
                                        </div>
                                    ) : (
                                        <motion.button 
                                          onClick={(e) => { e.stopPropagation(); onPromoteItem(part.id, 'part'); }} 
                                          className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-md transition-colors"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          Promocionar
                                        </motion.button>
                                    )}
                                    <motion.button 
                                      onClick={(e) => { e.stopPropagation(); onEditItem(part); }} 
                                      className="p-2 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-blue-500 rounded-full hover:bg-blue-500/10 transition-colors" 
                                      aria-label="Editar anuncio"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <EditIcon className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button 
                                      onClick={(e) => { e.stopPropagation(); onMarkAsSold(part.id, 'part'); }} 
                                      className="text-xs font-semibold text-green-600 bg-green-500/10 hover:bg-green-500/20 px-3 py-2 rounded-md transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Vendido
                                    </motion.button>
                                    <motion.button 
                                      onClick={(e) => { e.stopPropagation(); onDeleteItem(part.id, 'part'); }} 
                                      className="p-2 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors" 
                                      aria-label="Eliminar anuncio"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </motion.button>
                                    </>
                                )}
                            </div>
                        </div>
                        {part.featured && part.stats && (
                             <motion.div 
                              className="border-t border-border-light dark:border-border-dark pt-3 flex justify-around items-center text-xs text-foreground-muted-light dark:text-foreground-muted-dark"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                            >
                                <StatItem icon={<EyeIcon className="w-4 h-4" />} value={part.stats.views} />
                                <StatItem icon={<HeartIcon className="w-4 h-4" />} value={part.stats.favorites} />
                                <StatItem icon={<ChatIcon className="w-4 h-4" />} value={part.stats.chats} />
                            </motion.div>
                        )}
                    </motion.div>
                );
                })}
            </motion.div>
            ) : (
            <motion.div 
              className="text-center py-12 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
                <h4 className="text-lg font-semibold">No tienes piezas en venta</h4>
            </motion.div>
            )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
            <motion.h3 
              className="text-lg font-bold mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              Mis Alertas ({savedSearches.length})
            </motion.h3>
            {savedSearches.length > 0 ? (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                    {savedSearches.map((search, index) => (
                        <motion.div 
                          key={search.id} 
                          className="bg-card-light dark:bg-card-dark p-3 rounded-xl flex items-center justify-between gap-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                          whileHover={{ y: -3 }}
                        >
                            <p className="flex-grow text-sm font-medium">{formatSearchCriteria(search)}</p>
                            <motion.button 
                              onClick={() => onDeleteSearch(search.id)} 
                              className="p-2 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary rounded-full hover:bg-primary/10 transition-colors" 
                              aria-label="Eliminar alerta"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                                <TrashIcon className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                  className="text-center py-12 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                    <h4 className="text-lg font-semibold">No tienes alertas guardadas</h4>
                    <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Guarda una búsqueda para recibir notificaciones de nuevos artículos.</p>
                </motion.div>
            )}
        </motion.div>
        
        {allSoldItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
                <motion.h3 
                  className="text-lg font-bold mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  Historial de Ventas ({allSoldItems.length})
                </motion.h3>
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                    {allSoldItems.map((item, index) => {
                        const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.price);
                        const itemName = item.type === 'motorcycle' ? `${item.make} ${item.model}` : item.name;
                        const onSelectItem = () => item.type === 'motorcycle' ? onSelectMotorcycle(item as Motorcycle) : onSelectPart(item as Part);
                        
                        return (
                            <motion.div 
                              key={item.id} 
                              onClick={onSelectItem} 
                              className="bg-card-light dark:bg-card-dark p-4 rounded-xl flex items-center gap-4 cursor-pointer"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                              whileHover={{ y: -3, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                                <div className="relative flex-shrink-0">
                                    <img src={item.imageUrls[0]} alt={itemName} className="w-24 h-16 object-cover rounded-lg opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">VENDIDO</span>
                                    </div>
                                </div>
                                <div className="flex-grow opacity-60">
                                    <p className="font-bold">{itemName}</p>
                                    <p className="text-sm text-primary">{formattedPrice}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProfileView;