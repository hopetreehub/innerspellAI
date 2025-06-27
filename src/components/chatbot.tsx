'use client';

import { useState, useRef, useEffect, startTransition } from 'react';
import { getChatbotResponse } from '@/ai/flows/consultant-recommendation-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
    content: "안녕하세요! 이너스펠 AI입니다. 어떤 마음의 짐을 덜고 싶으신가요? 가장 고민되는 주제를 한 가지만 골라주시면, 길을 찾는 데 도움을 드릴게요.",
    options: ['연애/재회/궁합', '직장/사업/재물', '학업/시험', '인간관계', '마음/건강', '기타'],
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (inputRef.current && !isLoading && lastMessage.role === 'assistant' && !lastMessage.recommendations) {
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
      const lastBotMessageIndex = newMessages.findLastIndex(m => m.role === 'assistant');
      if (lastBotMessageIndex !== -1) {
        newMessages[lastBotMessageIndex].options = undefined;
      }
    }
    setMessages(newMessages);
    setIsLoading(true);
    setInputValue('');

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(inputValue);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const showInput = !isLoading && lastMessage.role === 'assistant' && !lastMessage.recommendations;

  return (
    <Card className="w-full h-full shadow-2xl shadow-primary/10 bg-black/40 backdrop-blur-xl border border-white/20 text-white rounded-2xl flex flex-col">
      <CardHeader className="text-center border-b border-white/10 pb-4 flex-shrink-0">
        <CardTitle className="font-headline text-2xl">AI 상담사 추천</CardTitle>
        <CardDescription className="text-white/70">당신의 고민에 가장 잘 맞는 상담사를 찾아드릴게요.</CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-4 md:p-6">
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
                   {message.recommendations && message.recommendations.length > 0 ? (
                      <div className="space-y-4">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                          </ReactMarkdown>
                          <div className="space-y-3 not-prose">
                              {message.recommendations.map((rec) => (
                                  <div key={rec.id} className="space-y-2 bg-black/20 p-3 rounded-xl border border-white/10">
                                      <ConsultantCard consultant={rec} />
                                      <p className="text-xs text-white/80 p-2.5 bg-black/20 rounded-lg border border-white/10">
                                          <strong className="font-semibold text-secondary">AI 추천 이유:</strong> {rec.reason}
                                      </p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                      </ReactMarkdown>
                  )}
                  
                  {message.options && (
                    <div className="flex flex-wrap gap-2 mt-4 not-prose">
                      {message.options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(option, true)}
                          className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-full"
                        >
                          {option}
                        </Button>
                      ))}
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
        </ScrollArea>
      </CardContent>
      
      {showInput && (
        <div className="border-t border-white/10 p-4 flex-shrink-0 bg-black/40 rounded-b-2xl">
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
                    placeholder="자세한 고민을 이야기해주세요..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-secondary min-h-[80px] resize-none pr-14"
                    autoComplete="off"
                    rows={3}
                />
                <Button type="submit" size="icon" className="bg-secondary hover:bg-secondary/90 flex-shrink-0 absolute right-3 bottom-3 h-9 w-9">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">전송</span>
                </Button>
            </form>
        </div>
      )}
    </Card>
  );
}
