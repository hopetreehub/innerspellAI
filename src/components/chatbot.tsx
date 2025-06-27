
'use client';

import { useState, useRef, useEffect, startTransition } from 'react';
import { getChatbotResponse } from '@/ai/flows/consultant-recommendation-flow'; 
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, CircleDashed, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Consultant } from '@/types/consultant';
import { ConsultantCard } from './consultant-card';

type Recommendation = {
  id: string;
  reason: string;
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Recommendation[];
};

export function Chatbot({ consultants }: { consultants: Consultant[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Fetch the initial message from the AI when the component mounts
    const getInitialMessage = async () => {
      try {
        const result = await getChatbotResponse({ messages: [] });
        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.response,
          recommendations: result.recommendations,
        };
        setMessages([botMessage]);
      } catch (error) {
        console.error('Error getting initial chatbot response:', error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '죄송합니다. 챗봇을 시작하는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
        };
        setMessages([errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };
    getInitialMessage();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !isLoading && lastMessage.role === 'assistant') {
        const hasRecommendations = lastMessage.recommendations && lastMessage.recommendations.length > 0;
        if (inputRef.current && !hasRecommendations) {
          inputRef.current.focus();
        }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (isLoading || !content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setInputValue('');

    startTransition(async () => {
      try {
        const history = newMessages.map(({ role, content }) => ({ role, content }));
        const result = await getChatbotResponse({ messages: history }); 
        
        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.response,
          recommendations: result.recommendations,
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error getting chatbot response:', error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '죄송합니다. 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(inputValue);
    }
  };
  
  const lastMessage = messages[messages.length - 1];
  const hasRecommendations = lastMessage?.recommendations && lastMessage.recommendations.length > 0;

  return (
    <Card className="w-full h-full shadow-2xl shadow-primary/10 bg-black/40 backdrop-blur-xl border border-white/20 text-white rounded-2xl flex flex-col overflow-hidden">
      <CardHeader className="text-center border-b border-white/10 pb-4 flex-shrink-0">
        <CardTitle className="font-headline text-2xl">AI 상담사 추천</CardTitle>
        <CardDescription className="text-white/70">당신의 고민에 가장 잘 맞는 상담사를 찾아드릴게요.</CardDescription>
      </CardHeader>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-9 h-9 border-2 border-secondary/50">
                  <AvatarFallback className="bg-transparent">
                    <Bot className="w-5 h-5 text-secondary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-2xl p-3 px-4 max-w-md lg:max-w-lg prose prose-sm prose-invert break-words ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-lg'
                    : 'bg-white/10 rounded-bl-lg'
                }`}
              >
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                 </ReactMarkdown>
                
                 {message.recommendations && message.recommendations.length > 0 && (
                    <div className="mt-4 space-y-3 not-prose">
                        {message.recommendations.map(rec => {
                            const consultant = consultants.find(c => c.id === rec.id);
                            if (!consultant) return null;
                            return (
                                <div key={rec.id}>
                                    <div className="bg-background/20 rounded-lg border border-white/20">
                                        <ConsultantCard consultant={consultant as Consultant} />
                                    </div>
                                    <p className="text-xs text-white/80 italic mt-2 px-2">
                                        <strong>추천 이유:</strong> {rec.reason}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-9 h-9 border-white/30">
                  <AvatarFallback className="bg-transparent">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3">
                <Avatar className="w-9 h-9 border-2 border-secondary/50">
                    <AvatarFallback className="bg-transparent">
                      <Bot className="w-5 h-5 text-secondary" />
                    </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl p-3 px-4 max-w-sm bg-white/10 flex items-center gap-2 rounded-bl-lg">
                    <CircleDashed className="w-4 h-4 animate-spin" />
                    <p className="text-sm text-white/70">AI가 답변을 생각하고 있어요...</p>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t border-white/10 p-4 flex-shrink-0 bg-black/40">
          <form
              onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
              }}
              className="relative"
          >
              <Textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isLoading ? "AI가 답변을 생각하고 있어요..." :
                    hasRecommendations ? "추천이 완료되었습니다. 상담사를 선택해주세요." :
                    "자세한 고민을 이야기해주세요..."
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-secondary min-h-[80px] resize-none pr-14"
                  autoComplete="off"
                  rows={3}
                  disabled={isLoading || hasRecommendations}
              />
              <Button type="submit" size="icon" className="bg-secondary hover:bg-secondary/90 flex-shrink-0 absolute right-3 bottom-3 h-9 w-9" disabled={isLoading || hasRecommendations || !inputValue.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">전송</span>
              </Button>
          </form>
      </div>
    </Card>
  );
}
