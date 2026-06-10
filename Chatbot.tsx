import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { useChatMessages } from '@/hooks/useFarmer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, Trash2, Sprout, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { getLoginUrl } from '@/const';
import { toast } from 'sonner';

interface Message {
  id: string;
  userMessage: string;
  assistantResponse: string;
  timestamp: Date;
}

export default function Chatbot() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isSending, error } = useChatMessages();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = input;
    setInput('');

    // Add user message to UI
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: tempId,
      userMessage,
      assistantResponse: '',
      timestamp: new Date(),
    }]);

    try {
      // Send to LLM backend
      const response = await sendMessage(userMessage, language as 'en' | 'hi' | 'gu');
      
      // Update with AI response
      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, assistantResponse: response.assistantResponse }
          : msg
      ));
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message. Please try again.');
      // Remove the message if it failed
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear all messages?')) {
      setMessages([]);
      toast.success('Chat cleared');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/' as any);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const exampleQueries = [
    t.chatbot.example1,
    t.chatbot.example2,
    t.chatbot.example3,
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container max-w-3xl flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation('/' as any)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Sprout className="w-6 h-6 text-accent" />
              <h1 className="text-xl font-bold">{t.chatbot.title}</h1>
            </div>
          </div>
          <Button onClick={handleClearChat} variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            {t.chatbot.clearChat}
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl py-8">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Sprout className="w-16 h-16 text-accent/50 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{t.chatbot.title}</h2>
              <p className="text-muted-foreground mb-8">{t.chatbot.subtitle}</p>
              
              <div className="bg-card rounded-lg p-6 border border-border mb-8">
                <h3 className="font-semibold mb-4 text-left">{t.chatbot.exampleQueries}</h3>
                <div className="space-y-2">
                  {exampleQueries.map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(query)}
                      className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors border border-border text-sm"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-accent text-accent-foreground rounded-lg p-4 max-w-xs lg:max-w-md">
                      <p className="text-sm">{msg.userMessage}</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  {msg.assistantResponse && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-foreground rounded-lg p-4 max-w-xs lg:max-w-md">
                        <p className="text-sm whitespace-pre-wrap">{msg.assistantResponse}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-lg p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card sticky bottom-0">
        <div className="container max-w-3xl py-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatbot.typePlaceholder}
              disabled={isSending}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={isSending || !input.trim()}
              className="btn-primary"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
