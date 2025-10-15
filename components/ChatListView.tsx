import React, { useMemo } from 'react';
import { ChatConversation, ChatMessage, Motorcycle, User, Part } from '../types';
import { ChatIcon } from './Icons';

interface ChatListViewProps {
  conversations: ChatConversation[];
  messages: ChatMessage[];
  motorcycles: Motorcycle[];
  parts: Part[];
  currentUser: User;
  users: User[];
  onSelectConversation: (conversationId: string) => void;
}

const ChatListView: React.FC<ChatListViewProps> = ({ conversations, messages, motorcycles, parts, currentUser, users, onSelectConversation }) => {

  const conversationsWithDetails = useMemo(() => {
    return conversations.map(convo => {
      const item = convo.motorcycleId
        ? motorcycles.find(m => m.id === convo.motorcycleId)
        : parts.find(p => p.id === convo.partId);

      const otherParticipantEmail = convo.participants.find(p => p !== currentUser.email);
      const otherParticipant = users.find(u => u.email === otherParticipantEmail);
      const convoMessages = messages
        .filter(m => m.conversationId === convo.id)
        .sort((a, b) => b.timestamp - a.timestamp);
      const lastMessage = convoMessages[0];

      return {
        ...convo,
        item,
        otherParticipant,
        lastMessage,
      };
    }).sort((a,b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
  }, [conversations, messages, motorcycles, parts, currentUser, users]);

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