
'use client';

import { useState } from 'react';
import { ConsultantCard } from '@/components/consultant-card';
import { DailySpellCard } from '@/components/daily-spell-card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Chatbot } from '@/components/chatbot';
import { ArrowRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { consultants } from '@/lib/consultants';
import type { Consultant } from '@/types/consultant';

type Content = {
  id: string;
  title: string;
  category: string;
  image: string;
  dataAiHint?: string;
};

const latestContent: Content[] = [
    { id: '1', title: "수성 역행: 생존 가이드", category: "점성술", image: "https://placehold.co/800x450.png", dataAiHint: 'planets orbit' },
    { id: '2', title: "타로의 연인 카드 이해하기", category: "타로", image: "https://placehold.co/800x450.png", dataAiHint: 'lovers hands' },
    { id: '3', title: "당신의 인생 경로 숫자 찾기", category: "수비학", image: "https://placehold.co/800x450.png", dataAiHint: 'ancient script' },
    { id: '4', title: "초심자를 위한 명상 가이드", category: "웰빙", image: "https://placehold.co/800x450.png", dataAiHint: 'serene landscape' },
];

const specialties = ['전체', ...Array.from(new Set(consultants.map(c => c.specialty)))];

export default function Home() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const consultantsPerPage = 24;

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setCurrentPage(1);
  };

  const filteredConsultants = selectedSpecialty === '전체'
    ? consultants
    : consultants.filter(c => c.specialty === selectedSpecialty);

  const totalPages = Math.ceil(filteredConsultants.length / consultantsPerPage);
  const currentConsultants = filteredConsultants.slice(
    (currentPage - 1) * consultantsPerPage,
    currentPage * consultantsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-16">
      
      <section className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden flex items-center justify-center text-center text-white p-4">
        <Image 
          src="https://placehold.co/1600x900.png"
          alt="신비로운 우주 배경"
          fill
          className="object-cover"
          data-ai-hint="mystical portal"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary/50 to-black/70 animate-gradient-pulse" />
        <div className="relative z-10 w-full">
          {!isChatbotOpen ? (
            <div className="animate-fade-in-up">
              <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                AI와 함께<br />운명의 길잡이를 찾아보세요
              </h1>
              <p className="text-white/80 mt-4 text-lg max-w-2xl mx-auto">
                몇 가지 질문에 답하고, 당신의 고민에 꼭 맞는 최고의 상담사를 추천받으세요.
              </p>
              <Button 
                size="lg" 
                className="mt-8 bg-white/10 backdrop-blur-sm border-white/20 border hover:bg-white/20 text-white text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
                onClick={() => setIsChatbotOpen(true)}
              >
                상담 시작하기 <ArrowRight className="ml-2" />
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
              <Chatbot consultants={consultants as Consultant[]} />
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="font-headline text-3xl font-bold">상담사 전체보기</h2>
        </div>
        <p className="text-muted-foreground mt-1 mb-6">당신에게 맞는 상담사를 찾아보세요.</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? 'default' : 'outline'}
              onClick={() => handleSpecialtyChange(specialty)}
              className="rounded-full"
            >
              {specialty}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentConsultants.map((consultant) => (
                <ConsultantCard key={consultant.id} consultant={consultant as Consultant} />
            ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
              <Pagination>
                  <PaginationContent>
                      <PaginationItem>
                          <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                              <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={currentPage === i + 1}>
                                  {i + 1}
                              </PaginationLink>
                          </PaginationItem>
                      ))}
                      <PaginationItem>
                          <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
                      </PaginationItem>
                  </PaginationContent>
              </Pagination>
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-baseline">
          <h2 className="font-headline text-3xl font-bold">오늘의 스펠카드</h2>
        </div>
         <p className="text-muted-foreground mt-1">우주가 당신만을 위해 보내는 오늘의 메시지.</p>
        <div className="mt-6">
          <DailySpellCard />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-baseline">
          <h2 className="font-headline text-3xl font-bold">최신 콘텐츠</h2>
           <Button variant="link" className="text-primary">더 둘러보기</Button>
        </div>
        <p className="text-muted-foreground mt-1">전문가 커뮤니티의 지혜와 이야기.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {latestContent.slice(0, 2).map(content => (
            <div key={content.id} className="group relative overflow-hidden rounded-xl shadow-md cursor-pointer transition-all hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 aspect-[16/9]">
              <Image src={content.image} alt={content.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={content.dataAiHint} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <Badge variant="secondary" className="mb-2 text-secondary-foreground">{content.category}</Badge>
                <h3 className="font-headline text-lg font-semibold">{content.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
