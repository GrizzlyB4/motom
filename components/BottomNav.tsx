


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
      <nav className="flex justify-around items-center px-4 py-2">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          if (item.view === 'sell') {
            return (
              <button key={item.view} onClick={() => onNavigate(item.view)} className="flex flex-col items-center justify-center -mt-8 transition-transform active:scale-90" aria-label={item.label}>
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white shadow-lg">
                  <item.icon />
                </div>
              </button>
            );
          }
          const notificationCount = item.view === 'chat' ? unreadMessagesCount : item.view === 'offers' ? pendingOffersCount : 0;

          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-90 ${
                isActive ? 'text-primary' : 'text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary dark:hover:text-primary'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <item.icon />
                {notificationCount > 0 && (
                    <span className="absolute top-[-4px] right-[-8px] flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold ring-2 ring-background-light dark:ring-background-dark">
                        {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default BottomNav;