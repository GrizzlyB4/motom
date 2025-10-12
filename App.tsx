import React, { useState, useMemo, useEffect } from 'react';
import { Motorcycle, User, MotorcycleCategory } from './types';
import Header from './components/Header';
import MotorcycleList from './components/MotorcycleList';
import MotorcycleDetailView from './components/MotorcycleDetailView';
import LoginView from './components/LoginView';
import SellForm from './components/SellForm';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';
import FilterModal from './components/FilterModal';

const mockMotorcycles: Motorcycle[] = [
    { id: 1, make: 'Honda', model: 'CB650R', year: 2021, price: 7500, mileage: 8500, engineSize: 649, description: 'Como nueva...', imageUrl: 'https://picsum.photos/seed/cb650r/800/600', sellerEmail: 'seller1@example.com', category: 'Sport' },
    { id: 2, make: 'Kawasaki', model: 'Z900', year: 2020, price: 8200, mileage: 12000, engineSize: 948, description: 'Vendo Kawasaki Z900...', imageUrl: 'https://picsum.photos/seed/z900/800/600', sellerEmail: 'user@motomarket.com', category: 'Sport' },
    { id: 3, make: 'Yamaha', model: 'MT-07', year: 2022, price: 6800, mileage: 4500, engineSize: 689, description: 'Yamaha MT-07 del 2022...', imageUrl: 'https://picsum.photos/seed/mt07/800/600', sellerEmail: 'seller2@example.com', category: 'Sport' },
    { id: 4, make: 'BMW', model: 'R1250GS', year: 2021, price: 21500, mileage: 15000, engineSize: 1254, description: 'Impresionante R1250GS...', imageUrl: 'https://picsum.photos/seed/r1250gs/800/600', sellerEmail: 'user@motomarket.com', category: 'Touring' },
    { id: 5, make: 'Ducati', model: 'Panigale V2', year: 2020, price: 16000, mileage: 9800, engineSize: 955, description: 'Ducati Panigale V2...', imageUrl: 'https://picsum.photos/seed/panigale-v2/800/600', sellerEmail: 'seller3@example.com', category: 'Sport' },
    { id: 8, make: 'Harley-Davidson', model: 'Iron 883', year: 2018, price: 9200, mileage: 18000, engineSize: 883, description: 'Icónica Iron 883...', imageUrl: 'https://picsum.photos/seed/iron883/800/600', sellerEmail: 'seller6@example.com', category: 'Cruiser' },
    { id: 9, make: 'KTM', model: '390 Adventure', year: 2022, price: 6500, mileage: 5000, engineSize: 373, description: 'Perfecta trail ligera...', imageUrl: 'https://picsum.photos/seed/390adv/800/600', sellerEmail: 'user@motomarket.com', category: 'Off-Road' }
];

