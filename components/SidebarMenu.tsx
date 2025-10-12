import React from 'react';
import { User } from '../types';
// fix: Import ProfileIcon and MotorcycleIcon which are available in Icons.tsx.
import { ProfileIcon, CloseIcon, MotorcycleIcon } from './Icons';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onNavigate: (view: 'home' | 'sell' | 'profile' | 'login') => void;
  onLogout: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose, currentUser, onNavigate, onLogout }) => {
  const handleNavigation = (view: 'home' | 'sell' | 'profile' | 'login') => {
    onNavigate(view);
    onClose();
  };
  
  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar Content */}
      <div
        className={`relative flex flex-col w-80 max-w-[90vw] h-full bg-gray-800 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
             <MotorcycleIcon className="h-8 w-auto text-orange-500" />
              <span className="text-xl font-bold font-heading text-white">
                MM
              </span>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700" aria-label="Cerrar menú">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {currentUser ? (
          <>
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    {/* fix: Use ProfileIcon instead of the non-existent UserIcon. */}
                    <ProfileIcon className="w-10 h-10 p-2 bg-gray-700 rounded-full text-orange-400" />
                    <div>
                        <p className="font-semibold text-white">Bienvenido</p>
                        <p className="text-sm text-gray-400 truncate">{currentUser.email}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-grow p-4 space-y-2">
              {/* FIX: Changed navigation view from 'list' to 'home' */}
              <NavItem onClick={() => handleNavigation('home')} label="Comprar" />
              <NavItem onClick={() => handleNavigation('sell')} label="Vender mi Moto" />
              <NavItem onClick={() => handleNavigation('profile')} label="Mi Perfil" />
            </nav>

            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogoutClick}
                className="w-full text-left font-semibold text-gray-300 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
             <div className="flex-grow p-4 flex flex-col justify-center items-center">
                <p className="text-gray-400 mb-4 text-center">Inicia sesión para acceder a todas las funciones.</p>
                <button 
                    onClick={() => handleNavigation('login')}
                    className="bg-orange-600 text-white font-bold py-2 px-6 rounded-md hover:bg-orange-700 transition-colors duration-300"
                >
                    Iniciar Sesión
                </button>
             </div>
        )}
      </div>
    </div>
  );
};

const NavItem: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="w-full text-left text-lg font-semibold text-gray-300 hover:text-orange-400 hover:bg-orange-500/10 p-3 rounded-lg transition-colors duration-200"
  >
    {label}
  </button>
);

export default SidebarMenu;
