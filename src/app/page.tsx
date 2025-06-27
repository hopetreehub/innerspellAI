
'use client';

import { useState } from 'react';
import { ConsultantCard } from '@/components/consultant-card';
import { DailySpellCard } from '@/components/daily-spell-card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Chatbot } from '@/components/chatbot';
import type { Consultant as ConsultantType } from '@/types/consultant';
import { ArrowRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';

const consultants: ConsultantType[] = [
  { id: '1', name: '세라피나 문', phoneId: 1023, specialty: '타로', image: '/images/con1.png', rating: 4.9, reviewCount: 281, status: 'available', keywords: ['타로', '연애', '미래', '여성', '따뜻함', '프리미엄'], dataAiHint: 'woman mystic' },
  { id: '2', name: '오리온 세이지', phoneId: 2431, specialty: '점성술', image: '/images/con2.png', rating: 4.8, reviewCount: 194, status: 'available', keywords: ['점성술', '출생 차트', '궁합', '남성', '논리적', '합리적'], dataAiHint: 'man telescope' },
  { id: '3', name: '루나 아이리스', phoneId: 387, specialty: '해몽', image: '/images/con3.png', rating: 4.9, reviewCount: 156, status: 'busy', keywords: ['해몽', '상징', '잠재의식', '여성', '신비주의', '프리미엄'], dataAiHint: 'woman sleeping' },
  { id: '4', name: '재스퍼 베일', phoneId: 4409, specialty: '수비학', image: '/images/con4.png', rating: 4.7, reviewCount: 121, status: 'available', keywords: ['수비학', '인생 경로', '운명', '남성', '분석적', '합리적'], dataAiHint: 'numbers code' },
  { id: '5', name: '아리아 위스퍼', phoneId: 512, specialty: '신점', image: '/images/con5.png', rating: 5.0, reviewCount: 98, status: 'busy', keywords: ['신점', '영적 안내', '조상', '여성', '직설적', '프리미엄'], dataAiHint: 'candle light' },
  { id: '6', name: '카이 솔스티스', phoneId: 6675, specialty: '손금', image: '/images/con6.png', rating: 4.6, reviewCount: 85, status: 'available', keywords: ['손금', '생명선', '감정선', '남성', '따뜻함', '합리적'], dataAiHint: 'open palm' },
  { id: '7', name: '혜인 스님', phoneId: 7100, specialty: '사주', image: '/images/con7.png', rating: 4.9, reviewCount: 312, status: 'available', keywords: ['사주', '명리학', '직업운', '남성', '근엄함', '프리미엄'], dataAiHint: 'monk meditating' },
  { id: '8', name: '이로운', phoneId: 825, specialty: '작명', image: '/images/con8.png', rating: 4.8, reviewCount: 250, status: 'available', keywords: ['작명', '개명', '상호명', '남성', '논리적', '프리미엄'], dataAiHint: 'man writing' },
  { id: '9', name: '김보살', phoneId: 9420, specialty: '신점', image: '/images/con9.png', rating: 4.9, reviewCount: 420, status: 'busy', keywords: ['신점', '사업운', '금전운', '여성', '직설적', '명성'], dataAiHint: 'korean shaman' },
  { id: '10', name: '하늘빛', phoneId: 1018, specialty: '타로', image: '/images/con10.png', rating: 4.7, reviewCount: 180, status: 'available', keywords: ['타로', '인간관계', '심리', '여성', '공감적', '합리적'], dataAiHint: 'woman tarot' },
  { id: '11', name: '도현', phoneId: 1144, specialty: '풍수지리', image: '/images/con11.png', rating: 4.8, reviewCount: 140, status: 'available', keywords: ['풍수', '인테리어', '이사', '남성', '분석적', '프리미엄'], dataAiHint: 'man compass' },
  { id: '12', name: '소정', phoneId: 1211, specialty: '명상', image: '/images/con12.png', rating: 4.9, reviewCount: 110, status: 'available', keywords: ['명상', '마음챙김', '스트레스', '여성', '따뜻함', '합리적'], dataAiHint: 'woman meditating' },
  { id: '13', name: '백도사', phoneId: 1395, specialty: '관상', image: '/images/con13.png', rating: 4.7, reviewCount: 195, status: 'available', keywords: ['관상', '첫인상', '인생조언', '남성', '직설적', '경험많음'], dataAiHint: 'wise old man' },
  { id: '14', name: '아라', phoneId: 1422, specialty: '타로', image: '/images/con14.png', rating: 4.8, reviewCount: 220, status: 'busy', keywords: ['타로', '학업', '시험', '여성', '논리적', '합리적'], dataAiHint: 'young woman books' },
  { id: '15', name: '정도령', phoneId: 1550, specialty: '신점', image: '/images/con15.png', rating: 4.9, reviewCount: 350, status: 'available', keywords: ['신점', '결혼', '궁합', '남성', '따뜻함', '명성'], dataAiHint: 'korean young shaman' },
  { id: '16', name: '유진', phoneId: 1680, specialty: '사주', image: '/images/con16.png', rating: 4.8, reviewCount: 280, status: 'available', keywords: ['사주', '신년운세', '건강운', '여성', '분석적', '합리적'], dataAiHint: 'woman looking calendar' },
];

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

export default function Home() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const consultantsPerPage = 8;
  const totalPages = Math.ceil(consultants.length / consultantsPerPage);

  const currentConsultants = consultants.slice(
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
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary/50 to-black/70" />
        <div className="relative z-10">
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
            <div className="w-full max-w-3xl mx-auto animate-fade-in">
              <Chatbot consultants={consultants} />
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-baseline">
          <h2 className="font-headline text-3xl font-bold">상담사 전체보기</h2>
        </div>
        <p className="text-muted-foreground mt-1">당신에게 맞는 상담사를 찾아보세요.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {currentConsultants.map((consultant) => (
                <ConsultantCard key={consultant.id} consultant={consultant} />
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

    
