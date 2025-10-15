
import React, { useState, useMemo, useEffect } from 'react';
import { Motorcycle, User, MotorcycleCategory, ChatConversation, ChatMessage, HeatmapPoint, SavedSearch } from './types';
import Header from './components/Header';
import MotorcycleList from './components/MotorcycleList';
import MotorcycleDetailView from './components/MotorcycleDetailView';
import LoginView from './components/LoginView';
import SignUpView from './components/SignUpView';
import SellForm from './components/SellForm';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';
import FilterModal from './components/FilterModal';
import ChatListView from './components/ChatListView';
import ChatDetailView from './components/ChatDetailView';
import FavoritesView from './components/FavoritesView';
import PublicProfileView from './components/PublicProfileView';
import EditForm from './components/EditForm';
import HeatmapOverlay from './components/HeatmapOverlay';
import ConfirmationModal from './components/ConfirmationModal';


const mockMotorcycles: Motorcycle[] = [
    { id: 1, make: 'Honda', model: 'CB650R', year: 2021, price: 7500, mileage: 8500, engineSize: 649, description: 'Como nueva...', imageUrls: ['https://images.unsplash.com/photo-1621115132957-81df81347053?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'seller1@example.com', category: 'Sport', status: 'for-sale', location: 'Madrid, España', featured: true },
    { id: 2, make: 'Kawasaki', model: 'Z900', year: 2020, price: 8200, mileage: 12000, engineSize: 948, description: 'Vendo Kawasaki Z900...', imageUrls: ['https://images.unsplash.com/photo-1623563720235-3a0639f60324?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'user@motomarket.com', category: 'Sport', status: 'for-sale', location: 'Barcelona, España', featured: false },
    { id: 3, make: 'Yamaha', model: 'MT-07', year: 2022, price: 6800, mileage: 4500, engineSize: 689, description: 'Yamaha MT-07 del 2022...', imageUrls: ['https://images.unsplash.com/photo-1640890656113-3a137250abfa?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'seller2@example.com', category: 'Sport', status: 'for-sale', location: 'Valencia, España', featured: false },
    { id: 4, make: 'BMW', model: 'R1250GS', year: 2021, price: 21500, mileage: 15000, engineSize: 1254, description: 'Impresionante R1250GS...', imageUrls: ['https://images.unsplash.com/photo-1623563720275-2c86b2253245?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'user@motomarket.com', category: 'Touring', status: 'for-sale', location: 'Sevilla, España', featured: true },
    { id: 5, make: 'Ducati', model: 'Panigale V2', year: 2020, price: 16000, mileage: 9800, engineSize: 955, description: 'Ducati Panigale V2...', imageUrls: ['https://images.unsplash.com/photo-1600761343111-a0a623e1d6d8?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'seller3@example.com', category: 'Sport', status: 'for-sale', location: 'Madrid, España', featured: true },
    { id: 8, make: 'Harley-Davidson', model: 'Iron 883', year: 2018, price: 9200, mileage: 18000, engineSize: 883, description: 'Icónica Iron 883...', imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'seller6@example.com', category: 'Cruiser', status: 'for-sale', location: 'Málaga, España', featured: false },
    { id: 9, make: 'KTM', model: '390 Adventure', year: 2022, price: 6500, mileage: 5000, engineSize: 373, description: 'Perfecta trail ligera...', imageUrls: ['https://images.unsplash.com/photo-1627916699311-3a088371295b?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'user@motomarket.com', category: 'Off-Road', status: 'sold', location: 'Zaragoza, España', featured: false }
];

const mockConversations: ChatConversation[] = [
    { id: 'convo1', participants: ['user@motomarket.com', 'seller1@example.com'], motorcycleId: 1 },
];

const mockMessages: ChatMessage[] = [
    { id: 'msg1', conversationId: 'convo1', senderEmail: 'user@motomarket.com', text: 'Hola, ¿sigue disponible la Honda CB650R?', timestamp: Date.now() - 1000 * 60 * 5, isRead: true },
    { id: 'msg2', conversationId: 'convo1', senderEmail: 'seller1@example.com', text: '¡Hola! Sí, todavía está a la venta.', timestamp: Date.now() - 1000 * 60 * 4, isRead: false },
];

const mockUsers: User[] = [
    { name: 'Carlos Rossi', email: 'user@motomarket.com', profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop', totalRatingPoints: 45, numberOfRatings: 10 }, // 4.5 stars
    { name: 'Juan Pérez', email: 'seller1@example.com', profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', totalRatingPoints: 18, numberOfRatings: 4 }, // 4.5 stars
    { name: 'Ana Gómez', email: 'seller2@example.com', profileImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', totalRatingPoints: 88, numberOfRatings: 20 }, // 4.4 stars
    { name: 'Sofía Loren', email: 'seller3@example.com', profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop' }, // No ratings
    { name: 'Marco Antonio', email: 'seller6@example.com', profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', totalRatingPoints: 5, numberOfRatings: 1 }, // 5 stars
];


export type View = 'home' | 'detail' | 'sell' | 'profile' | 'favorites' | 'chat' | 'chatList' | 'chatDetail' | 'login' | 'publicProfile' | 'edit' | 'signup';

// --- Notification Service Functions ---
const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    alert('Este navegador no soporta notificaciones de escritorio');
    return 'denied';
  }
  const permission = await Notification.requestPermission();
  return permission;
};

const sendNotification = (title: string, options?: NotificationOptions): void => {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones de escritorio');
    return;
  }
  
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  } else {
    console.log('Permiso para notificaciones no concedido.');
  }
};


const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [motorcycleToEdit, setMotorcycleToEdit] = useState<Motorcycle | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(mockMotorcycles);
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedSellerEmail, setSelectedSellerEmail] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [yearRange, setYearRange] = useState({ min: '', max: '' });
  const [engineSizeCategory, setEngineSizeCategory] = useState('any');
  const [selectedCategory, setSelectedCategory] = useState<MotorcycleCategory>('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const [favorites, setFavorites] = useState<number[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [userRatings, setUserRatings] = useState<{ [sellerEmail: string]: number }>({});
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
  const [isTyping, setIsTyping] = useState<{ [conversationId: string]: boolean }>({});

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [motoToPublish, setMotoToPublish] = useState<Omit<Motorcycle, 'id' | 'sellerEmail' | 'category' | 'status'> | null>(null);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [motoToPromoteId, setMotoToPromoteId] = useState<number | null>(null);


  useEffect(() => {
    // Check for saved user session first
    try {
      const storedUser = window.localStorage.getItem('motoMarketCurrentUser');
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        setCurrentUser(user);
        setView('home');
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      window.localStorage.removeItem('motoMarketCurrentUser');
    }
    
    // Load other app data from localStorage
    try {
      const storedFavorites = window.localStorage.getItem('motoMarketFavorites');
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

      const storedRatings = window.localStorage.getItem('motoMarketUserRatings');
      if (storedRatings) setUserRatings(JSON.parse(storedRatings));
      
      const storedHeatmapData = window.localStorage.getItem('motoMarketHeatmapData');
      if (storedHeatmapData) setHeatmapData(JSON.parse(storedHeatmapData));

      const storedSearches = window.localStorage.getItem('motoMarketSavedSearches');
      if (storedSearches) setSavedSearches(JSON.parse(storedSearches));

    } catch (error) {
      console.error("Failed to parse app data from localStorage", error);
    }
    
    // Check notification permission status
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);


  useEffect(() => {
    window.localStorage.setItem('motoMarketFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem('motoMarketUserRatings', JSON.stringify(userRatings));
  }, [userRatings]);

  useEffect(() => {
    window.localStorage.setItem('motoMarketSavedSearches', JSON.stringify(savedSearches));
  }, [savedSearches]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedMotorcycle, selectedConversationId]);
  
  // Simulate price drop notification for a favorite item
  useEffect(() => {
    if (!currentUser || favorites.length === 0 || Notification.permission !== 'granted') return;

    const timer = setTimeout(() => {
      const randomFavoriteId = favorites[Math.floor(Math.random() * favorites.length)];
      
      setMotorcycles(prevMotos => {
        const updatedMotos = prevMotos.map(m => {
          if (m.id === randomFavoriteId && m.status === 'for-sale') {
            const originalPrice = m.price;
            const newPrice = Math.round(originalPrice * 0.9); // 10% discount

            if (newPrice < originalPrice) {
              const formattedNewPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(newPrice);
              sendNotification(
                '¡Alerta de Precio!',
                {
                  body: `¡El precio de la ${m.make} ${m.model} ha bajado a ${formattedNewPrice}!`,
                  icon: m.imageUrls[0],
                  tag: `price-drop-${m.id}`
                }
              );
              return { ...m, price: newPrice };
            }
          }
          return m;
        });
        return updatedMotos;
      });
    }, 10000);

    return () => clearTimeout(timer);
  }, [favorites, currentUser]);

    // Simulate new motorcycle listings to trigger notifications for saved searches
    useEffect(() => {
        if (!currentUser || savedSearches.length === 0 || Notification.permission !== 'granted') return;

        const doesMotoMatchSearch = (moto: Motorcycle, search: SavedSearch): boolean => {
            if (search.searchTerm) {
                const lowercasedFilter = search.searchTerm.toLowerCase();
                if (!`${moto.make} ${moto.model} ${moto.year}`.toLowerCase().includes(lowercasedFilter)) return false;
            }
            if (search.locationFilter && !moto.location.toLowerCase().includes(search.locationFilter.toLowerCase())) return false;
            if (search.category !== 'All' && moto.category !== search.category) return false;
            const minPrice = parseFloat(search.priceRange.min);
            if (!isNaN(minPrice) && moto.price < minPrice) return false;
            const maxPrice = parseFloat(search.priceRange.max);
            if (!isNaN(maxPrice) && moto.price > maxPrice) return false;
            const minYear = parseInt(search.yearRange.min, 10);
            if (!isNaN(minYear) && moto.year < minYear) return false;
            const maxYear = parseInt(search.yearRange.max, 10);
            if (!isNaN(maxYear) && moto.year > maxYear) return false;
            if (search.engineSizeCategory !== 'any') {
                let match = false;
                switch (search.engineSizeCategory) {
                    case '125': match = moto.engineSize <= 125; break;
                    case '125-500': match = moto.engineSize > 125 && moto.engineSize <= 500; break;
                    case '501-1000': match = moto.engineSize > 500 && moto.engineSize <= 1000; break;
                    case '1000+': match = moto.engineSize > 1000; break;
                    default: match = true;
                }
                if (!match) return false;
            }
            return true;
        };

        const interval = setInterval(() => {
            // Create a new mock motorcycle that might match some criteria
            const newMoto: Motorcycle = {
                id: Date.now(),
                make: 'Triumph',
                model: 'Street Triple',
                year: 2023,
                price: 9500,
                mileage: 1500,
                engineSize: 765,
                location: 'Madrid, España',
                description: 'Casi nueva, una bestia ágil y potente. Perfecta para curvas.',
                imageUrls: ['https://images.unsplash.com/photo-1618364210243-5b2a441a6f6c?q=80&w=800&auto=format&fit=crop'],
                sellerEmail: 'new-seller@example.com',
                category: 'Sport',
                status: 'for-sale',
            };

            const matchingSearches = savedSearches.filter(search => doesMotoMatchSearch(newMoto, search));

            if (matchingSearches.length > 0) {
                setMotorcycles(prev => [newMoto, ...prev]);
                
                const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(newMoto.price);
                sendNotification(
                    '¡Nueva moto encontrada!',
                    {
                        body: `¡Hemos encontrado una ${newMoto.make} ${newMoto.model} por ${formattedPrice} que coincide con tu búsqueda!`,
                        icon: newMoto.imageUrls[0],
                        tag: `new-moto-${newMoto.id}`
                    }
                );
            }
        }, 20000); // Check every 20 seconds

        return () => clearInterval(interval);
    }, [savedSearches, currentUser, notificationPermission]);

  const handleNavigate = (newView: View) => {
    if (newView === 'chat') {
        setView('chatList');
    } else {
        setView(newView);
    }
  };

  const handleSelectMotorcycle = (moto: Motorcycle) => { setSelectedMotorcycle(moto); setView('detail'); };
  const handleBackToPrevView = () => {
    if (view === 'chatDetail') {
        setSelectedConversationId(null);
        setView('chatList');
    } else if (view === 'publicProfile' && selectedMotorcycle) {
        setView('detail');
    } else if (view === 'edit') {
        setMotorcycleToEdit(null);
        setView('profile');
    }
    else {
        setSelectedMotorcycle(null);
        setSelectedSellerEmail(null);
        setView('home');
    }
  };
  
  // FIX: Update function signature to only require email, which is what LoginView provides.
  const handleLoginSuccess = (user: { email: string }) => {
    const foundUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (foundUser) {
        setCurrentUser(foundUser);
        try {
            window.localStorage.setItem('motoMarketCurrentUser', JSON.stringify(foundUser));
        } catch (error) {
            console.error("Failed to save user data to localStorage", error);
        }
        setView('home');
    } else {
        alert("Usuario no encontrado. Por favor, regístrate.");
    }
  };
  
  const handleSignUpSuccess = (newUser: Omit<User, 'profileImageUrl' | 'totalRatingPoints' | 'numberOfRatings'>) => {
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        alert('Este email ya está registrado. Por favor, inicia sesión.');
        setView('login');
        return;
    }
    const userToSave: User = { name: newUser.name, email: newUser.email };
    setUsers(prev => [...prev, userToSave]);
    setCurrentUser(userToSave);
     try {
        window.localStorage.setItem('motoMarketCurrentUser', JSON.stringify(userToSave));
    } catch (error) {
        console.error("Failed to save user data to localStorage", error);
    }
    setView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
        window.localStorage.removeItem('motoMarketCurrentUser');
    } catch (error) {
        console.error("Failed to remove user data from localStorage", error);
    }
    setView('login');
  };

  const handlePublish = (newMotoData: Omit<Motorcycle, 'id' | 'sellerEmail' | 'category' | 'status'>) => {
    setMotoToPublish(newMotoData);
    setIsConfirmationModalOpen(true);
  };
  
  const handleConfirmPublish = () => {
    if (!currentUser || !motoToPublish) return;

    const newMoto: Motorcycle = {
      ...motoToPublish,
      id: Date.now(), // Using timestamp for a more unique ID
      imageUrls: motoToPublish.imageUrls.length > 0 ? motoToPublish.imageUrls : [`https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop`],
      sellerEmail: currentUser.email,
      category: 'Sport', // Default category for now
      status: 'for-sale',
      featured: false,
    };

    setMotorcycles(prev => [newMoto, ...prev]);
    alert("¡Tu moto ha sido publicada!");
    setView('profile');
    
    // Reset state
    setIsConfirmationModalOpen(false);
    setMotoToPublish(null);
  };
  
  const handleResetFilters = () => {
    setLocationFilter('');
    setPriceRange({ min: '', max: '' });
    setYearRange({ min: '', max: '' });
    setEngineSizeCategory('any');
  };
  
  const handleStartOrGoToChat = (motorcycle: Motorcycle) => {
    if (!currentUser || currentUser.email === motorcycle.sellerEmail) {
        alert("No puedes iniciar un chat contigo mismo.");
        return;
    };
    if (motorcycle.status === 'sold') {
        alert("Esta moto ya ha sido vendida.");
        return;
    }

    const existingConversation = conversations.find(c => 
        c.motorcycleId === motorcycle.id && c.participants.includes(currentUser.email)
    );

    if (existingConversation) {
        setSelectedConversationId(existingConversation.id);
        setView('chatDetail');
    } else {
        const newConversation: ChatConversation = {
            id: `convo${conversations.length + 1}`,
            participants: [currentUser.email, motorcycle.sellerEmail],
            motorcycleId: motorcycle.id,
        };
        setConversations(prev => [...prev, newConversation]);
        setSelectedConversationId(newConversation.id);
        setView('chatDetail');
    }
  };

  const handleSendMessage = (conversationId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: ChatMessage = {
        id: `msg${Math.random()}`,
        conversationId,
        senderEmail: currentUser.email,
        text,
        timestamp: Date.now(),
        isRead: true,
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate reply
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    const otherUserEmail = conversation.participants.find(p => p !== currentUser.email);
    if (!otherUserEmail) return;

    setIsTyping(prev => ({ ...prev, [conversationId]: true }));
    
    setTimeout(() => {
        const reply: ChatMessage = {
            id: `msg${Math.random()}`,
            conversationId,
            senderEmail: otherUserEmail,
            text: '¡Entendido! Lo reviso y te comento.',
            timestamp: Date.now(),
            isRead: false,
        };
        setIsTyping(prev => ({ ...prev, [conversationId]: false }));
        setMessages(prev => [...prev, reply]);

        // Send a notification if the user is not viewing this specific chat
        if (view !== 'chatDetail' || selectedConversationId !== conversationId) {
            const motorcycle = motorcycles.find(m => m.id === conversation.motorcycleId);
            const sender = users.find(u => u.email === otherUserEmail);
            sendNotification(
              `Nuevo mensaje de ${sender?.name || 'Vendedor'}`,
              {
                body: reply.text,
                icon: motorcycle?.imageUrls[0],
                tag: `new-message-${conversation.id}`
              }
            );
        }
    }, 1500);
  };
  
  const handleToggleFavorite = (motoId: number) => {
    setFavorites(prev => {
        if (prev.includes(motoId)) {
            return prev.filter(id => id !== motoId);
        } else {
            return [...prev, motoId];
        }
    });
  };

  const handleRequestNotificationPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
  };

  const handleUpdateProfileImage = (imageUrl: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, profileImageUrl: imageUrl };
      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.email === currentUser.email ? {...u, profileImageUrl: imageUrl} : u));
      window.localStorage.setItem('motoMarketCurrentUser', JSON.stringify(updatedUser));
    }
  };
  
  const handleViewPublicProfile = (sellerEmail: string) => {
      setSelectedSellerEmail(sellerEmail);
      setView('publicProfile');
  };

  const handleMarkAsSold = (motoId: number) => {
    if (window.confirm('¿Estás seguro de que quieres marcar esta moto como vendida?')) {
        setMotorcycles(prev => prev.map(moto => 
            moto.id === motoId ? { ...moto, status: 'sold' } : moto
        ));
    }
  };

  const handleNavigateToEdit = (moto: Motorcycle) => {
    setMotorcycleToEdit(moto);
    setView('edit');
  };

  const handleUpdateMotorcycle = (updatedMoto: Motorcycle) => {
    setMotorcycles(prev => prev.map(moto => 
      moto.id === updatedMoto.id ? updatedMoto : moto
    ));
    setMotorcycleToEdit(null);
    setView('profile');
    alert('¡Anuncio actualizado con éxito!');
  };

  const handlePromoteMotorcycle = (motoId: number) => {
    setMotoToPromoteId(motoId);
    setIsPromoteModalOpen(true);
  };

  const handleConfirmPromote = () => {
    if (motoToPromoteId === null) return;

    setMotorcycles(prev => prev.map(moto =>
      moto.id === motoToPromoteId ? { ...moto, featured: true } : moto
    ));
    alert('¡Anuncio promocionado con éxito!');
    
    // Reset state
    setIsPromoteModalOpen(false);
    setMotoToPromoteId(null);
  };

  const handleRateUser = (sellerEmail: string, rating: number) => {
    if (!currentUser || currentUser.email === sellerEmail || userRatings[sellerEmail]) {
        return;
    }

    setUsers(prevUsers => 
        prevUsers.map(user => {
            if (user.email === sellerEmail) {
                const newTotalRatingPoints = (user.totalRatingPoints || 0) + rating;
                const newNumberOfRatings = (user.numberOfRatings || 0) + 1;
                return { ...user, totalRatingPoints: newTotalRatingPoints, numberOfRatings: newNumberOfRatings };
            }
            return user;
        })
    );

    setUserRatings(prevRatings => ({
        ...prevRatings,
        [sellerEmail]: rating,
    }));
    
    alert(`Has valorado a ${sellerEmail} con ${rating} estrellas. ¡Gracias!`);
  };

  const handleAddHeatmapPoint = (e: React.MouseEvent) => {
    // Only add points if the heatmap is active, to avoid collecting unnecessary data.
    // Or collect always for analytics purposes. Let's collect always for this demo.
    const newPoint: HeatmapPoint = {
      x: e.pageX,
      y: e.pageY,
      value: 1, // Each click has a value of 1
    };
    const updatedData = [...heatmapData, newPoint];
    setHeatmapData(updatedData);
    window.localStorage.setItem('motoMarketHeatmapData', JSON.stringify(updatedData));
  };
  
  const handleToggleHeatmap = () => {
    setIsHeatmapVisible(prev => !prev);
  };

  const handleSaveSearch = () => {
      const searchCriteria: SavedSearch = {
          id: `search-${Date.now()}`,
          searchTerm,
          locationFilter,
          category: selectedCategory,
          priceRange,
          yearRange,
          engineSizeCategory,
      };
      // Check if an identical search already exists
      const alreadyExists = savedSearches.some(s => 
          s.searchTerm === searchCriteria.searchTerm &&
          s.locationFilter === searchCriteria.locationFilter &&
          s.category === searchCriteria.category &&
          s.priceRange.min === searchCriteria.priceRange.min &&
          s.priceRange.max === searchCriteria.priceRange.max &&
          s.yearRange.min === searchCriteria.yearRange.min &&
          s.yearRange.max === searchCriteria.yearRange.max &&
          s.engineSizeCategory === searchCriteria.engineSizeCategory
      );
      
      if (alreadyExists) {
          alert('Ya tienes una alerta guardada con estos criterios.');
          return;
      }

      setSavedSearches(prev => [...prev, searchCriteria]);
      alert('¡Alerta guardada! Te notificaremos cuando encontremos motos que coincidan.');
  };

  const handleDeleteSearch = (searchId: string) => {
      setSavedSearches(prev => prev.filter(s => s.id !== searchId));
  };

  const filteredMotorcycles = useMemo(() => {
    let filtered = motorcycles.filter(m => m.status === 'for-sale');
    const lowercasedFilter = searchTerm.toLowerCase();
    if (lowercasedFilter) {
      filtered = filtered.filter(m => `${m.make} ${m.model} ${m.year}`.toLowerCase().includes(lowercasedFilter));
    }
    if (locationFilter) {
      filtered = filtered.filter(m => m.location.toLowerCase().includes(locationFilter.toLowerCase()));
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
  }, [motorcycles, searchTerm, locationFilter, priceRange, yearRange, engineSizeCategory, selectedCategory]);
  
  const featuredMotorcycles = useMemo(() => {
    return motorcycles.filter(moto => moto.featured && moto.status === 'for-sale');
  }, [motorcycles]);

  const userMotorcycles = useMemo(() => {
    if (!currentUser) return [];
    return motorcycles.filter(moto => moto.sellerEmail === currentUser.email);
  }, [motorcycles, currentUser]);
  
  const favoriteMotorcycles = useMemo(() => {
    return motorcycles.filter(moto => favorites.includes(moto.id));
  }, [motorcycles, favorites]);
  
  const unreadMessagesCount = useMemo(() => {
    if (!currentUser) return 0;
    // Count unread messages sent to the current user
    return messages.filter(msg => {
        const conversation = conversations.find(c => c.id === msg.conversationId);
        return (
            !msg.isRead &&
            msg.senderEmail !== currentUser.email &&
            conversation?.participants.includes(currentUser.email)
        );
    }).length;
  }, [messages, currentUser, conversations]);

  const PlaceholderView = ({ title }: { title: string }) => (
    <div className="p-8 text-center h-full flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">{title}</h2>
        <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Esta funcionalidad no está implementada todavía.</p>
    </div>
  );

  if (!currentUser) {
    if (view === 'signup') {
      return <SignUpView onSignUpSuccess={handleSignUpSuccess} onNavigateToLogin={() => setView('login')} />;
    }
    return <LoginView onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={() => setView('signup')} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'detail': {
        const seller = users.find(u => u.email === selectedMotorcycle?.sellerEmail);
        if (!selectedMotorcycle || !seller) return <PlaceholderView title="Anuncio no encontrado" />;
        return <MotorcycleDetailView 
            motorcycle={selectedMotorcycle} 
            seller={seller}
            allMotorcycles={motorcycles}
            onBack={handleBackToPrevView} 
            onStartChat={handleStartOrGoToChat} 
            isFavorite={favorites.includes(selectedMotorcycle.id)}
            onToggleFavorite={handleToggleFavorite}
            onViewPublicProfile={handleViewPublicProfile}
            onSelectMotorcycle={handleSelectMotorcycle}
        />;
      }
      case 'sell':
        return <SellForm onBack={() => setView('home')} onPublish={handlePublish} />;
      case 'edit':
        return motorcycleToEdit && <EditForm
            motorcycle={motorcycleToEdit}
            onBack={handleBackToPrevView}
            onUpdate={handleUpdateMotorcycle}
        />;
      case 'profile':
        return <ProfileView 
            currentUser={currentUser} 
            userMotorcycles={userMotorcycles} 
            onGoToSell={() => setView('sell')} 
            onSelectMotorcycle={handleSelectMotorcycle} 
            onLogout={handleLogout} 
            notificationPermission={notificationPermission}
            onRequestPermission={handleRequestNotificationPermission}
            onUpdateProfileImage={handleUpdateProfileImage}
            onEditMotorcycle={handleNavigateToEdit}
            onMarkAsSold={handleMarkAsSold}
            onPromoteMotorcycle={handlePromoteMotorcycle}
            savedSearches={savedSearches}
            onDeleteSearch={handleDeleteSearch}
        />;
      case 'publicProfile': {
        const seller = users.find(u => u.email === selectedSellerEmail);
        const sellerMotorcycles = motorcycles.filter(m => m.sellerEmail === selectedSellerEmail);
        if (!seller) return <PlaceholderView title="Vendedor no encontrado" />;
        return <PublicProfileView 
            seller={seller}
            motorcycles={sellerMotorcycles}
            onBack={handleBackToPrevView}
            onSelectMotorcycle={handleSelectMotorcycle}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            currentUser={currentUser}
            userRating={userRatings[seller.email]}
            onRateUser={handleRateUser}
        />;
      }
      case 'favorites':
        return <FavoritesView 
            motorcycles={favoriteMotorcycles} 
            onSelectMotorcycle={handleSelectMotorcycle}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
        />;
      case 'chatList':
        return <ChatListView 
            conversations={conversations.filter(c => c.participants.includes(currentUser.email))}
            messages={messages}
            motorcycles={motorcycles}
            currentUser={currentUser}
            users={users}
            onSelectConversation={(convoId) => {
                setMessages(prev => prev.map(msg => 
                    (msg.conversationId === convoId && msg.senderEmail !== currentUser.email) 
                        ? { ...msg, isRead: true } 
                        : msg
                ));
                setSelectedConversationId(convoId);
                setView('chatDetail');
            }}
        />;
      case 'chatDetail': {
        const conversation = conversations.find(c => c.id === selectedConversationId);
        const motorcycle = motorcycles.find(m => m.id === conversation?.motorcycleId);
        if (!conversation || !motorcycle) {
            return <PlaceholderView title="Error de Chat" />;
        }
        return <ChatDetailView
            conversation={conversation}
            messages={messages.filter(m => m.conversationId === selectedConversationId).sort((a,b) => a.timestamp - b.timestamp)}
            motorcycle={motorcycle}
            currentUser={currentUser}
            users={users}
            onBack={handleBackToPrevView}
            onSendMessage={handleSendMessage}
            isTyping={isTyping[selectedConversationId] || false}
        />;
      }
      case 'home':
      default:
        const areFiltersActive = searchTerm !== '' || locationFilter !== '' || selectedCategory !== 'All' || priceRange.min !== '' || priceRange.max !== '' || yearRange.min !== '' || yearRange.max !== '' || engineSizeCategory !== 'any';
        return (
          <MotorcycleList 
            motorcycles={filteredMotorcycles} 
            featuredMotorcycles={featuredMotorcycles}
            onSelectMotorcycle={handleSelectMotorcycle}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddHeatmapPoint={handleAddHeatmapPoint}
            searchTerm={searchTerm}
            onSaveSearch={handleSaveSearch}
            areFiltersActive={areFiltersActive}
          />
        );
    }
  };
  
  const isHeaderVisible = view !== 'detail' && view !== 'chatDetail' && view !== 'publicProfile' && view !== 'edit';
  const isBottomNavVisible = view !== 'detail' && view !== 'chatDetail' && view !== 'publicProfile' && view !== 'edit';
  const mainContentPadding = isBottomNavVisible ? 'pb-24' : '';


  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark overflow-x-hidden">
      {isHeatmapVisible && <HeatmapOverlay data={heatmapData} />}
      {isHeaderVisible && (
        <Header 
          currentView={view}
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onOpenFilters={() => setIsFilterModalOpen(true)}
          isHeatmapVisible={isHeatmapVisible}
          onToggleHeatmap={handleToggleHeatmap}
        />
      )}
      <main className={`flex-1 ${mainContentPadding}`}>
        <div key={view} className="animate-view-transition">
          {renderContent()}
        </div>
      </main>
      {isBottomNavVisible && (
        // FIX: Simplify the currentView prop to avoid a TypeScript type inference error.
        // `startsWith` is a robust way to map 'chatList' and 'chatDetail' to the 'chat' nav item.
        <BottomNav 
            currentView={view.startsWith('chat') ? 'chat' : view} 
            onNavigate={handleNavigate}
            unreadMessagesCount={unreadMessagesCount}
        />
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
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        onResetFilters={handleResetFilters}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => {
          setIsConfirmationModalOpen(false);
          setMotoToPublish(null);
        }}
        onConfirm={handleConfirmPublish}
        title="Confirmar Publicación"
        message="¿Estás seguro de que quieres publicar este anuncio? Por favor, revisa que todos los detalles sean correctos."
        confirmText="Sí, Publicar"
        cancelText="Revisar"
      />
      <ConfirmationModal
        isOpen={isPromoteModalOpen}
        onClose={() => {
          setIsPromoteModalOpen(false);
          setMotoToPromoteId(null);
        }}
        onConfirm={handleConfirmPromote}
        title="Promocionar Anuncio"
        message="Promocionar este anuncio tiene un coste de $5.00. Esto lo mostrará en la sección 'Destacadas' en la página principal. ¿Deseas continuar?"
        confirmText="Sí, Promocionar ($5.00)"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default App;