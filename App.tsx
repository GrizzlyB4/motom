import React, { useState, useMemo, useEffect } from 'react';
import { Motorcycle, User, MotorcycleCategory, ChatConversation, ChatMessage, HeatmapPoint, SavedSearch, Part, PartCategory, PartCondition, Offer } from './types';
import Header from './components/Header';
import MotorcycleList from './components/MotorcycleList';
import PartList from './components/PartList';
import MotorcycleDetailView from './components/MotorcycleDetailView';
import PartDetailView from './components/PartDetailView';
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
import OfferModal from './components/OfferModal';
import OffersView from './components/OffersView';
import { supabase } from './services/supabase.ts';


const mockMotorcycles: Motorcycle[] = [
    { id: 1, make: 'Honda', model: 'CB650R', year: 2021, price: 7500, mileage: 8500, engineSize: 649, description: 'Como nueva...', imageUrls: ['https://images.unsplash.com/photo-1621115132957-81df81347053?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'seller1@example.com', category: 'Sport', status: 'for-sale', location: 'Madrid, España', featured: true, videoUrl: 'https://videos.pexels.com/video-files/5985396/5985396-sd_640_360_30fps.mp4', stats: { views: 1250, favorites: 45, chats: 8 } },
    { id: 2, make: 'Kawasaki', model: 'Z900', year: 2020, price: 8200, mileage: 12000, engineSize: 948, description: 'Vendo Kawasaki Z900...', imageUrls: ['https://images.unsplash.com/photo-1623563720235-3a0639f60324?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'user@motomarket.com', category: 'Sport', status: 'for-sale', location: 'Barcelona, España', featured: false },
    { id: 3, make: 'Yamaha', model: 'MT-07', year: 2022, price: 6800, mileage: 4500, engineSize: 689, description: 'Yamaha MT-07 del 2022...', imageUrls: ['https://images.unsplash.com/photo-1640890656113-3a137250abfa?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'seller2@example.com', category: 'Sport', status: 'for-sale', location: 'Valencia, España', featured: false },
    { id: 4, make: 'BMW', model: 'R1250GS', year: 2021, price: 21500, mileage: 15000, engineSize: 1254, description: 'Impresionante R1250GS Adventure, full equip con maletas originales. Perfecta para viajar sin límites. Todas las revisiones en casa oficial.', imageUrls: ['https://images.unsplash.com/photo-1623563720275-2c86b2253245?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'user@motomarket.com', category: 'Touring', status: 'reserved', reservedBy: 'seller2@example.com', location: 'Sevilla, España', featured: true, stats: { views: 3102, favorites: 112, chats: 15 } },
    { id: 5, make: 'Ducati', model: 'Panigale V2', year: 2020, price: 16000, mileage: 9800, engineSize: 955, description: 'Ducati Panigale V2 en perfecto estado. Electrónica de primer nivel y un diseño que enamora. Solo para amantes de las emociones fuertes.', imageUrls: ['https://images.unsplash.com/photo-1600761343111-a0a623e1d6d8?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'seller3@example.com', category: 'Sport', status: 'for-sale', location: 'Madrid, España', featured: true, stats: { views: 2488, favorites: 98, chats: 11 } },
    { id: 8, make: 'Harley-Davidson', model: 'Iron 883', year: 2018, price: 9200, mileage: 18000, engineSize: 883, description: 'Icónica Iron 883, estilo bobber inconfundible. Sonido espectacular con escapes Vance & Hines. Muchos extras.', imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'seller6@example.com', category: 'Cruiser', status: 'for-sale', location: 'Málaga, España', featured: false },
    { id: 9, make: 'KTM', model: '390 Adventure', year: 2022, price: 6500, mileage: 5000, engineSize: 373, description: 'Perfecta trail ligera para A2. Muy cuidada, con defensas y soporte para maleta. Ideal para iniciarse en el mundo trail.', imageUrls: ['https://images.unsplash.com/photo-1627916699311-3a088371295b?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'user@motomarket.com', category: 'Off-Road', status: 'sold', location: 'Zaragoza, España', featured: false }
];

const mockParts: Part[] = [
    { id: 101, name: 'Escape Akrapovič Racing Line', price: 850, description: 'Sistema de escape completo de titanio para Yamaha MT-07. Aumenta la potencia y reduce el peso. Sonido espectacular. Usado pero en perfecto estado.', imageUrls: ['https://images.unsplash.com/photo-1617056036422-4458698946a3?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'seller2@example.com', category: 'Exhausts', condition: 'used', compatibility: ['Yamaha MT-07 2021-2023'], status: 'for-sale', location: 'Valencia, España', featured: true, stats: { views: 980, favorites: 22, chats: 5 } },
    { id: 102, name: 'Juego de Neumáticos Pirelli Diablo Rosso IV', price: 280, description: 'Neumáticos deportivos para carretera. Medidas 120/70-17 y 180/55-17. Completamente nuevos, sin estrenar. Vendo por cambio de moto.', imageUrls: ['https://images.unsplash.com/photo-1589256956321-9950397851a7?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'user@motomarket.com', category: 'Tires', condition: 'new', compatibility: ['Universal - Verificar medidas'], status: 'for-sale', location: 'Barcelona, España' },
    { id: 103, name: 'Frenos Brembo Stylema', price: 600, description: 'Pinzas de freno delanteras Brembo Stylema. Alto rendimiento de frenada. Proceden de una Ducati Panigale V2. Incluye pastillas al 80%.', imageUrls: ['https://images.unsplash.com/photo-1598111034225-16782d33463b?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'seller3@example.com', category: 'Brakes', condition: 'used', compatibility: ['Ducati Panigale V2', 'Aprilia RSV4'], status: 'for-sale', location: 'Madrid, España' },
];

const mockConversations: ChatConversation[] = [
    { id: 'convo1', participants: ['user@motomarket.com', 'seller1@example.com'], motorcycleId: 1 },
    { id: 'convo2', participants: ['user@motomarket.com', 'seller2@example.com'], partId: 101 },
];

const mockMessages: ChatMessage[] = [
    { id: 'msg1', conversationId: 'convo1', senderEmail: 'user@motomarket.com', text: 'Hola, ¿sigue disponible la Honda CB650R?', timestamp: Date.now() - 1000 * 60 * 5, isRead: true },
    { id: 'msg2', conversationId: 'convo1', senderEmail: 'seller1@example.com', text: '¡Hola! Sí, todavía está a la venta.', timestamp: Date.now() - 1000 * 60 * 4, isRead: false },
    { id: 'msg3', conversationId: 'convo2', senderEmail: 'user@motomarket.com', text: 'Hola, ¿sigue disponible el escape Akrapovič?', timestamp: Date.now() - 1000 * 60 * 10, isRead: true },
    { id: 'msg4', conversationId: 'convo2', senderEmail: 'seller2@example.com', text: 'Sí, claro. Está en perfecto estado.', timestamp: Date.now() - 1000 * 60 * 9, isRead: false },
];

const mockUsers: User[] = [
    { name: 'Carlos Rossi', email: 'user@motomarket.com', profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop', totalRatingPoints: 45, numberOfRatings: 10 }, // 4.5 stars
    { name: 'Juan Pérez', email: 'seller1@example.com', profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', totalRatingPoints: 18, numberOfRatings: 4 }, // 4.5 stars
    { name: 'Ana Gómez', email: 'seller2@example.com', profileImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', totalRatingPoints: 88, numberOfRatings: 20 }, // 4.4 stars
    { name: 'Sofía Loren', email: 'seller3@example.com', profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop' }, // No ratings
    { name: 'Marco Antonio', email: 'seller6@example.com', profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', totalRatingPoints: 5, numberOfRatings: 1 }, // 5 stars
];

const mockOffers: Offer[] = [
    { id: 'offer1', itemId: 1, itemType: 'motorcycle', buyerEmail: 'user@motomarket.com', sellerEmail: 'seller1@example.com', offerAmount: 7200, status: 'pending', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
    { id: 'offer2', itemId: 2, itemType: 'motorcycle', buyerEmail: 'seller3@example.com', sellerEmail: 'user@motomarket.com', offerAmount: 8000, status: 'pending', timestamp: Date.now() - 1000 * 60 * 60 * 5 },
    { id: 'offer3', itemId: 101, itemType: 'part', buyerEmail: 'seller1@example.com', sellerEmail: 'seller2@example.com', offerAmount: 800, status: 'rejected', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
    { id: 'offer4', itemId: 4, itemType: 'motorcycle', buyerEmail: 'seller2@example.com', sellerEmail: 'user@motomarket.com', offerAmount: 21000, status: 'accepted', timestamp: Date.now() - 1000 * 60 * 60 * 48 },
];


export type View = 'home' | 'detail' | 'partDetail' | 'sell' | 'profile' | 'favorites' | 'chat' | 'chatList' | 'chatDetail' | 'login' | 'publicProfile' | 'edit' | 'signup' | 'offers';

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

// --- Heatmap Data Function ---
const getHeatmapData = async (): Promise<HeatmapPoint[]> => {
  // This is a placeholder function - replace with actual implementation
  return [];
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [motorcycleToEdit, setMotorcycleToEdit] = useState<Motorcycle | null>(null);
  const [partToEdit, setPartToEdit] = useState<Part | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(mockMotorcycles);
  const [parts, setParts] = useState<Part[]>(mockParts);
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
  const [selectedPartCategory, setSelectedPartCategory] = useState<PartCategory>('All');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteParts, setFavoriteParts] = useState<number[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [userRatings, setUserRatings] = useState<{ [sellerEmail: string]: number }>({});
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
  const [isTyping, setIsTyping] = useState<{ [conversationId: string]: boolean }>({});

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [motoToPublish, setMotoToPublish] = useState<Omit<Motorcycle, 'id' | 'sellerEmail' | 'category' | 'status'> | null>(null);
  const [partToPublish, setPartToPublish] = useState<Omit<Part, 'id' | 'sellerEmail' | 'status' | 'category'> | null>(null);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [itemToPromote, setItemToPromote] = useState<{id: number, type: 'motorcycle' | 'part'} | null>(null);
  const [marketView, setMarketView] = useState<'motorcycles' | 'parts'>('motorcycles');
  
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [itemToMakeOfferOn, setItemToMakeOfferOn] = useState<Motorcycle | Part | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Hide splash screen
    const splashScreen = document.getElementById('splash-screen');
    const splashMoto = document.querySelector('.splash-moto');
    const splashTitle = document.querySelector('.splash-title');

    if (splashScreen && splashMoto && splashTitle) {
      setTimeout(() => {
        splashMoto.classList.add('exit');
        splashTitle.classList.add('exit');
        splashScreen.classList.add('hidden');
        splashScreen.addEventListener('transitionend', () => {
          splashScreen.remove();
        });
      }, 5000);
    }

    // Check notification permission status
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Set a timeout to ensure splash screen is hidden even if something goes wrong
    const splashTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Splash screen timeout reached, forcing hide');
        setIsLoading(false);
      }
    }, 5000); // 5 seconds timeout

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
            const user: User = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                profileImageUrl: profile.profile_image_url,
                totalRatingPoints: profile.total_rating_points,
                numberOfRatings: profile.number_of_ratings
            };
            setCurrentUser(user);
            setView('home');
        } else {
             setCurrentUser({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata.name || 'Nuevo Usuario',
             });
             setView('home');
        }
        // Ensure loading is set to false when user is authenticated
        setIsLoading(false);
      } else {
        // Only set to login view if we're not already trying to log in
        // This prevents overriding the login form when a user is actively trying to log in
        if (view !== 'login' || !isLoading) {
          setCurrentUser(null);
          setView('login');
        }
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(splashTimeout);
    };
  }, [view, isLoading]);


  useEffect(() => {
    // Only fetch data if we have a current user and we're not in the middle of a login attempt
    if (currentUser && view === 'home') {
        const fetchAllData = async () => {
            setIsLoading(true);

            // Set a timeout to ensure we don't get stuck loading forever
            const timeoutId = setTimeout(() => {
                console.warn('Data fetching timeout reached, continuing with app load');
                setIsLoading(false);
            }, 10000); // 10 seconds timeout

            try {
                // Fetch all data in parallel
                const [
                    motorcyclesRes,
                    partsRes,
                    usersRes,
                    offersRes,
                    conversationsRes,
                    messagesRes,
                    favoritesRes,
                    partFavoritesRes,
                    savedSearchesRes,
                    ratingsRes,
                    heatmapRes
                ] = await Promise.all([
                    supabase.from('motorcycles').select('*'),
                    supabase.from('parts').select('*'),
                    supabase.from('profiles').select('*'),
                    supabase.from('offers').select('*'),
                    supabase.from('conversations').select('*'),
                    supabase.from('messages').select('*'),
                    supabase.from('motorcycle_favorites').select('motorcycle_id').eq('user_id', currentUser.id),
                    supabase.from('part_favorites').select('part_id').eq('user_id', currentUser.id),
                    supabase.from('saved_searches').select('*').eq('user_id', currentUser.id),
                    supabase.from('user_ratings').select('*').eq('rater_id', currentUser.id),
                    getHeatmapData()
                ]);
                
                // Clear the timeout since we've finished fetching
                clearTimeout(timeoutId);
                
                // Set state after all promises are resolved
                // Map database response to camelCase for the frontend
                setMotorcycles(motorcyclesRes.data?.map((moto: any) => ({
                    id: moto.id,
                    make: moto.make,
                    model: moto.model,
                    year: moto.year,
                    price: moto.price,
                    mileage: moto.mileage,
                    engineSize: moto.engine_size,
                    description: moto.description,
                    imageUrls: moto.image_urls,
                    videoUrl: moto.video_url,
                    sellerEmail: moto.seller_email,
                    category: moto.category,
                    status: moto.status,
                    location: moto.location,
                    featured: moto.featured,
                    reservedBy: moto.reserved_by,
                    stats: moto.stats,
                })) || []);
                
                setParts(partsRes.data?.map((part: any) => ({
                    id: part.id,
                    name: part.name,
                    price: part.price,
                    description: part.description,
                    imageUrls: part.image_urls,
                    videoUrl: part.video_url,
                    sellerEmail: part.seller_email,
                    category: part.category,
                    condition: part.condition,
                    compatibility: part.compatibility,
                    status: part.status,
                    location: part.location,
                    featured: part.featured,
                    reservedBy: part.reserved_by,
                    stats: part.stats,
                })) || []);
                
                setUsers(usersRes.data?.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    email: p.email,
                    profileImageUrl: p.profile_image_url,
                    totalRatingPoints: p.total_rating_points,
                    numberOfRatings: p.number_of_ratings
                })) || []);
                
                setOffers(offersRes.data || []);
                setConversations(conversationsRes.data || []);
                setMessages(messagesRes.data || []);
                setFavorites(favoritesRes.data?.map(f => f.motorcycle_id) || []);
                setFavoriteParts(partFavoritesRes.data?.map(f => f.part_id) || []);
                setSavedSearches(savedSearchesRes.data || []);
                setUserRatings(ratingsRes.data?.reduce((acc, rating) => ({ ...acc, [rating.rated_user_email]: rating.rating }), {}) || {});
                setHeatmapData(heatmapRes || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Clear the timeout on error
                clearTimeout(timeoutId);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    } else {
        // If there's no current user, ensure loading is set to false
        setIsLoading(false);
    }
  }, [currentUser, view]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedMotorcycle, selectedPart, selectedConversationId]);
  
  // Simulate price drop notification for a favorite item
  useEffect(() => {
    if (!currentUser || (favorites.length === 0 && favoriteParts.length === 0) || Notification.permission !== 'granted') return;
  
    const timer = setTimeout(() => {
      const allFavoriteIds = [...favorites.map(id => ({id, type: 'motorcycle'})), ...favoriteParts.map(id => ({id, type: 'part'}))];
      if (allFavoriteIds.length === 0) return;

      const randomFavorite = allFavoriteIds[Math.floor(Math.random() * allFavoriteIds.length)];
      
      if (randomFavorite.type === 'motorcycle') {
        setMotorcycles(prevMotos => prevMotos.map(m => {
          if (m.id === randomFavorite.id && m.status === 'for-sale') {
            const newPrice = Math.round(m.price * 0.9);
            const formattedNewPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(newPrice);
            sendNotification('¡Alerta de Precio!', { body: `¡El precio de la ${m.make} ${m.model} ha bajado a ${formattedNewPrice}!`, icon: m.imageUrls[0] });
            return { ...m, price: newPrice };
          }
          return m;
        }));
      } else {
        setParts(prevParts => prevParts.map(p => {
            if (p.id === randomFavorite.id && p.status === 'for-sale') {
                const newPrice = Math.round(p.price * 0.9);
                const formattedNewPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(newPrice);
                sendNotification('¡Alerta de Precio!', { body: `¡El precio de ${p.name} ha bajado a ${formattedNewPrice}!`, icon: p.imageUrls[0] });
                return { ...p, price: newPrice };
            }
            return p;
        }));
      }
    }, 15000);
  
    return () => clearTimeout(timer);
  }, [favorites, favoriteParts, currentUser, notificationPermission]);

  // Simulate new listings to trigger notifications for saved searches
  useEffect(() => {
      if (!currentUser || savedSearches.length === 0 || Notification.permission !== 'granted') return;

      const doesMotoMatchSearch = (moto: Motorcycle, search: SavedSearch): boolean => {
          if (search.searchType !== 'motorcycle') return false;
          if (search.searchTerm && !`${moto.make} ${moto.model} ${moto.year}`.toLowerCase().includes(search.searchTerm.toLowerCase())) return false;
          if (search.locationFilter && !moto.location.toLowerCase().includes(search.locationFilter.toLowerCase())) return false;
          if (search.motorcycleCategory !== 'All' && moto.category !== search.motorcycleCategory) return false;
          // Simplified checks for brevity
          return true;
      };

      const doesPartMatchSearch = (part: Part, search: SavedSearch): boolean => {
          if (search.searchType !== 'part') return false;
          if (search.searchTerm && !`${part.name} ${part.description}`.toLowerCase().includes(search.searchTerm.toLowerCase())) return false;
          if (search.locationFilter && !part.location.toLowerCase().includes(search.locationFilter.toLowerCase())) return false;
          if (search.partCategory !== 'All' && part.category !== search.partCategory) return false;
          return true;
      };

      const interval = setInterval(() => {
          // Simulate new motorcycle
          const newMoto: Motorcycle = { id: Date.now(), make: 'Triumph', model: 'Street Triple', year: 2023, price: 9500, mileage: 1500, engineSize: 765, location: 'Madrid, España', description: 'Casi nueva, una bestia ágil y potente.', imageUrls: ['https://images.unsplash.com/photo-1618364210243-5b2a441a6f6c?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'new-seller@example.com', category: 'Sport', status: 'for-sale' };
          const matchingMotoSearches = savedSearches.filter(search => doesMotoMatchSearch(newMoto, search));
          if (matchingMotoSearches.length > 0) {
              setMotorcycles(prev => [newMoto, ...prev]);
              sendNotification('¡Nueva moto encontrada!', { body: `¡Hemos encontrado una ${newMoto.make} ${newMoto.model} que coincide con tu búsqueda!`, icon: newMoto.imageUrls[0] });
          }

          // Simulate new part
          const newPart: Part = { id: Date.now() + 1, name: 'Amortiguador Öhlins TTX', price: 1200, description: 'Amortiguador trasero de alto rendimiento.', imageUrls: ['https://images.unsplash.com/photo-1607503389242-77e8845a7abc?q=80&w=800&auto=format&fit=crop'], sellerEmail: 'new-seller2@example.com', category: 'Suspension', condition: 'new', compatibility: ['Universal'], status: 'for-sale', location: 'Barcelona, España' };
          const matchingPartSearches = savedSearches.filter(search => doesPartMatchSearch(newPart, search));
          if (matchingPartSearches.length > 0) {
              setParts(prev => [newPart, ...prev]);
              sendNotification('¡Nueva pieza encontrada!', { body: `¡Hemos encontrado un ${newPart.name} que coincide con tu búsqueda!`, icon: newPart.imageUrls[0] });
          }
      }, 25000);

      return () => clearInterval(interval);
  }, [savedSearches, currentUser, notificationPermission]);

  const handleNavigate = (newView: View) => {
    if (newView === 'chat') {
        setView('chatList');
    } else {
        setView(newView);
    }
  };

  const handleSelectMotorcycle = (moto: Motorcycle) => { 
    setMotorcycles(prev => prev.map(m => {
        if (m.id === moto.id && m.featured && m.stats) {
            return { ...m, stats: { ...m.stats, views: m.stats.views + 1 } };
        }
        return m;
    }));
    setSelectedMotorcycle(moto); 
    setView('detail'); 
  };

  const handleSelectPart = (part: Part) => { 
    setParts(prev => prev.map(p => {
        if (p.id === part.id && p.featured && p.stats) {
            return { ...p, stats: { ...p.stats, views: p.stats.views + 1 } };
        }
        return p;
    }));
    setSelectedPart(part); 
    setView('partDetail'); 
  };

  const handleBackToPrevView = () => {
    if (view === 'chatDetail') {
        setSelectedConversationId(null);
        setView('chatList');
    } else if ((view === 'publicProfile' || view === 'partDetail') && selectedMotorcycle) {
        setView('detail');
    } else if (view === 'edit') {
        setMotorcycleToEdit(null);
        setPartToEdit(null);
        setView('profile');
    }
    else {
        setSelectedMotorcycle(null);
        setSelectedPart(null);
        setSelectedSellerEmail(null);
        setView('home');
    }
  };
  
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

  const handlePublish = (data: Omit<Motorcycle, 'id' | 'sellerEmail' | 'category' | 'status'> | Omit<Part, 'id' | 'sellerEmail' | 'status' | 'category'>, type: 'motorcycle' | 'part') => {
    if (type === 'motorcycle') {
        setMotoToPublish(data as Omit<Motorcycle, 'id' | 'sellerEmail' | 'category' | 'status'>);
    } else {
        setPartToPublish(data as Omit<Part, 'id' | 'sellerEmail' | 'status' | 'category'>);
    }
    setIsConfirmationModalOpen(true);
  };
  
  const handleConfirmPublish = () => {
    if (!currentUser) return;
    
    if (motoToPublish) {
        const newMoto: Motorcycle = {
          ...motoToPublish,
          id: Date.now(),
          imageUrls: motoToPublish.imageUrls.length > 0 ? motoToPublish.imageUrls : [`https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop`],
          sellerEmail: currentUser.email,
          category: 'Sport', // Simplified for demo
          status: 'for-sale',
          featured: false,
        };
        setMotorcycles(prev => [newMoto, ...prev]);
        alert("¡Tu moto ha sido publicada!");
    } else if (partToPublish) {
        const newPart: Part = {
          ...partToPublish,
          id: Date.now(),
          imageUrls: partToPublish.imageUrls.length > 0 ? partToPublish.imageUrls : ['https://images.unsplash.com/photo-1559795632-520a8e7a016f?q=80&w=800&auto=format&fit=crop'],
          sellerEmail: currentUser.email,
          category: 'Exhausts', // Simplified for demo
          status: 'for-sale',
        };
        setParts(prev => [newPart, ...prev]);
        alert("¡Tu pieza ha sido publicada!");
    }

    setView('profile');
    setIsConfirmationModalOpen(false);
    setMotoToPublish(null);
    setPartToPublish(null);
  };
  
  const handleResetFilters = () => {
    setLocationFilter('');
    setPriceRange({ min: '', max: '' });
    setYearRange({ min: '', max: '' });
    setEngineSizeCategory('any');
  };
  
  const handleStartOrGoToChat = (item: Motorcycle | Part) => {
    if (!currentUser || currentUser.email === item.sellerEmail) {
        alert("No puedes iniciar un chat contigo mismo.");
        return;
    };
    if (item.status === 'sold') {
        alert("Este artículo ya ha sido vendido.");
        return;
    }

    const isMotorcycle = 'make' in item;

    const existingConversation = conversations.find(c => {
        if (isMotorcycle) {
            return c.motorcycleId === item.id && c.participants.includes(currentUser.email);
        } else {
            return c.partId === item.id && c.participants.includes(currentUser.email);
        }
    });

    if (existingConversation) {
        setSelectedConversationId(existingConversation.id);
        setView('chatDetail');
    } else {
        // This is a new chat, so update stats if the item is featured.
        if (item.featured && item.stats) {
            if (isMotorcycle) {
                setMotorcycles(prev => prev.map(m => m.id === item.id ? { ...m, stats: { ...m.stats!, chats: m.stats!.chats + 1 } } : m));
            } else {
                setParts(prev => prev.map(p => p.id === item.id ? { ...p, stats: { ...p.stats!, chats: p.stats!.chats + 1 } } : p));
            }
        }

        const newConversation: ChatConversation = {
            id: `convo${conversations.length + 1}`,
            participants: [currentUser.email, item.sellerEmail],
        };
        if (isMotorcycle) {
            newConversation.motorcycleId = item.id;
        } else {
            newConversation.partId = item.id;
        }
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

        if (view !== 'chatDetail' || selectedConversationId !== conversationId) {
            const item = conversation.motorcycleId
              ? motorcycles.find(m => m.id === conversation.motorcycleId)
              : parts.find(p => p.id === conversation.partId);
            const sender = users.find(u => u.email === otherUserEmail);
            sendNotification(
              `Nuevo mensaje de ${sender?.name || 'Vendedor'}`,
              {
                body: reply.text,
                icon: item?.imageUrls[0],
                tag: `new-message-${conversation.id}`
              }
            );
        }
    }, 1500);
  };
  
  const handleToggleFavorite = (motoId: number) => {
    const isAdding = !favorites.includes(motoId);
    setFavorites(prev => isAdding ? [...prev, motoId] : prev.filter(id => id !== motoId));

    setMotorcycles(prev => prev.map(m => {
        if (m.id === motoId && m.featured && m.stats) {
            return { ...m, stats: { ...m.stats, favorites: m.stats.favorites + (isAdding ? 1 : -1) } };
        }
        return m;
    }));
  };
  
  const handleTogglePartFavorite = (partId: number) => {
    const isAdding = !favoriteParts.includes(partId);
    setFavoriteParts(prev => isAdding ? [...prev, partId] : prev.filter(id => id !== partId));
    
    setParts(prev => prev.map(p => {
        if (p.id === partId && p.featured && p.stats) {
            return { ...p, stats: { ...p.stats, favorites: p.stats.favorites + (isAdding ? 1 : -1) } };
        }
        return p;
    }));
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

  const handleMarkAsSold = (itemId: number, type: 'motorcycle' | 'part') => {
    const message = type === 'motorcycle' 
        ? '¿Estás seguro de que quieres marcar esta moto como vendida?' 
        : '¿Estás seguro de que quieres marcar esta pieza como vendida?';

    if (window.confirm(message)) {
        if (type === 'motorcycle') {
            setMotorcycles(prev => prev.map(item => item.id === itemId ? { ...item, status: 'sold' } : item));
        } else {
            setParts(prev => prev.map(item => item.id === itemId ? { ...item, status: 'sold' } : item));
        }
    }
  };

  const handleNavigateToEdit = (item: Motorcycle | Part) => {
    if ('make' in item) {
      setMotorcycleToEdit(item);
      setPartToEdit(null);
    } else {
      setPartToEdit(item);
      setMotorcycleToEdit(null);
    }
    setView('edit');
  };

  const handleUpdateItem = (updatedItem: Motorcycle | Part) => {
    if ('make' in updatedItem) {
      setMotorcycles(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    } else {
      setParts(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    }
    setMotorcycleToEdit(null);
    setPartToEdit(null);
    setView('profile');
    alert('¡Anuncio actualizado con éxito!');
  };

  const handlePromoteItem = (itemId: number, type: 'motorcycle' | 'part') => {
    setItemToPromote({ id: itemId, type });
    setIsPromoteModalOpen(true);
  };

  const handleConfirmPromote = () => {
    if (!itemToPromote) return;

    if (itemToPromote.type === 'motorcycle') {
        setMotorcycles(prev => prev.map(moto =>
          moto.id === itemToPromote.id ? { ...moto, featured: true, stats: moto.stats || { views: 0, favorites: 0, chats: 0 } } : moto
        ));
    } else {
        setParts(prev => prev.map(part =>
          part.id === itemToPromote.id ? { ...part, featured: true, stats: part.stats || { views: 0, favorites: 0, chats: 0 } } : part
        ));
    }
    alert('¡Anuncio promocionado con éxito!');
    
    setIsPromoteModalOpen(false);
    setItemToPromote(null);
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

    setUserRatings(prevRatings => ({ ...prevRatings, [sellerEmail]: rating }));
    alert(`Has valorado a ${sellerEmail} con ${rating} estrellas. ¡Gracias!`);
  };

  const handleAddHeatmapPoint = (e: React.MouseEvent) => {
    const newPoint: HeatmapPoint = { x: e.pageX, y: e.pageY, value: 1 };
    const updatedData = [...heatmapData, newPoint];
    setHeatmapData(updatedData);
    window.localStorage.setItem('motoMarketHeatmapData', JSON.stringify(updatedData));
  };
  
  const handleToggleHeatmap = () => setIsHeatmapVisible(prev => !prev);

  const handleSaveSearch = (type: 'motorcycle' | 'part') => {
      const baseCriteria = {
          id: `search-${Date.now()}`,
          searchType: type,
          searchTerm,
          locationFilter,
          priceRange,
      };

      let searchCriteria: SavedSearch;
      if (type === 'motorcycle') {
          searchCriteria = { ...baseCriteria, motorcycleCategory: selectedCategory, yearRange, engineSizeCategory };
      } else {
          searchCriteria = { ...baseCriteria, partCategory: selectedPartCategory };
      }
      
      const alreadyExists = savedSearches.some(s => JSON.stringify(s) === JSON.stringify(searchCriteria));
      if (alreadyExists) {
          alert('Ya tienes una alerta guardada con estos criterios.');
          return;
      }

      setSavedSearches(prev => [...prev, searchCriteria]);
      alert('¡Alerta guardada! Te notificaremos cuando encontremos nuevos artículos que coincidan.');
  };

  const handleDeleteSearch = (searchId: string) => {
      setSavedSearches(prev => prev.filter(s => s.id !== searchId));
  };

  const handleOpenOfferModal = (item: Motorcycle | Part) => {
    setItemToMakeOfferOn(item);
    setIsOfferModalOpen(true);
  };

  const handleMakeOffer = (amount: number) => {
    if (!currentUser || !itemToMakeOfferOn) return;
    const newOffer: Offer = {
        id: `offer-${Date.now()}`,
        itemId: itemToMakeOfferOn.id,
        itemType: 'make' in itemToMakeOfferOn ? 'motorcycle' : 'part',
        buyerEmail: currentUser.email,
        sellerEmail: itemToMakeOfferOn.sellerEmail,
        offerAmount: amount,
        status: 'pending',
        timestamp: Date.now(),
    };
    setOffers(prev => [newOffer, ...prev]);
    setIsOfferModalOpen(false);
    setItemToMakeOfferOn(null);
    alert('¡Oferta enviada con éxito!');
    setView('offers');
  };

  const handleAcceptOffer = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer || !currentUser) return;

    const item = offer.itemType === 'motorcycle' 
        ? motorcycles.find(m => m.id === offer.itemId) 
        : parts.find(p => p.id === offer.itemId);
        
    if (!item) return;

    // 1. Update item status to 'reserved'
    if (offer.itemType === 'motorcycle') {
        setMotorcycles(prev => prev.map(m => m.id === offer.itemId ? { ...m, status: 'reserved', reservedBy: offer.buyerEmail } : m));
    } else {
        setParts(prev => prev.map(p => p.id === offer.itemId ? { ...p, status: 'reserved', reservedBy: offer.buyerEmail } : p));
    }

    // 2. Update all related offers
    const finalOffers = offers.map(o => {
        if (o.id === offerId) return { ...o, status: 'accepted' as const };
        if (o.itemId === offer.itemId && o.status === 'pending') return { ...o, status: 'rejected' as const };
        return o;
    });
    setOffers(finalOffers);

    // 3. Find or create a conversation and send an automatic message
    let conversation = conversations.find(c => 
        (c.motorcycleId === offer.itemId || c.partId === offer.itemId) && 
        c.participants.includes(offer.buyerEmail) && 
        c.participants.includes(offer.sellerEmail)
    );

    let conversationId: string;

    if (conversation) {
        conversationId = conversation.id;
    } else {
        const newConversation: ChatConversation = {
            id: `convo${Date.now()}`,
            participants: [offer.buyerEmail, offer.sellerEmail],
            ...(offer.itemType === 'motorcycle' ? { motorcycleId: offer.itemId } : { partId: offer.itemId })
        };
        setConversations(prev => [...prev, newConversation]);
        conversationId = newConversation.id;
    }
    
    const itemName = 'make' in item ? `${item.make} ${item.model}` : item.name;
    const messageText = `¡Buenas noticias! He aceptado tu oferta por ${itemName}. Por favor, ponte en contacto conmigo para coordinar la entrega y el pago.`;
    
    const newMessage: ChatMessage = {
        id: `msg${Date.now()}`,
        conversationId: conversationId,
        senderEmail: currentUser.email, // The seller is the sender
        text: messageText,
        timestamp: Date.now(),
        isRead: false, // Important for the buyer to get a notification
    };

    setMessages(prev => [...prev, newMessage]);
    
    // 4. Show confirmation to the seller
    alert('¡Oferta aceptada! Se ha reservado el artículo y se ha enviado un mensaje al comprador.');
  };

  const handleRejectOffer = (offerId: string) => {
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'rejected' } : o));
    alert('Oferta rechazada.');
  };

  const handleCancelSale = (itemId: number, itemType: 'motorcycle' | 'part') => {
    if (!window.confirm("¿Estás seguro? Esto cancelará el acuerdo con el comprador actual y volverá a poner tu artículo en venta.")) {
        return;
    }
    
    if (itemType === 'motorcycle') {
        setMotorcycles(prev => prev.map(m => m.id === itemId ? { ...m, status: 'for-sale', reservedBy: undefined } : m));
    } else {
        setParts(prev => prev.map(p => p.id === itemId ? { ...p, status: 'for-sale', reservedBy: undefined } : p));
    }

    setOffers(prev => prev.map(o => {
        if (o.itemId === itemId && o.itemType === itemType && o.status === 'accepted') {
            return { ...o, status: 'cancelled' };
        }
        return o;
    }));

    alert("El artículo ha sido publicado de nuevo.");
  };

  const filteredMotorcycles = useMemo(() => {
    let filtered = motorcycles.filter(m => m.status === 'for-sale' || m.status === 'reserved');
    const lowercasedFilter = searchTerm.toLowerCase();
    if (lowercasedFilter) filtered = filtered.filter(m => `${m.make} ${m.model} ${m.year}`.toLowerCase().includes(lowercasedFilter));
    if (locationFilter) filtered = filtered.filter(m => m.location.toLowerCase().includes(locationFilter.toLowerCase()));
    if (selectedCategory !== 'All') filtered = filtered.filter(m => m.category === selectedCategory);
    const minPrice = parseFloat(priceRange.min);
    if (!isNaN(minPrice)) filtered = filtered.filter(m => m.price >= minPrice);
    const maxPrice = parseFloat(priceRange.max);
    if (!isNaN(maxPrice)) filtered = filtered.filter(m => m.price <= maxPrice);
    const minYear = parseInt(yearRange.min, 10);
    if (!isNaN(minYear)) filtered = filtered.filter(m => m.year >= minYear);
    const maxYear = parseInt(yearRange.max, 10);
    if (!isNaN(maxYear)) filtered = filtered.filter(m => m.year <= maxYear);
    
    if (engineSizeCategory !== 'any') {
      switch (engineSizeCategory) {
        case 'small':
          filtered = filtered.filter(m => m.engineSize < 250);
          break;
        case 'medium':
          filtered = filtered.filter(m => m.engineSize >= 250 && m.engineSize <= 650);
          break;
        case 'large':
          filtered = filtered.filter(m => m.engineSize > 650);
          break;
      }
    }
    
    return filtered;
  }, [motorcycles, searchTerm, locationFilter, priceRange, yearRange, engineSizeCategory, selectedCategory]);

  const filteredParts = useMemo(() => {
    let filtered = parts.filter(p => p.status === 'for-sale' || p.status === 'reserved');
    const lowercasedFilter = searchTerm.toLowerCase();
    if (lowercasedFilter) filtered = filtered.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(lowercasedFilter));
    if (locationFilter) filtered = filtered.filter(p => p.location.toLowerCase().includes(locationFilter.toLowerCase()));
    if (selectedPartCategory !== 'All') filtered = filtered.filter(p => p.category === selectedPartCategory);
    const minPrice = parseFloat(priceRange.min);
    if (!isNaN(minPrice)) filtered = filtered.filter(p => p.price >= minPrice);
    const maxPrice = parseFloat(priceRange.max);
    if (!isNaN(maxPrice)) filtered = filtered.filter(p => p.price <= maxPrice);
    
    return filtered;
  }, [parts, searchTerm, locationFilter, priceRange, selectedPartCategory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background" onClick={handleAddHeatmapPoint}>
      <Header 
        currentUser={currentUser} 
        view={view} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onResetFilters={handleResetFilters}
        onRequestNotificationPermission={handleRequestNotificationPermission}
        notificationPermission={notificationPermission}
      />
      
      <main className="flex-grow pb-16 md:pb-0">
        {view === 'login' && <LoginView onLoginSuccess={handleLoginSuccess} onNavigate={setView} />}
        {view === 'signup' && <SignUpView onSignUpSuccess={handleSignUpSuccess} onNavigate={setView} />}
        {view === 'home' && (
          <>
            <FilterModal 
              isOpen={isFilterModalOpen}
              onClose={() => setIsFilterModalOpen(false)}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              yearRange={yearRange}
              setYearRange={setYearRange}
              engineSizeCategory={engineSizeCategory}
              setEngineSizeCategory={setEngineSizeCategory}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPartCategory={selectedPartCategory}
              setSelectedPartCategory={setSelectedPartCategory}
              marketView={marketView}
              onSaveSearch={handleSaveSearch}
            />
            {marketView === 'motorcycles' ? (
              <MotorcycleList 
                motorcycles={filteredMotorcycles}
                currentUser={currentUser}
                onSelectMotorcycle={handleSelectMotorcycle}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                onViewPublicProfile={handleViewPublicProfile}
                onOpenOfferModal={handleOpenOfferModal}
              />
            ) : (
              <PartList 
                parts={filteredParts}
                currentUser={currentUser}
                onSelectPart={handleSelectPart}
                onToggleFavorite={handleTogglePartFavorite}
                favoriteParts={favoriteParts}
                onViewPublicProfile={handleViewPublicProfile}
                onOpenOfferModal={handleOpenOfferModal}
              />
            )}
          </>
        )}
        {view === 'detail' && selectedMotorcycle && (
          <MotorcycleDetailView 
            motorcycle={selectedMotorcycle}
            currentUser={currentUser}
            onBack={handleBackToPrevView}
            onStartOrGoToChat={handleStartOrGoToChat}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(selectedMotorcycle.id)}
            onViewPublicProfile={handleViewPublicProfile}
            onMarkAsSold={handleMarkAsSold}
            onNavigateToEdit={handleNavigateToEdit}
            onPromoteItem={handlePromoteItem}
            onOpenOfferModal={handleOpenOfferModal}
          />
        )}
        {view === 'partDetail' && selectedPart && (
          <PartDetailView 
            part={selectedPart}
            currentUser={currentUser}
            onBack={handleBackToPrevView}
            onStartOrGoToChat={handleStartOrGoToChat}
            onToggleFavorite={handleTogglePartFavorite}
            isFavorite={favoriteParts.includes(selectedPart.id)}
            onViewPublicProfile={handleViewPublicProfile}
            onMarkAsSold={handleMarkAsSold}
            onNavigateToEdit={handleNavigateToEdit}
            onPromoteItem={handlePromoteItem}
            onOpenOfferModal={handleOpenOfferModal}
          />
        )}
        {view === 'sell' && currentUser && (
          <SellForm 
            currentUser={currentUser} 
            onPublish={handlePublish}
            onCancel={() => setView('profile')}
          />
        )}
        {view === 'profile' && currentUser && (
          <ProfileView 
            currentUser={currentUser}
            motorcycles={motorcycles.filter(m => m.sellerEmail === currentUser.email)}
            parts={parts.filter(p => p.sellerEmail === currentUser.email)}
            onNavigate={handleNavigate}
            onUpdateProfileImage={handleUpdateProfileImage}
            onMarkAsSold={handleMarkAsSold}
            onNavigateToEdit={handleNavigateToEdit}
            onPromoteItem={handlePromoteItem}
          />
        )}
        {view === 'publicProfile' && selectedSellerEmail && (
          <PublicProfileView 
            sellerEmail={selectedSellerEmail}
            users={users}
            motorcycles={motorcycles.filter(m => m.sellerEmail === selectedSellerEmail)}
            parts={parts.filter(p => p.sellerEmail === selectedSellerEmail)}
            currentUser={currentUser}
            onBack={handleBackToPrevView}
            onStartOrGoToChat={handleStartOrGoToChat}
            onRateUser={handleRateUser}
            userRatings={userRatings}
          />
        )}
        {view === 'edit' && currentUser && (
          <EditForm 
            motorcycle={motorcycleToEdit}
            part={partToEdit}
            currentUser={currentUser}
            onUpdateItem={handleUpdateItem}
            onCancel={() => {
              setMotorcycleToEdit(null);
              setPartToEdit(null);
              setView('profile');
            }}
          />
        )}
        {view === 'favorites' && currentUser && (
          <FavoritesView 
            motorcycles={motorcycles.filter(m => favorites.includes(m.id))}
            parts={parts.filter(p => favoriteParts.includes(p.id))}
            currentUser={currentUser}
            onSelectMotorcycle={handleSelectMotorcycle}
            onSelectPart={handleSelectPart}
            onToggleMotorcycleFavorite={handleToggleFavorite}
            onTogglePartFavorite={handleTogglePartFavorite}
            favorites={favorites}
            favoriteParts={favoriteParts}
            onViewPublicProfile={handleViewPublicProfile}
            onOpenOfferModal={handleOpenOfferModal}
          />
        )}
        {view === 'chatList' && (
          <ChatListView 
            conversations={conversations}
            currentUser={currentUser}
            users={users}
            motorcycles={motorcycles}
            parts={parts}
            onSelectConversation={setSelectedConversationId}
            onNavigate={setView}
          />
        )}
        {view === 'chatDetail' && selectedConversationId && currentUser && (
          <ChatDetailView 
            conversationId={selectedConversationId}
            currentUser={currentUser}
            users={users}
            motorcycles={motorcycles}
            parts={parts}
            messages={messages.filter(m => m.conversationId === selectedConversationId)}
            isTyping={isTyping[selectedConversationId] || false}
            onBack={handleBackToPrevView}
            onSendMessage={handleSendMessage}
            onViewItem={selectedMotorcycle ? () => setView('detail') : () => setView('partDetail')}
          />
        )}
        {view === 'offers' && currentUser && (
          <OffersView 
            offers={offers}
            currentUser={currentUser}
            motorcycles={motorcycles}
            parts={parts}
            users={users}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
            onCancelSale={handleCancelSale}
            onNavigate={setView}
          />
        )}
      </main>
      
      {view !== 'chatDetail' && (
        <BottomNav 
          currentUser={currentUser} 
          view={view} 
          onNavigate={handleNavigate} 
          unreadMessages={messages.filter(m => !m.isRead && m.senderEmail !== currentUser?.email).length}
          pendingOffersCount={offers.filter(o => o.sellerEmail === currentUser?.email && o.status === 'pending').length}
        />
      )}
      
      <ConfirmationModal 
        isOpen={isConfirmationModalOpen}
        onClose={() => {
          setIsConfirmationModalOpen(false);
          setMotoToPublish(null);
          setPartToPublish(null);
        }}
        onConfirm={handleConfirmPublish}
      />
      
      <ConfirmationModal 
        isOpen={isPromoteModalOpen}
        onClose={() => {
          setIsPromoteModalOpen(false);
          setItemToPromote(null);
        }}
        onConfirm={handleConfirmPromote}
        title="Promocionar Anuncio"
        message="¿Estás seguro de que quieres promocionar este anuncio? Aparecerá destacado en las búsquedas."
      />

      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => {
          setIsOfferModalOpen(false);
          setItemToMakeOfferOn(null);
        }}
        onMakeOffer={handleMakeOffer}
        item={itemToMakeOfferOn}
      />

      {isHeatmapVisible && <HeatmapOverlay data={heatmapData} />}
    </div>
  );
};

export default App;
