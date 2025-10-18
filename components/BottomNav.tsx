import React from 'react';
import { View } from '../App';
import { MotorcycleIcon, BellIcon, PlusIcon, ChatIcon, ProfileIcon } from './Icons';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  unreadMessagesCount: number;
  pendingOffersCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, unreadMessagesCount, pendingOffersCount }) => {
  const navItems = [
    { view: 'home', icon: MotorcycleIcon, label: 'Home' },
    { view: 'offers', icon: BellIcon, label: 'Ofertas' },
    { view: 'sell', icon: PlusIcon, label: 'Vender' },
    { view: 'chat', icon: ChatIcon, label: 'Chat' },
    { view: 'profile', icon: ProfileIcon, label: 'Perfil' },
  ] as const;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark">
      <nav className="flex justify-around items-center px-2 py-2 sm:px-4">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          if (item.view === 'sell') {
            return (
              <button key={item.view} onClick={() => onNavigate(item.view)} className="flex flex-col items-center justify-center -mt-6 sm:-mt-8 transition-transform active:scale-90" aria-label={item.label}>
                <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-white shadow-lg">
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </button>
            );
          }
          const notificationCount = item.view === 'chat' ? unreadMessagesCount : item.view === 'offers' ? pendingOffersCount : 0;

          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all duration-200 active:scale-90 ${
                isActive ? 'text-primary' : 'text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary dark:hover:text-primary'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                {notificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold ring-1 sm:ring-2 ring-background-light dark:ring-background-dark">
                        {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default BottomNav;