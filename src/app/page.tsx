import { matchConsultant, MatchConsultantOutput } from '@/ai/flows/ai-spell-matching';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ConsultantCard } from '@/components/consultant-card';
import { DailySpellCard } from '@/components/daily-spell-card';
import { Sparkles, UserCheck2 } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

type Consultant = {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  status: 'available' | 'busy';
  keywords: string[];
  dataAiHint?: string;
};

type Content = {
  id: string;
  title: string;
  category: string;
  image: string;
  dataAiHint?: string;
};

const consultants: Consultant[] = [
  { id: '1', name: 'Seraphina Moon', specialty: '타로', image: 'https://placehold.co/400x400.png', rating: 4.9, reviewCount: 281, status: 'available', keywords: ['사랑', '직업', '미래'], dataAiHint: 'woman mystic' },
  { id: '2', name: 'Orion Sage', specialty: '점성술', image: 'https://placehold.co/400x400.png', rating: 4.8, reviewCount: 194, status: 'available', keywords: ['출생 차트', '궁합'], dataAiHint: 'man telescope' },
  { id: '3', name: 'Luna Iris', specialty: '꿈 분석', image: 'https://placehold.co/400x400.png', rating: 4.9, reviewCount: 156, status: 'busy', keywords: ['상징', '잠재의식'], dataAiHint: 'woman sleeping' },
  { id: '4', name: 'Jasper Vale', specialty: '수비학', image: 'https://placehold.co/400x400.png', rating: 4.7, reviewCount: 121, status: 'available', keywords: ['인생 경로', '운명'], dataAiHint: 'numbers code' },
  { id: '5', name: 'Aria Whisper', specialty: '영매술', image: 'https://placehold.co/400x400.png', rating: 5.0, reviewCount: 98, status: 'busy', keywords: ['영적 안내자', '조상'], dataAiHint: 'candle light' },
  { id: '6', name: 'Kai Solstice', specialty: '손금', image: 'https://placehold.co/400x400.png', rating: 4.6, reviewCount: 85, status: 'available', keywords: ['생명선', '감정선'], dataAiHint: 'open palm' },
];

const latestContent: Content[] = [
    { id: '1', title: "수성 역행: 생존 가이드", category: "점성술", image: "https://placehold.co/800x450.png", dataAiHint: 'planets orbit' },
    { id: '2', title: "타로의 연인 카드 이해하기", category: "타로", image: "https://placehold.co/800x450.png", dataAiHint: 'lovers hands' },
    { id: '3', title: "당신의 인생 경로 숫자 찾기", category: "수비학", image: "https://placehold.co/800x450.png", dataAiHint: 'ancient script' },
    { id: '4', title: "초심자를 위한 명상 가이드", category: "웰빙", image: "https://placehold.co/800x450.png", dataAiHint: 'serene landscape' },
];

export default async function Home() {
  const userName = "탐험가";

  let aiMatch: MatchConsultantOutput;

  try {
    const matchInput = {
      profileData: "진로에 대해 불안해하며 명확성과 방향성을 찾고 있는 사용자. 부드럽고 공감적인 접근을 선호함.",
      consultantSpecialties: consultants.map(c => c.specialty)
    };
    aiMatch = await matchConsultant(matchInput);
  } catch (error) {
    console.error("AI Spellmatch failed. This may be due to a missing or invalid API key.", error);
    aiMatch = {
      specialty: '타로',
      matchReason: "현재 AI 매칭 서비스에 연결할 수 없습니다. 대중적인 선택에 따라, 일반적인 조언을 위해 타로 상담을 추천해 드립니다. Gemini API 키가 올바르게 설정되었는지 확인해주세요."
    };
  }
  
  const matchedConsultant = consultants.find(c => c.specialty === aiMatch.specialty) || consultants[0];
  
  const availableConsultants = consultants.filter(c => c.status === 'available');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-16">
      
      <section>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
          환영합니다, {userName}님.
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          오늘 어떤 이야기들이 당신을 기다리고 있을까요?
        </p>

        <Card className="mt-8 bg-card/50 border-primary/20 border-dashed shadow-lg">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-2xl">당신을 위한 AI 스펠매치</CardTitle>
              <CardDescription className="mt-1">
                당신의 에너지에 기반하여, 당신에게 맞는 분을 찾아냈어요.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/3">
              <ConsultantCard consultant={matchedConsultant} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <UserCheck2 className="w-5 h-5 text-accent-foreground" />
                <h4 className="font-headline font-semibold text-lg">추천 이유:</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {aiMatch.matchReason}
              </p>
              <Button size="lg" className="mt-2 group">
                {matchedConsultant.name}님과 연결하기
                <Sparkles className="w-4 h-4 ml-2 group-hover:scale-125 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="flex justify-between items-baseline">
          <h2 className="font-headline text-3xl font-bold">지금 상담 가능</h2>
          <Button variant="link" className="text-primary">전체 보기</Button>
        </div>
        <p className="text-muted-foreground mt-1">몇 분 안에 대화를 시작하세요.</p>
        
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full mt-6"
        >
          <CarouselContent>
            {availableConsultants.map((consultant) => (
              <CarouselItem key={consultant.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <ConsultantCard consultant={consultant} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
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
