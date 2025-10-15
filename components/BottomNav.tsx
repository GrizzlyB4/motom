
import React from 'react';
import { View } from '../App';
import { MotorcycleIcon, HeartIcon, PlusIcon, ChatIcon, ProfileIcon } from './Icons';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: 'home', icon: MotorcycleIcon, label: 'Home' },
    { view: 'favorites', icon: HeartIcon, label: 'Favorites' },
    { view: 'sell', icon: PlusIcon, label: 'Sell' },
    { view: 'chat', icon: ChatIcon, label: 'Chat' },
    { view: 'profile', icon: ProfileIcon, label: 'Profile' },
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
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-90 ${
                isActive ? 'text-primary' : 'text-foreground-muted-light dark:text-foreground-muted-dark hover:text-primary dark:hover:text-primary'
              }`}
              aria-label={item.label}
            >
              <item.icon />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default BottomNav;