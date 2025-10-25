import React, { useMemo } from 'react';
import { ChatConversation, ChatMessage, Motorcycle, User, Part } from '../types';
import { ChatIcon, ArchiveIcon, InboxIcon } from './Icons';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle button for archived chats */}
      <div className="flex justify-between items-center p-4">
        <motion.h2 
          className="text-xl font-bold text-foreground-light dark:text-foreground-dark"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {showArchivedChats ? 'Chats Archivados' : 'Chats Activos'}
        </motion.h2>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onToggleShowArchived}
          className="flex items-center gap-2 px-4 py-2 bg-card-light dark:bg-card-dark rounded-lg hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors"
          whileHover={{ y: -2 }}
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
        </motion.button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {conversationsWithDetails.length > 0 ? (
          <div className="space-y-2 p-2">
            {conversationsWithDetails.map((convo, index) => (
              <motion.div 
                  key={convo.id} 
                  onClick={() => onSelectConversation(convo.id)} 
                  className="bg-card-light dark:bg-card-dark p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-all duration-300 ease-in-out relative"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
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
                  <motion.div 
                    className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {convo.unreadCount}
                  </motion.div>
                )}
                <div className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">
                  {convo.lastMessage && new Date(convo.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {/* Archive/Unarchive button */}
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchiveConversation && onArchiveConversation(convo.id, !convo.archived);
                  }}
                  className="absolute top-2 right-10 p-1 rounded-full hover:bg-black/[.05] dark:hover:bg-white/[.1] transition-colors"
                  title={convo.archived ? "Desarchivar conversación" : "Archivar conversación"}
                  whileHover={{ scale: 1.1 }}
                >
                  <ArchiveIcon className={`w-5 h-5 ${convo.archived ? 'text-foreground-light dark:text-foreground-dark' : 'text-foreground-muted-light dark:text-foreground-muted-dark'}`} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ChatIcon className="w-16 h-16 mx-auto text-foreground-muted-light dark:text-foreground-muted-dark" />
            <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mt-4">
              {showArchivedChats ? 'No hay chats archivados' : 'No hay chats activos'}
            </h3>
            <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">
              {showArchivedChats ? 'Tus chats archivados aparecerán aquí.' : 'Tus conversaciones aparecerán aquí.'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChatListView;