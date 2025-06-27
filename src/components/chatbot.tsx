
'use client';

import { useState, useRef, useEffect, startTransition } from 'react';
import { getChatbotResponse } from '@/ai/flows/consultant-recommendation-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, CircleDashed } from 'lucide-react';
import { ConsultantCard } from './consultant-card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Consultant } from '@/types/consultant';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
  isRecommendation?: boolean;
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (content: string, isOptionClick = false) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    const newMessages = [...messages, userMessage];
    if (isOptionClick) {
      newMessages[newMessages.length - 2].options = undefined;
    }
    setMessages(newMessages);
    setIsLoading(true);

    startTransition(async () => {
      try {
        const history = newMessages.map(({ id, isRecommendation, ...rest }) => rest);
        const result = await getChatbotResponse({ messages: history, consultants });
        
        const optionRegex = /\[([^\]]+)\]/g;
        const extractedOptions = [...result.response.matchAll(optionRegex)].map(match => match[1]);
        const cleanedResponse = result.response.replace(optionRegex, '').trim();

        const recommendedConsultant = consultants.find(c => cleanedResponse.includes(c.name));

        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: cleanedResponse,
          options: extractedOptions.length > 0 ? extractedOptions : undefined,
          isRecommendation: !!recommendedConsultant,
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

  return (
    <Card className="w-full shadow-2xl shadow-primary/10 bg-black/30 backdrop-blur-md border-white/20 text-white">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">AI 상담사 추천</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex flex-col">
          <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
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
                    {message.isRecommendation ? (
                        <RecommendationContent message={message.content} consultants={consultants} />
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
      </CardContent>
    </Card>
  );
}

function RecommendationContent({ message, consultants }: { message: string, consultants: Consultant[] }) {
    const recommendedConsultant = consultants.find(c => message.includes(c.name));

    if (!recommendedConsultant) {
        return <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm prose-invert break-words">{message}</ReactMarkdown>;
    }
    
    const parts = message.split(recommendedConsultant.name);
    const beforeText = parts[0];
    const afterText = recommendedConsultant.name + parts.slice(1).join(recommendedConsultant.name);

    return (
        <div className="space-y-3">
             <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm prose-invert break-words">{beforeText}</ReactMarkdown>
            <div className="my-4">
                <ConsultantCard consultant={recommendedConsultant} />
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm prose-invert break-words">{afterText.replace(recommendedConsultant.name, '')}</ReactMarkdown>
        </div>
    )
}

    