import React from 'react';
import { User, Motorcycle, SavedSearch } from '../types';
import { ProfileIcon, LogoutIcon, EditIcon, TrashIcon, StarIcon } from './Icons';
import StarRating from './StarRating';

interface ProfileViewProps {
  currentUser: User;
  userMotorcycles: Motorcycle[];
  onGoToSell: () => void;
  onSelectMotorcycle: (moto: Motorcycle) => void;
  onLogout: () => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
  onUpdateProfileImage: (imageUrl: string) => void;
  onEditMotorcycle: (moto: Motorcycle) => void;
  onMarkAsSold: (motoId: number) => void;
  onPromoteMotorcycle: (motoId: number) => void;
  savedSearches: SavedSearch[];
  onDeleteSearch: (searchId: string) => void;
}

const formatSearchCriteria = (search: SavedSearch): string => {
    const parts: string[] = [];
    if (search.searchTerm) parts.push(`'${search.searchTerm}'`);
    if (search.locationFilter) parts.push(`en '${search.locationFilter}'`);
    if (search.category !== 'All') parts.push(search.category);
    if (search.priceRange.min && search.priceRange.max) parts.push(`$${search.priceRange.min}-$${search.priceRange.max}`);
    else if (search.priceRange.min) parts.push(`> $${search.priceRange.min}`);
    else if (search.priceRange.max) parts.push(`< $${search.priceRange.max}`);
    if (search.yearRange.min && search.yearRange.max) parts.push(`${search.yearRange.min}-${search.yearRange.max}`);
    else if (search.yearRange.min) parts.push(`> ${search.yearRange.min}`);
    else if (search.yearRange.max) parts.push(`< ${search.yearRange.max}`);
    if (search.engineSizeCategory !== 'any') {
        const categories = {
            '125': '<= 125cc',
            '125-500': '125-500cc',
            '501-1000': '501-1000cc',
            '1000+': '> 1000cc'
        };
        parts.push(categories[search.engineSizeCategory as keyof typeof categories]);
    }
    if (parts.length === 0) return 'Cualquier moto';
    return parts.join(', ');
};

