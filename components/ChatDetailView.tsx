
import React, { useState, useEffect, useRef } from 'react';
import { ChatConversation, ChatMessage, Motorcycle, User, Part } from '../types';
import { ArrowLeftIcon, SendIcon } from './Icons';

interface ChatDetailViewProps {
  conversation: ChatConversation;
  messages: ChatMessage[];
  item: Motorcycle | Part;
  currentUser: User;
  users: User[];
  onBack: () => void;
  onSendMessage: (conversationId: string, text: string) => void;
  isTyping: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center gap-1.5 p-1">
        <span className="w-2 h-2 bg-foreground-muted-light dark:bg-foreground-muted-dark rounded-full animate-pulse-fast" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-foreground-muted-light dark:bg-foreground-muted-dark rounded-full animate-pulse-fast" style={{ animationDelay: '0.15s' }}></span>
        <span className="w-2 h-2 bg-foreground-muted-light dark:bg-foreground-muted-dark rounded-full animate-pulse-fast" style={{ animationDelay: '0.3s' }}></span>
    </div>
);

const ChatDetailView: React.FC<ChatDetailViewProps> = ({ conversation, messages, item, currentUser, users, onBack, onSendMessage, isTyping }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipantEmail = conversation.participants.find(p => p !== currentUser.email);
  const otherParticipant = users.find(u => u.email === otherParticipantEmail);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(conversation.id, inputText.trim());
      setInputText('');
    }
  };

  const itemName = 'make' in item ? `${item.make} ${item.model}` : item.name;

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
        <style>{`
            @keyframes pulse-fast {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            .animate-pulse-fast {
                animation: pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
        `}</style>
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <div className="px-4 py-3 h-[57px] flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeftIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark" />
          </button>
          <img src={item.imageUrls[0]} alt={itemName} className="w-10 h-10 object-cover rounded-md" />
          <div>
             <h2 className="font-bold text-foreground-light dark:text-foreground-dark leading-tight">{itemName}</h2>
             <p className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">Chat con {otherParticipant?.name || otherParticipantEmail}</p>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderEmail === currentUser.email;
          return (
            <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-primary text-white rounded-br-lg' : 'bg-card-light dark:bg-card-dark rounded-bl-lg'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}
        {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-card-light dark:bg-card-dark rounded-bl-lg">
                <TypingIndicator />
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 form-input w-full px-4 py-3 rounded-full bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark placeholder-foreground-muted-light dark:placeholder-foreground-muted-dark focus:ring-2 focus:ring-primary focus:border-primary"
            autoComplete="off"
          />
          <button type="submit" className="bg-primary text-white p-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!inputText.trim()}>
            <SendIcon className="w-6 h-6"/>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatDetailView;