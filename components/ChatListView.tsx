import React, { useMemo } from 'react';
import { ChatConversation, ChatMessage, Motorcycle, User } from '../types';
import { ChatIcon } from './Icons';

interface ChatListViewProps {
  conversations: ChatConversation[];
  messages: ChatMessage[];
  motorcycles: Motorcycle[];
  currentUser: User;
  onSelectConversation: (conversationId: string) => void;
}

const ChatListView: React.FC<ChatListViewProps> = ({ conversations, messages, motorcycles, currentUser, onSelectConversation }) => {

  const conversationsWithDetails = useMemo(() => {
    return conversations.map(convo => {
      const motorcycle = motorcycles.find(m => m.id === convo.motorcycleId);
      const otherParticipant = convo.participants.find(p => p !== currentUser.email);
      const convoMessages = messages
        .filter(m => m.conversationId === convo.id)
        .sort((a, b) => b.timestamp - a.timestamp);
      const lastMessage = convoMessages[0];

      return {
        ...convo,
        motorcycle,
        otherParticipant,
        lastMessage,
      };
    }).sort((a,b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
  }, [conversations, messages, motorcycles, currentUser]);

  return (
    <div className="max-w-4xl mx-auto">
      {conversationsWithDetails.length > 0 ? (
        <div className="space-y-2 p-2">
          {conversationsWithDetails.map(convo => (
            <div 
                key={convo.id} 
                onClick={() => onSelectConversation(convo.id)} 
                className="bg-card-light dark:bg-card-dark p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors"
            >
              {convo.motorcycle && (
                <img 
                    src={convo.motorcycle.imageUrls[0]} 
                    alt={`${convo.motorcycle.make} ${convo.motorcycle.model}`} 
                    className="w-20 h-16 object-cover rounded-lg flex-shrink-0" 
                />
              )}
              <div className="flex-grow overflow-hidden">
                <p className="font-bold truncate">{convo.motorcycle?.make} {convo.motorcycle?.model}</p>
                <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark truncate">
                    Chat con {convo.otherParticipant}
                </p>
                {convo.lastMessage && (
                  <p className="text-sm text-foreground-light dark:text-foreground-dark truncate mt-1">
                    {convo.lastMessage.senderEmail === currentUser.email && 'Tú: '}{convo.lastMessage.text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4">
          <ChatIcon className="w-16 h-16 mx-auto text-foreground-muted-light dark:text-foreground-muted-dark mb-4"/>
          <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">No tienes chats activos</h3>
          <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Inicia una conversación desde cualquier anuncio.</p>
        </div>
      )}
    </div>
  );
};

export default ChatListView;
