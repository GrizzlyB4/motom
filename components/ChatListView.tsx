import React, { useMemo, useState, useEffect } from 'react';
import { ChatConversation, ChatMessage, Motorcycle, User, Part } from '../types';
import { ChatIcon, ArchiveIcon, InboxIcon } from './Icons';

interface ChatListViewProps {
  conversations: ChatConversation[];
  messages: ChatMessage[];
  motorcycles: Motorcycle[];
  parts: Part[];
  currentUser: User;
  users: User[];
  onSelectConversation: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string, archived: boolean) => void;
  showArchivedChats?: boolean;
  onToggleShowArchived?: () => void;
}

const ChatListView: React.FC<ChatListViewProps> = ({ 
  conversations, 
  messages, 
  motorcycles, 
  parts, 
  currentUser, 
  users, 
  onSelectConversation,
  onArchiveConversation,
  showArchivedChats,
  onToggleShowArchived
}) => {
  const [prevShowArchivedChats, setPrevShowArchivedChats] = useState(showArchivedChats);
  const [animationClass, setAnimationClass] = useState('');

  // Handle the transition when showArchivedChats changes
  useEffect(() => {
    if (showArchivedChats !== prevShowArchivedChats) {
      // Determine direction based on the change
      if (showArchivedChats) {
        // Going from active to archived - slide in from right
        setAnimationClass('slide-in-right');
      } else {
        // Going from archived to active - slide in from left
        setAnimationClass('slide-in-left');
      }
      
      // Update the previous state
      setPrevShowArchivedChats(showArchivedChats);
      
      // Reset animation class after animation completes
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [showArchivedChats, prevShowArchivedChats]);

  const conversationsWithDetails = useMemo(() => {
    // Filter conversations based on archived status
    const filteredConversations = showArchivedChats 
      ? conversations.filter(c => c.archived)
      : conversations.filter(c => !c.archived);
      
    return filteredConversations.map(convo => {
      const item = convo.motorcycle_id
        ? motorcycles.find(m => m.id === convo.motorcycle_id)
        : parts.find(p => p.id === convo.part_id);

      const otherParticipantEmail = convo.participants.find(p => p !== currentUser.email);
      const otherParticipant = users.find(u => u.email === otherParticipantEmail);
      // Ensure messages are sorted properly by timestamp (newest first)
      const convoMessages = messages
        .filter(m => m.conversationId === convo.id)
        .sort((a, b) => b.timestamp - a.timestamp);
      const lastMessage = convoMessages[0];
      
      // Count unread messages
      const unreadCount = convoMessages.filter(
        msg => msg.senderEmail !== currentUser.email && !msg.isRead
      ).length;

      return {
        ...convo,
        item,
        otherParticipant,
        lastMessage,
        unreadCount,
      };
    }).sort((a,b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
  }, [conversations, messages, motorcycles, parts, currentUser, users, showArchivedChats]);

  return (
    <div className="max-w-4xl mx-auto">
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(50px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideInLeft {
            from {
              transform: translateX(-50px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .slide-in-right {
            animation: slideInRight 0.3s ease-out forwards;
          }
          
          .slide-in-left {
            animation: slideInLeft 0.3s ease-out forwards;
          }
        `}
      </style>
      
      {/* Toggle button for archived chats */}
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">
          {showArchivedChats ? 'Chats Archivados' : 'Chats Activos'}
        </h2>
        <button 
          onClick={onToggleShowArchived}
          className="flex items-center gap-2 px-4 py-2 bg-card-light dark:bg-card-dark rounded-lg hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors"
        >
          {showArchivedChats ? (
            <>
              <InboxIcon className="w-5 h-5" />
              <span>Ver Chats Activos</span>
            </>
          ) : (
            <>
              <ArchiveIcon className="w-5 h-5" />
              <span>Ver Archivados</span>
            </>
          )}
        </button>
      </div>
      
      <div className={animationClass}>
        {conversationsWithDetails.length > 0 ? (
          <div className="space-y-2 p-2">
            {conversationsWithDetails.map(convo => (
              <div 
                  key={convo.id} 
                  onClick={() => onSelectConversation(convo.id)} 
                  className="bg-card-light dark:bg-card-dark p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-all duration-300 ease-in-out transform hover:translate-x-1 relative"
              >
                {convo.item && (
                  <img 
                      src={convo.item.imageUrls[0]} 
                      alt={'make' in convo.item ? `${convo.item.make} ${convo.item.model}` : convo.item.name}
                      className="w-20 h-16 object-cover rounded-lg flex-shrink-0" 
                  />
                )}
                <div className="flex-grow overflow-hidden">
                  <p className="font-bold truncate">{convo.item && ('make' in convo.item ? `${convo.item.make} ${convo.item.model}` : convo.item.name)}</p>
                  <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark truncate">
                      Chat con {convo.otherParticipant?.name || convo.otherParticipant?.email}
                  </p>
                  {convo.lastMessage && (
                    <p className="text-sm text-foreground-light dark:text-foreground-dark truncate mt-1">
                      {convo.lastMessage.senderEmail === currentUser.email ? (
                        <>
                          <span className="font-semibold">Tú: </span>
                          {convo.lastMessage.text}
                        </>
                      ) : (
                        convo.lastMessage.text
                      )}
                    </p>
                  )}
                </div>
                {convo.unreadCount > 0 && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {convo.unreadCount}
                  </div>
                )}
                <div className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">
                  {convo.lastMessage && new Date(convo.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {/* Archive/Unarchive button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchiveConversation && onArchiveConversation(convo.id, !convo.archived);
                  }}
                  className="absolute top-2 right-10 p-1 rounded-full hover:bg-black/[.05] dark:hover:bg-white/[.1] transition-colors"
                  title={convo.archived ? "Desarchivar conversación" : "Archivar conversación"}
                >
                  <ArchiveIcon className={`w-5 h-5 ${convo.archived ? 'text-foreground-light dark:text-foreground-dark' : 'text-foreground-muted-light dark:text-foreground-muted-dark'}`} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <ChatIcon className="w-16 h-16 mx-auto text-foreground-muted-light dark:text-foreground-muted-dark mb-4"/>
            <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">
              {showArchivedChats ? 'No tienes chats archivados' : 'No tienes chats activos'}
            </h3>
            <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">
              {showArchivedChats 
                ? 'Los chats que archivas aparecerán aquí.' 
                : 'Inicia una conversación desde cualquier anuncio.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListView;