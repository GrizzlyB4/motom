import React from 'react';
import { Motorcycle, User } from '../types';
import { ArrowLeftIcon, ProfileIcon } from './Icons';
import MotorcycleCard from './MotorcycleCard';
import StarRating from './StarRating';

interface PublicProfileViewProps {
  seller: User;
  motorcycles: Motorcycle[];
  onBack: () => void;
  onSelectMotorcycle: (moto: Motorcycle) => void;
  favorites: number[];
  onToggleFavorite: (motoId: number) => void;
  currentUser: User;
  userRating?: number;
  onRateUser: (sellerEmail: string, rating: number) => void;
}

const PublicProfileView: React.FC<PublicProfileViewProps> = ({ 
  seller, motorcycles, onBack, onSelectMotorcycle, 
  favorites, onToggleFavorite, currentUser, userRating, onRateUser 
}) => {

  const sellerRating = (seller.totalRatingPoints && seller.numberOfRatings)
    ? seller.totalRatingPoints / seller.numberOfRatings
    : 0;

  const canRate = currentUser.email !== seller.email && !userRating;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <div className="px-4 py-3 h-[57px] flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeftIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark" />
          </button>
          <h1 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">Perfil del Vendedor</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main>
        <div className="p-6 text-center border-b border-border-light dark:border-border-dark flex flex-col items-center">
          {seller.profileImageUrl ? (
            <img src={seller.profileImageUrl} alt="Foto de perfil" className="w-24 h-24 rounded-full object-cover mb-4" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-card-light dark:bg-card-dark flex items-center justify-center border border-border-light dark:border-border-dark mb-4">
              <ProfileIcon className="w-16 h-16 text-primary" />
            </div>
          )}
          <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">{seller.email}</h2>
          <div className="flex items-center gap-1 mt-2">
            {seller.numberOfRatings ? (
                <>
                    <StarRating rating={sellerRating} size="md" readOnly />
                    <span className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">({seller.numberOfRatings} valoraciones)</span>
                </>
            ) : (
                <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">Sin valoraciones</p>
            )}
          </div>
          <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">{motorcycles.length} {motorcycles.length === 1 ? 'anuncio' : 'anuncios'} en venta</p>
        </div>
        
        {canRate && (
            <div className="p-6 text-center border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
                <h3 className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">¿Has interactuado con este vendedor?</h3>
                <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1 mb-3">Deja tu valoración</p>
                <div className="flex justify-center">
                    <StarRating rating={0} size="lg" onRate={(rating) => onRateUser(seller.email, rating)} />
                </div>
            </div>
        )}
        {userRating && (
             <div className="p-4 text-center border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
                <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">Tu valoración:</p>
                <div className="flex justify-center mt-1">
                    <StarRating rating={userRating} size="md" readOnly />
                </div>
            </div>
        )}

        {motorcycles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
            {motorcycles.map(moto => (
                <MotorcycleCard 
                    key={moto.id} 
                    motorcycle={moto} 
                    onSelect={onSelectMotorcycle} 
                    isFavorite={favorites.includes(moto.id)}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-16 px-4">
                <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Este vendedor no tiene anuncios</h3>
                <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Vuelve más tarde para ver si ha publicado algo nuevo.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default PublicProfileView;
