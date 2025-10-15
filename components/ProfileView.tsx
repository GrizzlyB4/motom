import React from 'react';
import { User, Motorcycle } from '../types';
import { ProfileIcon, LogoutIcon } from './Icons';

interface ProfileViewProps {
  currentUser: User;
  userMotorcycles: Motorcycle[];
  onGoToSell: () => void;
  onSelectMotorcycle: (moto: Motorcycle) => void;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, userMotorcycles, onGoToSell, onSelectMotorcycle, onLogout }) => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <ProfileIcon className="w-12 h-12 text-primary" />
            <div>
                <h2 className="text-xl font-bold">Mi Perfil</h2>
                <p className="text-foreground-muted-light dark:text-foreground-muted-dark">{currentUser.email}</p>
            </div>
        </div>
        <button onClick={onLogout} className="p-2 text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary transition-colors">
            <LogoutIcon className="w-6 h-6"/>
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Mis Anuncios ({userMotorcycles.length})</h3>
            <button
                onClick={onGoToSell}
                className="bg-primary/20 text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary/30 transition-colors duration-300 text-sm"
            >
                + Vender Moto
            </button>
        </div>

        {userMotorcycles.length > 0 ? (
          <div className="space-y-4">
            {userMotorcycles.map(moto => {
               const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(moto.price);
               return (
                <div key={moto.id} onClick={() => onSelectMotorcycle(moto)} className="bg-card-light dark:bg-card-dark p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors">
                    <img src={moto.imageUrls[0]} alt={`${moto.make} ${moto.model}`} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="font-bold">{moto.make} {moto.model}</p>
                        <p className="text-sm text-primary">{formattedPrice}</p>
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
    </div>
  );
};

export default ProfileView;
