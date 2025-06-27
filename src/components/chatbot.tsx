
'use client';

import { useState, useRef, useEffect, startTransition } from 'react';
import { getChatbotResponse } from '@/ai/flows/consultant-recommendation-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, CircleDashed, Send } from 'lucide-react';
import { ConsultantCard } from './consultant-card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Consultant } from '@/types/consultant';

type RecommendedConsultant = Consultant & { reason: string };

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
  recommendations?: RecommendedConsultant[];
};

export function Chatbot({ consultants }: { consultants: Consultant[] }) {
  const initialMessage: Message = {
    id: 'init',
    role: 'assistant',
    content: "안녕하세요! '이너스펠 AI'입니다. 어떤 고민이 있으신가요? 가장 잘 맞는 상담사를 찾아드릴게요.",
    options: ['연애/궁합', '직업/사업', '금전/재물', '인간관계', '기타'],
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (inputRef.current && !isLoading && lastMessage.role === 'assistant' && !lastMessage.options) {
      inputRef.current.focus();
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string, isOptionClick = false) => {
    if (isLoading || !content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    const newMessages = [...messages, userMessage];
    if (isOptionClick) {
      // Find the message with options and remove them
      const lastBotMessageIndex = newMessages.findLastIndex(m => m.role === 'assistant');
      if (lastBotMessageIndex !== -1) {
        newMessages[lastBotMessageIndex].options = undefined;
      }
    }
    setMessages(newMessages);
    setIsLoading(true);

    if (!isOptionClick) {
      setInputValue('');
    }

    startTransition(async () => {
      try {
        const history = newMessages.map(({ role, content }) => ({ role, content }));
        const result = await getChatbotResponse({ messages: history, consultants });
        
        const recommendedConsultants: RecommendedConsultant[] | undefined = result.recommendations
          ?.map(rec => {
            const consultant = consultants.find(c => c.id === rec.id);
            return consultant ? { ...consultant, reason: rec.reason } : null;
          })
          .filter((c): c is RecommendedConsultant => c !== null);

        const optionRegex = /\[([^\]]+)\]/g;
        const extractedOptions = [...result.response.matchAll(optionRegex)].map(match => match[1]);
        const cleanedResponse = result.response.replace(optionRegex, '').trim();

        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: cleanedResponse,
          options: extractedOptions.length > 0 ? extractedOptions : undefined,
          recommendations: recommendedConsultants,
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

  const lastMessage = messages[messages.length - 1];
  const showInput = !isLoading && lastMessage.role === 'assistant' && !lastMessage.options && !lastMessage.recommendations;

  return (
    <Card className="w-full shadow-2xl shadow-primary/10 bg-black/30 backdrop-blur-md border-white/20 text-white">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">AI 상담사 추천</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] flex flex-col">
          <ScrollArea
            className="flex-1 pr-4 -mr-4"
            ref={scrollAreaRef}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 border-white/30">
                      <AvatarFallback className="bg-transparent">
                        <Bot className="w-5 h-5 text-secondary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-xl p-3 max-w-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white/10'
                    }`}
                  >
                     {message.recommendations && message.recommendations.length > 0 ? (
                        <div className="space-y-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm prose-invert break-words">
                                {message.content}
                            </ReactMarkdown>
                            <div className="space-y-3">
                                {message.recommendations.map((rec) => (
                                    <div key={rec.id} className="space-y-2 bg-black/20 p-3 rounded-lg">
                                        <ConsultantCard consultant={rec} />
                                        <p className="text-xs text-white/80 p-2 bg-black/20 rounded-md">
                                            <strong className="font-semibold text-secondary">AI 추천 이유:</strong> {rec.reason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm prose-invert break-words">
                            {message.content}
                        </ReactMarkdown>
                    )}
                    
                    {message.options && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.options.map((option) => (
                          <Button
                            key={option}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendMessage(option, true)}
                            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 border-white/30">
                      <AvatarFallback className="bg-transparent">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border-white/30">
                        <AvatarFallback className="bg-transparent">
                          <Bot className="w-5 h-5 text-secondary" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="rounded-xl p-3 max-w-sm bg-white/10 flex items-center gap-2">
                        <CircleDashed className="w-4 h-4 animate-spin" />
                        <p className="text-sm text-white/70">AI가 답변을 생각하고 있어요...</p>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        {showInput && (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                }}
                className="mt-4 flex items-center gap-2 border-t border-white/20 pt-4"
            >
                <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="질문을 입력해주세요..."
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:ring-secondary"
                    autoComplete="off"
                />
                <Button type="submit" size="icon" className="bg-secondary hover:bg-secondary/90 flex-shrink-0">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">전송</span>
                </Button>
            </form>
        )}
      </CardContent>
    </Card>
  );
}
