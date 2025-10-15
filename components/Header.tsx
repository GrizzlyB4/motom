
import React from 'react';
import { FilterIcon, SearchIcon } from './Icons';
import { View } from '../App';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onOpenFilters: () => void;
    currentView: View;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, onOpenFilters, currentView }) => {
    const isSearchVisible = currentView === 'home';

    const getTitle = () => {
        switch(currentView) {
            case 'home':
                return 'MotoMarket';
            case 'profile':
                return 'Mi Perfil';
            case 'favorites':
                return 'Favoritos';
            case 'sell':
                return 'Vender mi Moto';
            case 'chatList':
                return 'Mis Chats';
            default:
                return 'MotoMarket';
        }
    };

    return (
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="w-8"></div>
                    <h1 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">{getTitle()}</h1>
                    {isSearchVisible ? (
                        <button onClick={onOpenFilters} className="text-foreground-light dark:text-foreground-dark p-1">
                            <FilterIcon />
                        </button>
                    ) : (
                        <div className="w-8"></div>
                    )}
                </div>
                {isSearchVisible && (
                    <div className="mt-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <SearchIcon className="text-foreground-muted-light dark:text-foreground-muted-dark" />
                            </div>
                            <input
                                className="form-input w-full pl-12 pr-4 py-3 rounded-full bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark placeholder-foreground-muted-light dark:placeholder-foreground-muted-dark focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Buscar por marca, modelo..."
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
