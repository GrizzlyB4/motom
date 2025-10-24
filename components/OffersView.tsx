import React, { useState, useMemo } from 'react';
import { Offer, User, Motorcycle, Part } from '../types';
import { CheckIcon, XIcon, BellIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';

interface OffersViewProps {
  offers: Offer[];
  currentUser: User;
  users: User[];
  motorcycles: Motorcycle[];
  parts: Part[];
  onAcceptOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  onSelectItem: (item: Motorcycle | Part) => void;
  onCancelSale: (itemId: string, itemType: 'motorcycle' | 'part') => void;
}

const OffersView: React.FC<OffersViewProps> = ({ offers, currentUser, users, motorcycles, parts, onAcceptOffer, onRejectOffer, onSelectItem, onCancelSale }) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [showHistory, setShowHistory] = useState(false);

  const enrichedOffers = useMemo(() => {
    return offers.map(offer => {
      const item = offer.itemType === 'motorcycle'
        ? motorcycles.find(m => m.id === offer.itemId)
        : parts.find(p => p.id === offer.itemId);
      const buyer = users.find(u => u.email === offer.buyerEmail);
      const seller = users.find(u => u.email === offer.sellerEmail);
      return { ...offer, item, buyer, seller };
    }).sort((a,b) => b.timestamp - a.timestamp);
  }, [offers, motorcycles, parts, users]);

  const receivedOffers = enrichedOffers.filter(o => o.sellerEmail === currentUser.email);
  const sentOffers = enrichedOffers.filter(o => o.buyerEmail === currentUser.email);
  
  // Separate active and historical offers
  const isActiveOffer = (offer: any) => {
    // Active offers are those that are not cancelled and either:
    // 1. The item is not sold, or
    // 2. The item is sold but the offer is not accepted
    return offer.status !== 'cancelled' && 
           (offer.item?.status !== 'sold' || offer.status !== 'accepted');
  };
  
  const activeReceivedOffers = receivedOffers.filter(isActiveOffer);
  const historicalReceivedOffers = receivedOffers.filter(offer => !isActiveOffer(offer));
  
  const activeSentOffers = sentOffers.filter(isActiveOffer);
  const historicalSentOffers = sentOffers.filter(offer => !isActiveOffer(offer));
  
  const StatusBadge: React.FC<{ status: 'pending' | 'accepted' | 'rejected' | 'cancelled' }> = ({ status }) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-500',
      accepted: 'bg-green-500/10 text-green-500',
      rejected: 'bg-red-500/10 text-red-500',
      cancelled: 'bg-gray-500/10 text-gray-500',
    };
    const text = {
      pending: 'Pendiente',
      accepted: 'Aceptada',
      rejected: 'Rechazada',
      cancelled: 'Cancelada',
    };
    return <span className={`text-xs font-bold px-2 py-1 rounded-full ${styles[status]}`}>{text[status]}</span>;
  };

  const OfferCard: React.FC<{ offer: typeof enrichedOffers[0], type: 'received' | 'sent' }> = ({ offer, type }) => {
    if (!offer.item) return null;
    const itemName = 'make' in offer.item ? `${offer.item.make} ${offer.item.model}` : offer.item.name;
    const otherParty = type === 'received' ? offer.buyer : offer.seller;
    
    return (
        <div className="bg-card-light dark:bg-card-dark p-3 rounded-xl shadow-sm border border-border-light dark:border-border-dark space-y-3">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectItem(offer.item!)}>
                <img src={offer.item.imageUrls[0]} alt={itemName} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                    <p className="font-bold truncate">{itemName}</p>
                    <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">
                        {type === 'received' ? `Oferta de ${otherParty?.name}` : `Oferta a ${otherParty?.name}`}
                    </p>
                </div>
                <StatusBadge status={offer.status} />
            </div>
            <div className="flex justify-between items-center bg-background-light dark:bg-background-dark p-3 rounded-lg">
                <div>
                    <p className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">Precio Original</p>
                    <p className="font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(offer.item.price)}</p>
                </div>
                 <div>
                    <p className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark text-right">Tu Oferta</p>
                    <p className="font-bold text-lg text-primary text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(offer.offerAmount)}</p>
                </div>
            </div>
            {type === 'received' && offer.status === 'pending' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button onClick={() => onRejectOffer(offer.id)} className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 font-bold py-2 px-4 rounded-lg hover:bg-red-500/20 transition-colors">
                        <XIcon className="w-5 h-5" /> Rechazar
                    </button>
                    <button onClick={() => onAcceptOffer(offer.id)} className="flex items-center justify-center gap-2 bg-green-500/10 text-green-500 font-bold py-2 px-4 rounded-lg hover:bg-green-500/20 transition-colors">
                        <CheckIcon className="w-5 h-5" /> Aceptar
                    </button>
                </div>
            )}
             {type === 'received' && offer.status === 'accepted' && (
                <div className="pt-2">
                    <button onClick={() => onCancelSale(offer.itemId, offer.itemType)} className="w-full text-center bg-orange-500/10 text-orange-500 font-bold py-2 px-4 rounded-lg hover:bg-orange-500/20 transition-colors">
                        Cancelar Venta y Volver a Publicar
                    </button>
                </div>
            )}
        </div>
    );
  };
  
  const CollapsedOfferCard: React.FC<{ offer: typeof enrichedOffers[0], type: 'received' | 'sent' }> = ({ offer, type }) => {
    if (!offer.item) return null;
    const itemName = 'make' in offer.item ? `${offer.item.make} ${offer.item.model}` : offer.item.name;
    const otherParty = type === 'received' ? offer.buyer : offer.seller;
    
    return (
        <div className="bg-card-light dark:bg-card-dark p-3 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectItem(offer.item!)}>
                <img src={offer.item.imageUrls[0]} alt={itemName} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                    <p className="font-bold truncate text-sm">{itemName}</p>
                    <p className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark truncate">
                        {type === 'received' ? `De ${otherParty?.name}` : `A ${otherParty?.name}`}
                    </p>
                </div>
                <StatusBadge status={offer.status} />
            </div>
        </div>
    );
  };
  
  const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-20 px-4">
        <BellIcon className="w-16 h-16 mx-auto text-foreground-muted-light dark:text-foreground-muted-dark mb-4"/>
        <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Sin ofertas</h3>
        <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">{message}</p>
    </div>
  );
  
  const offersToDisplay = activeTab === 'received' ? activeReceivedOffers : activeSentOffers;
  const historicalOffers = activeTab === 'received' ? historicalReceivedOffers : historicalSentOffers;
  const emptyMessage = activeTab === 'received' ? "Aquí aparecerán las ofertas que recibas por tus artículos." : "Aquí aparecerán las ofertas que envíes.";

  return (
    <div className="max-w-4xl mx-auto p-4">
       <div className="flex w-full bg-card-light dark:bg-card-dark p-1 rounded-full border border-border-light dark:border-border-dark mb-6">
            <button onClick={() => setActiveTab('received')} className={`w-1/2 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'received' ? 'bg-primary text-white' : 'text-foreground-light dark:text-foreground-dark'}`}>
                Recibidas ({receivedOffers.length})
            </button>
            <button onClick={() => setActiveTab('sent')} className={`w-1/2 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'sent' ? 'bg-primary text-white' : 'text-foreground-light dark:text-foreground-dark'}`}>
                Enviadas ({sentOffers.length})
            </button>
        </div>
        
        {offersToDisplay.length > 0 ? (
            <div className="space-y-4">
                {offersToDisplay.map(offer => (
                    <OfferCard key={offer.id} offer={offer} type={activeTab} />
                ))}
                
                {/* History Section */}
                {historicalOffers.length > 0 && (
                    <div className="mt-8">
                        <button 
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center justify-between w-full p-3 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark"
                        >
                            <span className="font-bold text-foreground-light dark:text-foreground-dark">
                                Historial de Ofertas ({historicalOffers.length})
                            </span>
                            {showHistory ? (
                                <ChevronUpIcon className="w-5 h-5 text-foreground-light dark:text-foreground-dark" />
                            ) : (
                                <ChevronDownIcon className="w-5 h-5 text-foreground-light dark:text-foreground-dark" />
                            )}
                        </button>
                        
                        {showHistory && (
                            <div className="mt-4 space-y-4">
                                {historicalOffers.map(offer => (
                                    <CollapsedOfferCard key={offer.id} offer={offer} type={activeTab} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <EmptyState message={emptyMessage} />
        )}
    </div>
  );
};

export default OffersView;