const ProfileView: React.FC<ProfileViewProps> = ({ 
    currentUser, userMotorcycles, onGoToSell, onSelectMotorcycle, onLogout, 
    notificationPermission, onRequestPermission, onUpdateProfileImage, 
    onEditMotorcycle, onMarkAsSold, onPromoteMotorcycle, savedSearches, onDeleteSearch 
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
  
  const activeListings = userMotorcycles.filter(m => m.status === 'for-sale');
  const soldListings = userMotorcycles.filter(m => m.status === 'sold');
  const userRating = (currentUser.totalRatingPoints && currentUser.numberOfRatings)
    ? currentUser.totalRatingPoints / currentUser.numberOfRatings
    : 0;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <input
                type="file"
                id="profile-image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageChange}
            />
            <label htmlFor="profile-image-upload" className="relative cursor-pointer group flex-shrink-0">
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
            </label>
            <div>
                <h2 className="text-xl font-bold">{currentUser.name}</h2>
                <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">{currentUser.email}</p>
                 <div className="flex items-center gap-1 mt-1">
                    {currentUser.numberOfRatings ? (
                        <>
                            <StarRating rating={userRating} size="sm" readOnly />
                            <span className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">({currentUser.numberOfRatings} valoraciones)</span>
                        </>
                    ) : (
                        <p className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">Aún no tienes valoraciones</p>
                    )}
                </div>
            </div>
        </div>
        <button onClick={onLogout} className="p-2 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary transition-colors">
            <LogoutIcon className="w-6 h-6"/>
        </button>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-bold mb-3">Notificaciones</h3>
        {notificationPermission === 'granted' ? (
          <p className="text-sm text-green-500">✓ Las notificaciones están activadas.</p>
        ) : notificationPermission === 'denied' ? (
          <p className="text-sm text-red-500">
            Las notificaciones están bloqueadas. Debes habilitarlas en la configuración de tu navegador para recibir alertas.
          </p>
        ) : (
          <>
            <p className="text-foreground-muted-light dark:text-foreground-muted-dark mb-4 text-sm">
              Recibe alertas sobre nuevos mensajes y caídas de precio en tus motos favoritas.
            </p>
            <button
              onClick={onRequestPermission}
              className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Activar Notificaciones
            </button>
          </>
        )}
      </div>

      <div className="space-y-8">
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Mis Anuncios ({activeListings.length})</h3>
                <button
                    onClick={onGoToSell}
                    className="bg-primary/20 text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary/30 transition-colors duration-300 text-sm"
                >
                    + Vender Moto
                </button>
            </div>

            {activeListings.length > 0 ? (
            <div className="space-y-4">
                {activeListings.map(moto => {
                const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(moto.price);
                return (
                    <div key={moto.id} className="bg-card-light dark:bg-card-dark p-3 rounded-xl flex items-center gap-3">
                        <div onClick={() => onSelectMotorcycle(moto)} className="flex-grow flex items-center gap-3 cursor-pointer">
                            <img src={moto.imageUrls[0]} alt={`${moto.make} ${moto.model}`} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="font-bold">{moto.make} {moto.model}</p>
                                <p className="text-sm text-primary">{formattedPrice}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            {moto.featured ? (
                                <div className="flex items-center gap-1 text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-3 py-2 rounded-md">
                                    <StarIcon className="w-4 h-4" />
                                    <span>Promocionado</span>
                                </div>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onPromoteMotorcycle(moto.id); }}
                                    className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-md transition-colors"
                                >
                                    Promocionar
                                </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); onEditMotorcycle(moto); }}
                                className="p-2 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-blue-500 rounded-full hover:bg-blue-500/10 transition-colors"
                                aria-label="Editar anuncio"
                            >
                                <EditIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onMarkAsSold(moto.id); }}
                                className="text-xs font-semibold text-green-600 bg-green-500/10 hover:bg-green-500/20 px-3 py-2 rounded-md transition-colors"
                            >
                                Vendido
                            </button>
                        </div>
                    </div>
                );
                })}
            </div>
            ) : (
            <div className="text-center py-12 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl">
                <h4 className="text-lg font-semibold">Aún no has publicado ninguna moto</h4>
                <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2 mb-6">¡Anímate a vender!</p>
                <button
                    onClick={onGoToSell}
                    className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Vender mi Moto
                </button>
            </div>
            )}
        </div>

        <div>
            <h3 className="text-lg font-bold mb-4">Mis Alertas ({savedSearches.length})</h3>
            {savedSearches.length > 0 ? (
                <div className="space-y-3">
                    {savedSearches.map(search => (
                        <div key={search.id} className="bg-card-light dark:bg-card-dark p-3 rounded-xl flex items-center justify-between gap-3">
                            <p className="flex-grow text-sm font-medium">{formatSearchCriteria(search)}</p>
                            <button
                                onClick={() => onDeleteSearch(search.id)}
                                className="p-2 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                                aria-label="Eliminar alerta"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl">
                    <h4 className="text-lg font-semibold">No tienes alertas guardadas</h4>
                    <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Guarda una búsqueda para recibir notificaciones de nuevas motos.</p>
                </div>
            )}
        </div>
        
        {soldListings.length > 0 && (
            <div>
                <h3 className="text-lg font-bold mb-4">Motos Vendidas ({soldListings.length})</h3>
                <div className="space-y-4">
                    {soldListings.map(moto => {
                    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(moto.price);
                    return (
                        <div key={moto.id} onClick={() => onSelectMotorcycle(moto)} className="bg-card-light dark:bg-card-dark p-4 rounded-xl flex items-center gap-4 cursor-pointer">
                            <div className="relative flex-shrink-0">
                                <img src={moto.imageUrls[0]} alt={`${moto.make} ${moto.model}`} className="w-24 h-16 object-cover rounded-lg opacity-50" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">VENDIDO</span>
                                </div>
                            </div>
                            <div className="flex-grow opacity-60">
                                <p className="font-bold">{moto.make} {moto.model}</p>
                                <p className="text-sm text-primary">{formattedPrice}</p>
                            </div>
                        </div>
                    );
                    })}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ProfileView;