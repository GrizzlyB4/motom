import React, { useState, useEffect, useRef } from 'react';
import { ChatConversation, ChatMessage, Motorcycle, User } from '../types';
import { ArrowLeftIcon, SendIcon } from './Icons';

interface ChatDetailViewProps {
  conversation: ChatConversation;
  messages: ChatMessage[];
  motorcycle: Motorcycle;
  currentUser: User;
  onBack: () => void;
  onSendMessage: (conversationId: string, text: string) => void;
}

const ChatDetailView: React.FC<ChatDetailViewProps> = ({ conversation, messages, motorcycle, currentUser, onBack, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participants.find(p => p !== currentUser.email);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(conversation.id, inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <div className="px-4 py-3 h-[57px] flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeftIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark" />
          </button>
          <img src={motorcycle.imageUrls[0]} alt={motorcycle.model} className="w-10 h-10 object-cover rounded-md" />
          <div>
             <h2 className="font-bold text-foreground-light dark:text-foreground-dark leading-tight">{motorcycle.make} {motorcycle.model}</h2>
             <p className="text-xs text-foreground-muted-light dark:text-foreground-muted-dark">Chat con {otherParticipant}</p>
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
