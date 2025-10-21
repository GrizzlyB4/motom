
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
import { supabase, addHeatmapPoint as addHeatmapPointToDb, getHeatmapData } from './services/supabase';
import Spinner from './components/Spinner';


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


const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [motorcycleToEdit, setMotorcycleToEdit] = useState<Motorcycle | null>(null);
  const [partToEdit, setPartToEdit] = useState<Part | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedSellerEmail, setSelectedSellerEmail] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [yearRange, setYearRange] = useState({ min: '', max: '' });
  const [engineSizeCategory, setEngineSizeCategory] = useState('any');
  const [selectedCategory, setSelectedCategory] = useState<MotorcycleCategory>('All');
  const [selectedPartCategory, setSelectedPartCategory] = useState<PartCategory>('All');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteParts, setFavoriteParts] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [userRatings, setUserRatings] = useState<{ [sellerEmail: string]: number }>({});
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
  const [isTyping, setIsTyping] = useState<{ [conversationId: string]: boolean }>({});

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [motoToPublish, setMotoToPublish] = useState<Omit<Motorcycle, 'id' | 'sellerEmail' | 'status'> | null>(null);
  const [partToPublish, setPartToPublish] = useState<Omit<Part, 'id' | 'sellerEmail' | 'status'> | null>(null);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [itemToPromote, setItemToPromote] = useState<{id: string, type: 'motorcycle' | 'part'} | null>(null);
  const [marketView, setMarketView] = useState<'motorcycles' | 'parts'>('motorcycles');
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [itemToMakeOfferOn, setItemToMakeOfferOn] = useState<Motorcycle | Part | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);


  // --- AUTH & DATA FETCHING ---
  
  useEffect(() => {
    // Keep the splash screen until the initial loading is done
    if (!isLoading) {
      const splashScreen = document.getElementById('splash-screen');
      const splashMoto = document.querySelector('.splash-moto');
      const splashTitle = document.querySelector('.splash-title');

      if (splashScreen && splashMoto && splashTitle) {
        // Add a small delay to ensure the main content is ready to be painted
        setTimeout(() => {
          splashMoto.classList.add('exit');
          splashTitle.classList.add('exit');
          splashScreen.classList.add('hidden');
          // Remove from DOM after transition
          splashScreen.addEventListener('transitionend', () => {
            splashScreen.remove();
          });
        }, 100);
      }
    }
  }, [isLoading]);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Loading timeout reached, forcing isLoading to false');
        setIsLoading(false);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(loadingTimeout);
  }, [isLoading]);

  useEffect(() => {
    // Check notification permission status
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

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
        // Add a small delay to ensure state is properly set before hiding loading
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      } else {
        setCurrentUser(null);
        setView('login');
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
        const fetchAllData = async () => {
            setIsLoading(true);

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
            
            setOffers(offersRes.data?.map((offer: any) => ({
                id: offer.id,
                itemId: offer.item_id,
                itemType: offer.item_type,
                buyerEmail: offer.buyer_email,
                sellerEmail: offer.seller_email,
                offerAmount: offer.offer_amount,
                status: offer.status,
                timestamp: offer.timestamp,
            })) || []);
            setConversations(conversationsRes.data?.map((conversation: any) => ({
                id: conversation.id,
                participants: conversation.participants,
                motorcycleId: conversation.motorcycle_id,
                partId: conversation.part_id,
            })) || []);
            setMessages(messagesRes.data || []);
            setFavorites(favoritesRes.data?.map(f => f.motorcycle_id) || []);
            setFavoriteParts(partFavoritesRes.data?.map(f => f.part_id) || []);
            setSavedSearches(savedSearchesRes.data || []);
            setUserRatings(ratingsRes.data?.reduce((acc, rating) => ({ ...acc, [rating.rated_user_email]: rating.rating }), {}) || {});
            setHeatmapData(heatmapRes || []);

            setIsLoading(false);
        };
        fetchAllData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
        // Set up real-time subscriptions
        const conversationSubscription = supabase
          .channel('conversation-changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'conversations',
            },
            (payload) => {
              const newConversation = payload.new;
              // Map the new conversation to camelCase
              const mappedConversation = {
                id: newConversation.id,
                participants: newConversation.participants,
                motorcycleId: newConversation.motorcycle_id,
                partId: newConversation.part_id,
              };
              // Only add conversations that involve the current user
              if (mappedConversation.participants.includes(currentUser.email)) {
                setConversations(prev => [...prev, mappedConversation]);
              }
            }
          )
          .subscribe();
          
        const messageSubscription = supabase
          .channel('message-changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
            },
            (payload) => {
              const newMessage = payload.new;
              setMessages(prev => [...prev, newMessage]);
            }
          )
          .subscribe();
          
        // Add subscription for offers
        const offerSubscription = supabase
          .channel('offer-changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'offers',
            },
            (payload) => {
              const newOffer = payload.new;
              // Map the new offer to camelCase
              const mappedOffer = {
                id: newOffer.id,
                itemId: newOffer.item_id,
                itemType: newOffer.item_type,
                buyerEmail: newOffer.buyer_email,
                sellerEmail: newOffer.seller_email,
                offerAmount: newOffer.offer_amount,
                status: newOffer.status,
                timestamp: newOffer.timestamp,
              };
              setOffers(prev => [mappedOffer, ...prev]);
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'offers',
            },
            (payload) => {
              const updatedOffer = payload.new;
              // Map the updated offer to camelCase
              const mappedOffer = {
                id: updatedOffer.id,
                itemId: updatedOffer.item_id,
                itemType: updatedOffer.item_type,
                buyerEmail: updatedOffer.buyer_email,
                sellerEmail: updatedOffer.seller_email,
                offerAmount: updatedOffer.offer_amount,
                status: updatedOffer.status,
                timestamp: updatedOffer.timestamp,
              };
              setOffers(prev => prev.map(offer => offer.id === mappedOffer.id ? mappedOffer : offer));
            }
          )
          .subscribe();

        // Clean up subscriptions when the component unmounts or currentUser changes
        return () => {
          supabase.removeChannel(conversationSubscription);
          supabase.removeChannel(messageSubscription);
          supabase.removeChannel(offerSubscription);
        };
    }
  }, [currentUser]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedMotorcycle, selectedPart, selectedConversationId]);


  const handleNavigate = (newView: View) => {
    if (newView === 'chat') {
        setView('chatList');
    } else {
        setView(newView);
    }
  };

  const handleSelectMotorcycle = (moto: Motorcycle) => { 
    setSelectedMotorcycle(moto); 
    setView('detail'); 
  };

  const handleSelectPart = (part: Part) => { 
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
  
  // FIX: Define handleLogin and handleSignUp for authentication
  const handleLogin = async (email: string, password?: string) => {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password || '',
    });
    if (error) throw new Error("Email o contraseña incorrectos.");
  };

  const handleSignUp = async (name: string, email: string, password?: string) => {
    const { error } = await supabase.auth.signUp({
        email: email,
        password: password || '',
        options: {
            data: {
                name,
            }
        }
    });
    if (error) throw new Error("No se pudo crear la cuenta. El email podría estar en uso o la contraseña es muy débil.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setView('login');
  };

  const handlePublish = (data: Omit<Motorcycle, 'id' | 'sellerEmail' | 'status'> | Omit<Part, 'id' | 'sellerEmail' | 'status'>, type: 'motorcycle' | 'part') => {
    if (type === 'motorcycle') {
        setMotoToPublish(data as Omit<Motorcycle, 'id' | 'sellerEmail' | 'status'>);
    } else {
        setPartToPublish(data as Omit<Part, 'id' | 'sellerEmail' | 'status'>);
    }
    setIsConfirmationModalOpen(true);
  };
  
  const handleConfirmPublish = async () => {
    if (!currentUser) return;

    try {
      if (motoToPublish) {
        // Explicitly map camelCase properties to snake_case column names for Supabase
        const newMotoForDb = {
          make: motoToPublish.make,
          model: motoToPublish.model,
          year: motoToPublish.year,
          price: motoToPublish.price,
          mileage: motoToPublish.mileage,
          engine_size: motoToPublish.engineSize,
          description: motoToPublish.description,
          image_urls: motoToPublish.imageUrls.length > 0 ? motoToPublish.imageUrls : [`https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop`],
          video_url: motoToPublish.videoUrl,
          seller_email: currentUser.email,
          category: motoToPublish.category,
          location: motoToPublish.location, // Add the missing location field
          status: 'for-sale',
          featured: false,
        };
        
        const { data, error } = await supabase.from('motorcycles').insert(newMotoForDb).select().single();
        
        if (error) {
          throw error;
        }

        if (data) {
          // Map the database response back to camelCase for the frontend
          const motoWithCamelCase: Motorcycle = {
            id: data.id,
            make: data.make,
            model: data.model,
            year: data.year,
            price: data.price,
            mileage: data.mileage,
            engineSize: data.engine_size,
            description: data.description,
            imageUrls: data.image_urls,
            videoUrl: data.video_url,
            sellerEmail: data.seller_email,
            category: data.category,
            status: data.status,
            location: data.location,
            featured: data.featured,
            reservedBy: data.reserved_by,
            stats: data.stats,
          };
          setMotorcycles(prev => [motoWithCamelCase, ...prev]);
        }

      } else if (partToPublish) {
        // Explicitly map camelCase properties to snake_case column names for Supabase
        const newPartForDb = {
          name: partToPublish.name,
          price: partToPublish.price,
          description: partToPublish.description,
          image_urls: partToPublish.imageUrls.length > 0 ? partToPublish.imageUrls : ['https://images.unsplash.com/photo-1559795632-520a8e7a016f?q=80&w=800&auto=format&fit=crop'],
          video_url: partToPublish.videoUrl,
          seller_email: currentUser.email,
          category: partToPublish.category,
          condition: partToPublish.condition,
          compatibility: partToPublish.compatibility,
          location: partToPublish.location, // Add the missing location field
          status: 'for-sale',
          featured: false,
        };
        
        const { data, error } = await supabase.from('parts').insert(newPartForDb).select().single();
        
        if (error) {
          throw error;
        }

        if (data) {
          // Map the database response back to camelCase for the frontend
          const partWithCamelCase: Part = {
            id: data.id,
            name: data.name,
            price: data.price,
            description: data.description,
            imageUrls: data.image_urls,
            videoUrl: data.video_url,
            sellerEmail: data.seller_email,
            category: data.category,
            condition: data.condition,
            compatibility: data.compatibility,
            status: data.status,
            location: data.location,
            featured: data.featured,
            reservedBy: data.reserved_by,
            stats: data.stats,
          };
          setParts(prev => [partWithCamelCase, ...prev]);
        }
      }
      
      alert("¡Anuncio publicado!");
      setView('profile');

    } catch (error: any) {
      console.error("Error al publicar el anuncio:", error);
      alert(`No se pudo publicar el anuncio. Por favor, revisa los datos e inténtalo de nuevo.\nError: ${error.message}`);
    } finally {
      setIsConfirmationModalOpen(false);
      setMotoToPublish(null);
      setPartToPublish(null);
    }
  };
  
  const handleResetFilters = () => {
    setLocationFilter('');
    setPriceRange({ min: '', max: '' });
    setYearRange({ min: '', max: '' });
    setEngineSizeCategory('any');
  };
  
  const handleStartOrGoToChat = async (item: Motorcycle | Part) => {
    if (!currentUser) return;
    
    try {
      // Check if a conversation already exists between the current user and the seller
      const sellerEmail = item.sellerEmail;
      const existingConversation = conversations.find(convo => 
        convo.participants.includes(currentUser.email) && 
        convo.participants.includes(sellerEmail) &&
        (('make' in item && convo.motorcycleId === item.id) || 
         (!('make' in item) && convo.partId === item.id))
      );
      
      if (existingConversation) {
        // If conversation exists, navigate to it
        setSelectedConversationId(existingConversation.id);
        setView('chatDetail');
      } else {
        // If no conversation exists, create a new one
        const conversationData = {
          participants: [currentUser.email, sellerEmail],
          [`${'make' in item ? 'motorcycle' : 'part'}_id`]: item.id
        };
        
        const { data: newConversation, error } = await supabase
          .from('conversations')
          .insert(conversationData)
          .select()
          .single();
          
        if (error) {
          console.error('Error creating conversation:', error);
          alert('Error al iniciar el chat. Por favor, inténtalo de nuevo.');
          return;
        }
        
        // Add the new conversation to local state
        setConversations(prev => [...prev, newConversation]);
        
        // Navigate to the new conversation
        setSelectedConversationId(newConversation.id);
        setView('chatDetail');
      }
    } catch (error: any) {
      console.error('Unexpected error starting chat:', error);
      alert(`Error inesperado al iniciar el chat: ${error.message}`);
    }
  };

  const handleSendMessage = async (conversationId: string, text: string) => {
    if (!currentUser) return;
    
    try {
      const messageData = {
        conversation_id: conversationId,
        sender_email: currentUser.email,
        text: text
      };
      
      const { data: newMessage, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();
        
      if (error) {
        console.error('Error sending message:', error);
        alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        return;
      }
      
      // Add the new message to local state
      setMessages(prev => [...prev, newMessage]);
    } catch (error: any) {
      console.error('Unexpected error sending message:', error);
      alert(`Error inesperado al enviar el mensaje: ${error.message}`);
    }
  };
  
  const handleToggleFavorite = async (motoId: string) => {
    if (!currentUser) return;
    const isAdding = !favorites.includes(motoId);
    
    // Optimistic UI update
    setFavorites(prev => isAdding ? [...prev, motoId] : prev.filter(id => id !== motoId));

    if (isAdding) {
        await supabase.from('motorcycle_favorites').insert({ user_id: currentUser.id, motorcycle_id: motoId });
    } else {
        await supabase.from('motorcycle_favorites').delete().match({ user_id: currentUser.id, motorcycle_id: motoId });
    }
  };
  
  const handleTogglePartFavorite = async (partId: string) => {
    if (!currentUser) return;
    const isAdding = !favoriteParts.includes(partId);

    setFavoriteParts(prev => isAdding ? [...prev, partId] : prev.filter(id => id !== partId));

    if (isAdding) {
        await supabase.from('part_favorites').insert({ user_id: currentUser.id, part_id: partId });
    } else {
        await supabase.from('part_favorites').delete().match({ user_id: currentUser.id, part_id: partId });
    }
  };

  const handleRequestNotificationPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
  };

  const handleUpdateProfileImage = async (imageUrl: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, profileImageUrl: imageUrl };
      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.email === currentUser.email ? {...u, profileImageUrl: imageUrl} : u));
      await supabase.from('profiles').update({ profile_image_url: imageUrl }).eq('id', currentUser.id);
    }
  };
  
  const handleViewPublicProfile = (sellerEmail: string) => {
      setSelectedSellerEmail(sellerEmail);
      setView('publicProfile');
  };

  const handleMarkAsSold = async (itemId: string, type: 'motorcycle' | 'part') => {
    if (window.confirm("¿Marcar como vendido?")) {
        const table = type === 'motorcycle' ? 'motorcycles' : 'parts';
        // Explicitly specify column names for Supabase
        const { data } = await supabase.from(table).update({ status: 'sold' }).eq('id', itemId).select().single();
        if (data) {
            if (type === 'motorcycle') {
                // Map the database response back to camelCase for the frontend
                const motoWithCamelCase: Motorcycle = {
                  id: data.id,
                  make: data.make,
                  model: data.model,
                  year: data.year,
                  price: data.price,
                  mileage: data.mileage,
                  engineSize: data.engine_size,
                  description: data.description,
                  imageUrls: data.image_urls,
                  videoUrl: data.video_url,
                  sellerEmail: data.seller_email,
                  category: data.category,
                  status: data.status,
                  location: data.location,
                  featured: data.featured,
                  reservedBy: data.reserved_by,
                  stats: data.stats,
                };
                setMotorcycles(prev => prev.map(item => item.id === itemId ? motoWithCamelCase : item));
            } else {
                // Map the database response back to camelCase for the frontend
                const partWithCamelCase: Part = {
                  id: data.id,
                  name: data.name,
                  price: data.price,
                  description: data.description,
                  imageUrls: data.image_urls,
                  videoUrl: data.video_url,
                  sellerEmail: data.seller_email,
                  category: data.category,
                  condition: data.condition,
                  compatibility: data.compatibility,
                  status: data.status,
                  location: data.location,
                  featured: data.featured,
                  reservedBy: data.reserved_by,
                  stats: data.stats,
                };
                setParts(prev => prev.map(item => item.id === itemId ? partWithCamelCase : item));
            }
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

  const handleUpdateItem = async (updatedItem: Motorcycle | Part) => {
     if ('make' in updatedItem) {
        // Map camelCase properties to snake_case for Supabase
        const updatedItemForDb = {
          make: updatedItem.make,
          model: updatedItem.model,
          year: updatedItem.year,
          price: updatedItem.price,
          mileage: updatedItem.mileage,
          engine_size: updatedItem.engineSize,
          description: updatedItem.description,
          image_urls: updatedItem.imageUrls,
          video_url: updatedItem.videoUrl,
          seller_email: updatedItem.sellerEmail,
          category: updatedItem.category,
          status: updatedItem.status,
          location: updatedItem.location, // Add the missing location field
          featured: updatedItem.featured,
          reserved_by: updatedItem.reservedBy,
          stats: updatedItem.stats,
        };
        
        const { data } = await supabase.from('motorcycles').update(updatedItemForDb).eq('id', updatedItem.id).select().single();
        if (data) {
          // Map the database response back to camelCase for the frontend
          const motoWithCamelCase: Motorcycle = {
            id: data.id,
            make: data.make,
            model: data.model,
            year: data.year,
            price: data.price,
            mileage: data.mileage,
            engineSize: data.engine_size,
            description: data.description,
            imageUrls: data.image_urls,
            videoUrl: data.video_url,
            sellerEmail: data.seller_email,
            category: data.category,
            status: data.status,
            location: data.location,
            featured: data.featured,
            reservedBy: data.reserved_by,
            stats: data.stats,
          };
          setMotorcycles(prev => prev.map(item => item.id === data.id ? motoWithCamelCase : item));
        }
    } else {
        // Map camelCase properties to snake_case for Supabase
        const updatedItemForDb = {
          name: updatedItem.name,
          price: updatedItem.price,
          description: updatedItem.description,
          image_urls: updatedItem.imageUrls,
          video_url: updatedItem.videoUrl,
          seller_email: updatedItem.sellerEmail,
          category: updatedItem.category,
          condition: updatedItem.condition,
          compatibility: updatedItem.compatibility,
          location: updatedItem.location, // Add the missing location field
          status: updatedItem.status,
          featured: updatedItem.featured,
          reserved_by: updatedItem.reservedBy,
          stats: updatedItem.stats,
        };
        
        const { data } = await supabase.from('parts').update(updatedItemForDb).eq('id', updatedItem.id).select().single();
        if (data) {
          // Map the database response back to camelCase for the frontend
          const partWithCamelCase: Part = {
            id: data.id,
            name: data.name,
            price: data.price,
            description: data.description,
            imageUrls: data.image_urls,
            videoUrl: data.video_url,
            sellerEmail: data.seller_email,
            category: data.category,
            condition: data.condition,
            compatibility: data.compatibility,
            status: data.status,
            location: data.location,
            featured: data.featured,
            reservedBy: data.reserved_by,
            stats: data.stats,
          };
          setParts(prev => prev.map(item => item.id === data.id ? partWithCamelCase : item));
        }
    }
    setMotorcycleToEdit(null);
    setPartToEdit(null);
    setView('profile');
    alert('¡Anuncio actualizado con éxito!');
  };

  const handlePromoteItem = (itemId: string, type: 'motorcycle' | 'part') => {
    setItemToPromote({ id: itemId, type });
    setIsPromoteModalOpen(true);
  };

  const handleConfirmPromote = async () => {
    if (!itemToPromote) return;
    const table = itemToPromote.type === 'motorcycle' ? 'motorcycles' : 'parts';
    // Explicitly specify column names for Supabase
    const { data } = await supabase.from(table).update({ featured: true, stats: { views: 0, favorites: 0, chats: 0 } }).eq('id', itemToPromote.id).select().single();
    if (data) {
        if (itemToPromote.type === 'motorcycle') {
            // Map the database response back to camelCase for the frontend
            const motoWithCamelCase: Motorcycle = {
              id: data.id,
              make: data.make,
              model: data.model,
              year: data.year,
              price: data.price,
              mileage: data.mileage,
              engineSize: data.engine_size,
              description: data.description,
              imageUrls: data.image_urls,
              videoUrl: data.video_url,
              sellerEmail: data.seller_email,
              category: data.category,
              status: data.status,
              location: data.location,
              featured: data.featured,
              reservedBy: data.reserved_by,
              stats: data.stats,
            };
            setMotorcycles(prev => prev.map(moto => moto.id === itemToPromote.id ? motoWithCamelCase : moto));
        } else {
            // Map the database response back to camelCase for the frontend
            const partWithCamelCase: Part = {
              id: data.id,
              name: data.name,
              price: data.price,
              description: data.description,
              imageUrls: data.image_urls,
              videoUrl: data.video_url,
              sellerEmail: data.seller_email,
              category: data.category,
              condition: data.condition,
              compatibility: data.compatibility,
              status: data.status,
              location: data.location,
              featured: data.featured,
              reservedBy: data.reserved_by,
              stats: data.stats,
            };
            setParts(prev => prev.map(part => part.id === itemToPromote.id ? partWithCamelCase : part));
        }
        alert('¡Anuncio promocionado con éxito!');
    }
    setIsPromoteModalOpen(false);
    setItemToPromote(null);
  };

  const handleRateUser = async (sellerEmail: string, rating: number) => {
     if (!currentUser) return;
     // Update UI optimistically
     setUserRatings(prev => ({...prev, [sellerEmail]: rating }));
     // Update DB
     await supabase.from('user_ratings').insert({ rater_id: currentUser.id, rated_user_email: sellerEmail, rating });
     // Could use an edge function to update the seller's average rating
     alert(`Has valorado a ${sellerEmail} con ${rating} estrellas. ¡Gracias!`);
  };

  const handleAddHeatmapPoint = (e: React.MouseEvent) => {
    const newPoint: HeatmapPoint = { x: e.pageX, y: e.pageY, value: 1 };
    setHeatmapData(prev => [...prev, newPoint]);
    addHeatmapPointToDb(newPoint);
  };
  
  const handleToggleHeatmap = () => setIsHeatmapVisible(prev => !prev);

  const handleSaveSearch = async (type: 'motorcycle' | 'part') => {
      if(!currentUser) return;
      const newSearch = { user_id: currentUser.id, search_type: type, search_term: searchTerm, location_filter: locationFilter, price_range: priceRange, year_range: yearRange, engine_size_category: engineSizeCategory, part_category: selectedPartCategory };
      const { data } = await supabase.from('saved_searches').insert(newSearch).select().single();
      if(data) {
        setSavedSearches(prev => [...prev, data]);
        alert('¡Alerta guardada!');
      }
  };

  const handleDeleteSearch = async (searchId: string) => {
      setSavedSearches(prev => prev.filter(s => s.id !== searchId));
      await supabase.from('saved_searches').delete().eq('id', searchId);
  };

  const handleOpenOfferModal = (item: Motorcycle | Part) => {
    setItemToMakeOfferOn(item);
    setIsOfferModalOpen(true);
  };

  const handleMakeOffer = async (amount: number) => {
    if (!currentUser || !itemToMakeOfferOn) return;
    
    // Log the data we're about to send for debugging
    console.log('Making offer with data:', {
      item_id: itemToMakeOfferOn.id,
      item_type: 'make' in itemToMakeOfferOn ? 'motorcycle' : 'part',
      buyer_email: currentUser.email,
      seller_email: itemToMakeOfferOn.sellerEmail,
      offer_amount: amount,
      status: 'pending'
    });
    
    const newOfferData = {
        item_id: itemToMakeOfferOn.id,
        item_type: 'make' in itemToMakeOfferOn ? 'motorcycle' : 'part',
        buyer_email: currentUser.email,
        seller_email: itemToMakeOfferOn.sellerEmail,
        offer_amount: amount,
        status: 'pending'
        // Removed timestamp since it has a default value of now() in the database
    };
    
    try {
      // Small delay to help with schema cache issues
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try inserting with explicit column names to avoid schema cache issues
      let { data, error } = await supabase
        .from('offers')
        .insert([
          {
            item_id: newOfferData.item_id,
            item_type: newOfferData.item_type,
            buyer_email: newOfferData.buyer_email,
            seller_email: newOfferData.seller_email,
            offer_amount: newOfferData.offer_amount,
            status: newOfferData.status
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error making offer:', error);
        // Try again with a different approach if there's a schema cache issue
        if (error.message.includes('schema cache')) {
          console.log('Retrying offer insertion with alternative method...');
          const retryResult = await supabase
            .from('offers')
            .insert({
              item_id: newOfferData.item_id,
              item_type: newOfferData.item_type,
              buyer_email: newOfferData.buyer_email,
              seller_email: newOfferData.seller_email,
              offer_amount: newOfferData.offer_amount,
              status: newOfferData.status
            })
            .select()
            .single();
          
          if (retryResult.error) {
            console.error('Retry also failed:', retryResult.error);
            alert(`Error al hacer la oferta: ${retryResult.error.message}`);
            return;
          }
          
          data = retryResult.data;
        } else {
          alert(`Error al hacer la oferta: ${error.message}`);
          return;
        }
      }
      
      if(data) {
          // Map the database response back to camelCase for the frontend
          const offerWithCamelCase: Offer = {
            id: data.id,
            itemId: data.item_id,
            itemType: data.item_type,
            buyerEmail: data.buyer_email,
            sellerEmail: data.seller_email,
            offerAmount: data.offer_amount,
            status: data.status,
            timestamp: data.timestamp,
          };
          setOffers(prev => [offerWithCamelCase, ...prev]);
          setIsOfferModalOpen(false);
          setItemToMakeOfferOn(null);
          alert('¡Oferta enviada con éxito!');
          setView('offers');
      }
    } catch (error: any) {
      console.error('Unexpected error making offer:', error);
      alert(`Error inesperado al hacer la oferta: ${error.message}`);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      // Get the offer details first
      const offer = offers.find(o => o.id === offerId);
      if (!offer) {
        alert('Oferta no encontrada');
        return;
      }
      
      // Update the offer status to 'accepted' in the database
      const { data, error } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offerId)
        .select()
        .single();
      
      if (error) {
        console.error('Error accepting offer:', error);
        alert(`Error al aceptar la oferta: ${error.message}`);
        return;
      }
      
      if (data) {
        // Map the database response back to camelCase for the frontend
        const offerWithCamelCase: Offer = {
          id: data.id,
          itemId: data.item_id,
          itemType: data.item_type,
          buyerEmail: data.buyer_email,
          sellerEmail: data.seller_email,
          offerAmount: data.offer_amount,
          status: data.status,
          timestamp: data.timestamp,
        };
        
        // Update the local state
        setOffers(prev => prev.map(o => 
          o.id === offerId ? offerWithCamelCase : o
        ));
        
        // Also update the item status to 'reserved' in the database
        const table = offer.itemType === 'motorcycle' ? 'motorcycles' : 'parts';
        const { data: itemData, error: itemError } = await supabase
          .from(table)
          .update({ status: 'reserved', reserved_by: offer.buyerEmail })
          .eq('id', offer.itemId)
          .select()
          .single();
          
        if (itemError) {
          console.error('Error reserving item:', itemError);
          alert(`Error al reservar el artículo: ${itemError.message}`);
          return;
        }
        
        if (itemData) {
          // Update the local state for the item
          if (offer.itemType === 'motorcycle') {
            // Map the database response back to camelCase for the frontend
            const motoWithCamelCase: Motorcycle = {
              id: itemData.id,
              make: itemData.make,
              model: itemData.model,
              year: itemData.year,
              price: itemData.price,
              mileage: itemData.mileage,
              engineSize: itemData.engine_size,
              description: itemData.description,
              imageUrls: itemData.image_urls,
              videoUrl: itemData.video_url,
              sellerEmail: itemData.seller_email,
              category: itemData.category,
              status: itemData.status,
              location: itemData.location,
              featured: itemData.featured,
              reservedBy: itemData.reserved_by,
              stats: itemData.stats,
            };
            setMotorcycles(prev => prev.map(moto => 
              moto.id === offer.itemId ? motoWithCamelCase : moto
            ));
          } else {
            // Map the database response back to camelCase for the frontend
            const partWithCamelCase: Part = {
              id: itemData.id,
              name: itemData.name,
              price: itemData.price,
              description: itemData.description,
              imageUrls: itemData.image_urls,
              videoUrl: itemData.video_url,
              sellerEmail: itemData.seller_email,
              category: itemData.category,
              condition: itemData.condition,
              compatibility: itemData.compatibility,
              status: itemData.status,
              location: itemData.location,
              featured: itemData.featured,
              reservedBy: itemData.reserved_by,
              stats: itemData.stats,
            };
            setParts(prev => prev.map(part => 
              part.id === offer.itemId ? partWithCamelCase : part
            ));
          }
        }
        
        // Create a chat conversation between buyer and seller
        const conversationData = {
          participants: [offer.buyerEmail, offer.sellerEmail],
          [`${offer.itemType}_id`]: offer.itemId
        };
        
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .insert(conversationData)
          .select()
          .single();
          
        if (conversationError) {
          console.error('Error creating conversation:', conversationError);
        } else {
          // Add the conversation to local state
          setConversations(prev => [...prev, conversation]);
          
          // Create an automatic message informing the buyer
          const buyer = users.find(u => u.email === offer.buyerEmail);
          const seller = users.find(u => u.email === offer.sellerEmail);
          const item = offer.itemType === 'motorcycle' 
            ? motorcycles.find(m => m.id === offer.itemId)
            : parts.find(p => p.id === offer.itemId);
            
          const itemName = item 
            ? (offer.itemType === 'motorcycle' 
                ? `${item.make} ${item.model}` 
                : item.name)
            : 'el artículo';
            
          const messageData = {
            conversation_id: conversation.id,
            sender_email: 'system', // Use 'system' as sender for automatic messages
            text: `¡Felicidades ${buyer?.name || 'comprador'}! Tu oferta por ${itemName} ha sido aceptada por ${seller?.name || 'el vendedor'}. Por favor, comunícate con ${seller?.name || 'el vendedor'} para coordinar los detalles de la transacción.`
          };
          
          const { data: message, error: messageError } = await supabase
            .from('messages')
            .insert(messageData)
            .select()
            .single();
            
          if (messageError) {
            console.error('Error creating message:', messageError);
          } else {
            // Add the message to local state
            setMessages(prev => [...prev, message]);
            
            // Navigate to the chat detail view for this conversation
            setSelectedConversationId(conversation.id);
            setView('chatDetail');
          }
        }
        
        alert('¡Oferta aceptada con éxito!');
      }
    } catch (error: any) {
      console.error('Unexpected error accepting offer:', error);
      alert(`Error inesperado al aceptar la oferta: ${error.message}`);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      // Update the offer status to 'rejected' in the database
      const { data, error } = await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('id', offerId)
        .select()
        .single();
      
      if (error) {
        console.error('Error rejecting offer:', error);
        alert(`Error al rechazar la oferta: ${error.message}`);
        return;
      }
      
      if (data) {
        // Map the database response back to camelCase for the frontend
        const offerWithCamelCase: Offer = {
          id: data.id,
          itemId: data.item_id,
          itemType: data.item_type,
          buyerEmail: data.buyer_email,
          sellerEmail: data.seller_email,
          offerAmount: data.offer_amount,
          status: data.status,
          timestamp: data.timestamp,
        };
        
        // Update the local state
        setOffers(prev => prev.map(offer => 
          offer.id === offerId ? offerWithCamelCase : offer
        ));
        
        alert('¡Oferta rechazada con éxito!');
      }
    } catch (error: any) {
      console.error('Unexpected error rejecting offer:', error);
      alert(`Error inesperado al rechazar la oferta: ${error.message}`);
    }
  };
  
  const handleCancelSale = async (itemId: string, itemType: 'motorcycle' | 'part') => {
    try {
      // Update the item status to 'for-sale' in the database
      const table = itemType === 'motorcycle' ? 'motorcycles' : 'parts';
      const { data, error } = await supabase
        .from(table)
        .update({ status: 'for-sale', reserved_by: null })
        .eq('id', itemId)
        .select()
        .single();
      
      if (error) {
        console.error('Error canceling sale:', error);
        alert(`Error al cancelar la venta: ${error.message}`);
        return;
      }
      
      if (data) {
        // Update the local state
        if (itemType === 'motorcycle') {
          // Map the database response back to camelCase for the frontend
          const motoWithCamelCase: Motorcycle = {
            id: data.id,
            make: data.make,
            model: data.model,
            year: data.year,
            price: data.price,
            mileage: data.mileage,
            engineSize: data.engine_size,
            description: data.description,
            imageUrls: data.image_urls,
            videoUrl: data.video_url,
            sellerEmail: data.seller_email,
            category: data.category,
            status: data.status,
            location: data.location,
            featured: data.featured,
            reservedBy: data.reserved_by,
            stats: data.stats,
          };
          setMotorcycles(prev => prev.map(moto => 
            moto.id === itemId ? motoWithCamelCase : moto
          ));
        } else {
          // Map the database response back to camelCase for the frontend
          const partWithCamelCase: Part = {
            id: data.id,
            name: data.name,
            price: data.price,
            description: data.description,
            imageUrls: data.image_urls,
            videoUrl: data.video_url,
            sellerEmail: data.seller_email,
            category: data.category,
            condition: data.condition,
            compatibility: data.compatibility,
            status: data.status,
            location: data.location,
            featured: data.featured,
            reservedBy: data.reserved_by,
            stats: data.stats,
          };
          setParts(prev => prev.map(part => 
            part.id === itemId ? partWithCamelCase : part
          ));
        }
        
        // Also update any related offers to 'cancelled' in the database
        await supabase
          .from('offers')
          .update({ status: 'cancelled' })
          .eq('item_id', itemId)
          .eq('status', 'accepted');
        
        // Update the local state for offers
        setOffers(prev => prev.map(offer => 
          offer.itemId === itemId && offer.status === 'accepted' 
            ? { ...offer, status: 'cancelled' } 
            : offer
        ));
        
        alert('¡Venta cancelada y artículo publicado nuevamente!');
      }
    } catch (error: any) {
      console.error('Unexpected error canceling sale:', error);
      alert(`Error inesperado al cancelar la venta: ${error.message}`);
    }
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
  
  const featuredMotorcycles = useMemo(() => motorcycles.filter(moto => moto.featured && (moto.status === 'for-sale' || moto.status === 'reserved')), [motorcycles]);
  const userMotorcycles = useMemo(() => currentUser ? motorcycles.filter(moto => moto.sellerEmail === currentUser.email) : [], [motorcycles, currentUser]);
  const userParts = useMemo(() => currentUser ? parts.filter(part => part.sellerEmail === currentUser.email) : [], [parts, currentUser]);
  const favoriteMotorcycles = useMemo(() => motorcycles.filter(moto => favorites.includes(moto.id)), [motorcycles, favorites]);
  const favoritePartsList = useMemo(() => parts.filter(part => favoriteParts.includes(part.id)), [parts, favoriteParts]);
  const unreadMessagesCount = 0; // Will be implemented with real-time
  const pendingReceivedOffersCount = useMemo(() => {
    if (!currentUser) return 0;
    return offers.filter(o => o.sellerEmail === currentUser.email && o.status === 'pending').length;
  }, [offers, currentUser]);

  const PlaceholderView = ({ title }: { title: string }) => (
    <div className="p-8 text-center h-full flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">{title}</h2>
        <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Esta funcionalidad no está implementada todavía.</p>
    </div>
  );

  if (!currentUser && !isLoading) {
    if (view === 'signup') return <SignUpView onSignUp={handleSignUp} onNavigateToLogin={() => setView('login')} />;
    return <LoginView onLogin={handleLogin} onNavigateToSignUp={() => setView('signup')} />;
  }

  if (isLoading) {
    // Return a spinner, but it will be hidden by the splash screen until isLoading is false.
    return (
        <div className="flex items-center justify-center min-h-screen bg-background-dark">
            <Spinner />
        </div>
    );
  }

  // Handle loading errors
  if (loadingError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark p-4">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">Error al cargar</h2>
          <p className="text-foreground-muted-light dark:text-foreground-muted-dark mb-4">
            {loadingError}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (view) {
      case 'detail': {
        const seller = users.find(u => u.email === selectedMotorcycle?.sellerEmail);
        const pendingOffer = offers.find(o => o.itemId === selectedMotorcycle?.id && o.itemType === 'motorcycle' && o.buyerEmail === currentUser.email && o.status === 'pending');
        if (!selectedMotorcycle || !seller) return <PlaceholderView title="Anuncio no encontrado" />;
        return <MotorcycleDetailView motorcycle={selectedMotorcycle} seller={seller} allMotorcycles={motorcycles} onBack={handleBackToPrevView} onStartChat={handleStartOrGoToChat} isFavorite={favorites.includes(selectedMotorcycle.id)} onToggleFavorite={handleToggleFavorite} onViewPublicProfile={handleViewPublicProfile} onSelectMotorcycle={handleSelectMotorcycle} onOpenOfferModal={handleOpenOfferModal} pendingOffer={pendingOffer} currentUser={currentUser} />;
      }
      case 'partDetail': {
        const seller = users.find(u => u.email === selectedPart?.sellerEmail);
        const pendingOffer = offers.find(o => o.itemId === selectedPart?.id && o.itemType === 'part' && o.buyerEmail === currentUser.email && o.status === 'pending');
        if (!selectedPart || !seller) return <PlaceholderView title="Anuncio no encontrado" />;
        return <PartDetailView part={selectedPart} seller={seller} onBack={handleBackToPrevView} onViewPublicProfile={handleViewPublicProfile} onStartChat={handleStartOrGoToChat} isFavorite={favoriteParts.includes(selectedPart.id)} onToggleFavorite={handleTogglePartFavorite} onOpenOfferModal={handleOpenOfferModal} pendingOffer={pendingOffer} currentUser={currentUser} />;
      }
      case 'sell':
        return <SellForm onBack={() => setView('home')} onPublish={handlePublish} />;
      case 'edit':
        return <EditForm motorcycle={motorcycleToEdit} part={partToEdit} onBack={handleBackToPrevView} onUpdate={handleUpdateItem} />;
      case 'profile':
        return <ProfileView currentUser={currentUser} userMotorcycles={userMotorcycles} userParts={userParts} onGoToSell={() => setView('sell')} onSelectMotorcycle={handleSelectMotorcycle} onSelectPart={handleSelectPart} onLogout={handleLogout} notificationPermission={notificationPermission} onRequestPermission={handleRequestNotificationPermission} onUpdateProfileImage={handleUpdateProfileImage} onEditItem={handleNavigateToEdit} onMarkAsSold={handleMarkAsSold} onPromoteItem={handlePromoteItem} savedSearches={savedSearches} onDeleteSearch={handleDeleteSearch} onNavigateToFavorites={() => setView('favorites')} onCancelSale={handleCancelSale} />;
      case 'publicProfile': {
        const seller = users.find(u => u.email === selectedSellerEmail);
        const sellerMotorcycles = motorcycles.filter(m => m.sellerEmail === selectedSellerEmail);
        const sellerParts = parts.filter(p => p.sellerEmail === selectedSellerEmail);
        if (!seller) return <PlaceholderView title="Vendedor no encontrado" />;
        return <PublicProfileView seller={seller} motorcycles={sellerMotorcycles} parts={sellerParts} onBack={handleBackToPrevView} onSelectMotorcycle={handleSelectMotorcycle} onSelectPart={handleSelectPart} favorites={favorites} onToggleFavorite={handleToggleFavorite} favoriteParts={favoriteParts} onTogglePartFavorite={handleTogglePartFavorite} currentUser={currentUser} userRating={userRatings[seller.email]} onRateUser={handleRateUser} />;
      }
      case 'favorites':
        return <FavoritesView motorcycles={favoriteMotorcycles} parts={favoritePartsList} onSelectMotorcycle={handleSelectMotorcycle} onSelectPart={handleSelectPart} onToggleFavorite={handleToggleFavorite} onTogglePartFavorite={handleTogglePartFavorite} />;
      case 'offers':
        return <OffersView offers={offers} currentUser={currentUser} users={users} motorcycles={motorcycles} parts={parts} onAcceptOffer={handleAcceptOffer} onRejectOffer={handleRejectOffer} onSelectItem={(item) => 'make' in item ? handleSelectMotorcycle(item) : handleSelectPart(item)} onCancelSale={handleCancelSale} />;
      case 'chatList':
        return <ChatListView conversations={conversations.filter(c => c.participants.includes(currentUser.email))} messages={messages} motorcycles={motorcycles} parts={parts} currentUser={currentUser} users={users} onSelectConversation={(convoId) => { setSelectedConversationId(convoId); setView('chatDetail'); }} />;
      case 'chatDetail': {
        const conversation = conversations.find(c => c.id === selectedConversationId);
        if (!conversation) return <PlaceholderView title="Error de Chat" />;
        const item = conversation.motorcycleId ? motorcycles.find(m => m.id === conversation.motorcycleId) : parts.find(p => p.id === conversation.partId);
        if (!item) return <PlaceholderView title="Artículo no encontrado" />;
        return <ChatDetailView conversation={conversation} messages={messages.filter(m => m.conversationId === selectedConversationId).sort((a,b) => a.timestamp - b.timestamp)} item={item} currentUser={currentUser} users={users} onBack={handleBackToPrevView} onSendMessage={handleSendMessage} isTyping={isTyping[selectedConversationId] || false} />;
      }
      case 'home':
      default:
        const areMotoFiltersActive = searchTerm !== '' || locationFilter !== '' || selectedCategory !== 'All' || priceRange.min !== '' || priceRange.max !== '' || yearRange.min !== '' || yearRange.max !== '' || engineSizeCategory !== 'any';
        const arePartFiltersActive = searchTerm !== '' || locationFilter !== '' || selectedPartCategory !== 'All' || priceRange.min !== '' || priceRange.max !== '';
        return (
          <div>
            <div className="p-4 bg-background-light dark:bg-background-dark">
                <div className="flex w-full bg-card-light dark:bg-card-dark p-1 rounded-full border border-border-light dark:border-border-dark">
                    <button onClick={() => setMarketView('motorcycles')} className={`w-1/2 py-2 rounded-full text-sm font-bold transition-colors ${marketView === 'motorcycles' ? 'bg-primary text-white' : 'text-foreground-light dark:text-foreground-dark'}`}> Motos </button>
                    <button onClick={() => setMarketView('parts')} className={`w-1/2 py-2 rounded-full text-sm font-bold transition-colors ${marketView === 'parts' ? 'bg-primary text-white' : 'text-foreground-light dark:text-foreground-dark'}`}> Piezas </button>
                </div>
            </div>
            {marketView === 'motorcycles' ? (
              <MotorcycleList motorcycles={filteredMotorcycles} featuredMotorcycles={featuredMotorcycles} onSelectMotorcycle={handleSelectMotorcycle} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} favorites={favorites} onToggleFavorite={handleToggleFavorite} onAddHeatmapPoint={handleAddHeatmapPoint} searchTerm={searchTerm} onSaveSearch={() => handleSaveSearch('motorcycle')} areFiltersActive={areMotoFiltersActive} />
            ) : (
              <PartList parts={filteredParts} onSelectPart={handleSelectPart} selectedCategory={selectedPartCategory} onSelectCategory={setSelectedPartCategory} onAddHeatmapPoint={handleAddHeatmapPoint} onSaveSearch={() => handleSaveSearch('part')} areFiltersActive={arePartFiltersActive} favorites={favoriteParts} onToggleFavorite={handleTogglePartFavorite} />
            )}
          </div>
        );
    }
  };
  
  const isHeaderVisible = view !== 'detail' && view !== 'partDetail' && view !== 'chatDetail' && view !== 'publicProfile' && view !== 'edit';
  const isBottomNavVisible = view !== 'detail' && view !== 'partDetail' && view !== 'chatDetail' && view !== 'publicProfile' && view !== 'edit';
  const mainContentPadding = isBottomNavVisible ? 'pb-24' : '';


  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark overflow-x-hidden">
      {isHeatmapVisible && <HeatmapOverlay data={heatmapData} />}
      {isHeaderVisible && (
        <Header 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onOpenFilters={() => setIsFilterModalOpen(true)}
            currentView={view}
            isHeatmapVisible={isHeatmapVisible}
            onToggleHeatmap={handleToggleHeatmap}
        />
      )}

      <main className={`flex-grow ${mainContentPadding}`}>
        {renderContent()}
      </main>

      {isBottomNavVisible && (
        <BottomNav 
            currentView={view} 
            onNavigate={handleNavigate} 
            unreadMessagesCount={unreadMessagesCount}
            pendingOffersCount={pendingReceivedOffersCount}
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
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmPublish}
        title="Confirmar Publicación"
        message="¿Estás seguro de que quieres publicar este anuncio? No podrás editarlo después de publicarlo, pero sí podrás marcarlo como vendido."
        confirmText="Sí, Publicar"
      />

      <ConfirmationModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        onConfirm={handleConfirmPromote}
        title="Promocionar Anuncio"
        message="Promocionar tu anuncio lo destacará en la página principal, aumentando su visibilidad. Las estadísticas (vistas, favoritos, chats) se reiniciarán."
        confirmText="Sí, Promocionar"
      />
      
      {itemToMakeOfferOn && (
        <OfferModal
          isOpen={isOfferModalOpen}
          onClose={() => { setIsOfferModalOpen(false); setItemToMakeOfferOn(null); }}
          item={itemToMakeOfferOn}
          onMakeOffer={handleMakeOffer}
        />
      )}

    </div>
  );
};

export default App;