export type View = 'home' | 'detail' | 'sell' | 'profile' | 'favorites' | 'chat' | 'login';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(mockMotorcycles);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [yearRange, setYearRange] = useState({ min: '', max: '' });
  const [engineSizeCategory, setEngineSizeCategory] = useState('any');
  const [selectedCategory, setSelectedCategory] = useState<MotorcycleCategory>('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedMotorcycle]);

  const handleNavigate = (newView: View) => {
    setView(newView);
  };

  const handleSelectMotorcycle = (moto: Motorcycle) => { setSelectedMotorcycle(moto); setView('detail'); };
  const handleBackToPrevView = () => { setSelectedMotorcycle(null); setView('home'); };
  const handleLoginSuccess = (user: User) => { setCurrentUser(user); setView('home'); };
  const handleLogout = () => { setCurrentUser(null); setView('home'); };

  const handlePublish = (newMotoData: Omit<Motorcycle, 'id' | 'imageUrl' | 'sellerEmail' | 'category'>) => {
    if(!currentUser) { return; }
    const newMoto: Motorcycle = {
        ...newMotoData,
        id: motorcycles.length + 1,
        imageUrl: `https://placehold.co/800x600/182830/e3e8ea?text=${newMotoData.make}`,
        sellerEmail: currentUser.email,
        category: 'Sport', // Default category for now
    };
    setMotorcycles(prev => [newMoto, ...prev]);
    alert("¡Tu moto ha sido publicada!");
    setView('profile');
  };
  
  const handleResetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setYearRange({ min: '', max: '' });
    setEngineSizeCategory('any');
  };

  const filteredMotorcycles = useMemo(() => {
    let filtered = [...motorcycles];
    const lowercasedFilter = searchTerm.toLowerCase();
    if (lowercasedFilter) {
      filtered = filtered.filter(m => `${m.make} ${m.model} ${m.year}`.toLowerCase().includes(lowercasedFilter));
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }
    const minPrice = parseFloat(priceRange.min);
    if (!isNaN(minPrice)) filtered = filtered.filter(m => m.price >= minPrice);
    const maxPrice = parseFloat(priceRange.max);
    if (!isNaN(maxPrice)) filtered = filtered.filter(m => m.price <= maxPrice);
    const minYear = parseInt(yearRange.min, 10);
    if (!isNaN(minYear)) filtered = filtered.filter(m => m.year >= minYear);
    const maxYear = parseInt(yearRange.max, 10);
    if (!isNaN(maxYear)) filtered = filtered.filter(m => m.year <= maxYear);
    if (engineSizeCategory !== 'any') {
      filtered = filtered.filter(m => {
        switch (engineSizeCategory) {
          case '125': return m.engineSize <= 125;
          case '125-500': return m.engineSize > 125 && m.engineSize <= 500;
          case '501-1000': return m.engineSize > 500 && m.engineSize <= 1000;
          case '1000+': return m.engineSize > 1000;
          default: return true;
        }
      });
    }
    return filtered;
  }, [motorcycles, searchTerm, priceRange, yearRange, engineSizeCategory, selectedCategory]);

  const userMotorcycles = useMemo(() => {
    if (!currentUser) return [];
    return motorcycles.filter(moto => moto.sellerEmail === currentUser.email);
  }, [motorcycles, currentUser]);
  
  const PlaceholderView = ({ title }: { title: string }) => (
    <div className="p-8 text-center h-full flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">{title}</h2>
        <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Esta funcionalidad no está implementada todavía.</p>
    </div>
  );

  // If the user is not logged in, render only the LoginView.
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // Main application content for logged-in users.
  const renderContent = () => {
    switch (view) {
      case 'detail':
        return selectedMotorcycle && <MotorcycleDetailView motorcycle={selectedMotorcycle} onBack={handleBackToPrevView} />;
      case 'sell':
        return <SellForm onBack={() => setView('home')} onPublish={handlePublish} />;
      case 'profile':
        return <ProfileView currentUser={currentUser} userMotorcycles={userMotorcycles} onGoToSell={() => setView('sell')} onSelectMotorcycle={handleSelectMotorcycle} onLogout={handleLogout} />;
      case 'favorites':
        return <PlaceholderView title="Favoritos" />;
      case 'chat':
        return <PlaceholderView title="Chat" />;
      case 'home':
      default:
        return (
          <MotorcycleList 
            motorcycles={filteredMotorcycles} 
            onSelectMotorcycle={handleSelectMotorcycle}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        );
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen text-foreground-light dark:text-foreground-dark">
      {view !== 'detail' && (
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onOpenFilters={() => setIsFilterModalOpen(true)}
        />
      )}
      <main className={`flex-1 ${view !== 'detail' ? 'pb-24' : ''}`}>
        {renderContent()}
      </main>
      {view !== 'detail' && (
        <BottomNav currentView={view} onNavigate={handleNavigate} />
      )}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        yearRange={yearRange}
        setYearRange={setYearRange}
        engineSizeCategory={engineSizeCategory}
        setEngineSizeCategory={setEngineSizeCategory}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default App;