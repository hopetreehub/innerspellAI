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
  { id: '1', name: 'Seraphina Moon', specialty: 'Tarot', image: 'https://placehold.co/400x400.png', rating: 4.9, reviewCount: 281, status: 'available', keywords: ['Love', 'Career', 'Future'], dataAiHint: 'woman mystic' },
  { id: '2', name: 'Orion Sage', specialty: 'Astrology', image: 'https://placehold.co/400x400.png', rating: 4.8, reviewCount: 194, status: 'available', keywords: ['Natal Chart', 'Compatibility'], dataAiHint: 'man telescope' },
  { id: '3', name: 'Luna Iris', specialty: 'Dream Interpretation', image: 'https://placehold.co/400x400.png', rating: 4.9, reviewCount: 156, status: 'busy', keywords: ['Symbols', 'Subconscious'], dataAiHint: 'woman sleeping' },
  { id: '4', name: 'Jasper Vale', specialty: 'Numerology', image: 'https://placehold.co/400x400.png', rating: 4.7, reviewCount: 121, status: 'available', keywords: ['Life Path', 'Destiny'], dataAiHint: 'numbers code' },
  { id: '5', name: 'Aria Whisper', specialty: 'Mediumship', image: 'https://placehold.co/400x400.png', rating: 5.0, reviewCount: 98, status: 'busy', keywords: ['Spirit Guide', 'Ancestors'], dataAiHint: 'candle light' },
  { id: '6', name: 'Kai Solstice', specialty: 'Palmistry', image: 'https://placehold.co/400x400.png', rating: 4.6, reviewCount: 85, status: 'available', keywords: ['Life Line', 'Heart Line'], dataAiHint: 'open palm' },
];

const latestContent: Content[] = [
    { id: '1', title: "Mercury Retrograde: A Survival Guide", category: "Astrology", image: "https://placehold.co/800x450.png", dataAiHint: 'planets orbit' },
    { id: '2', title: "Understanding The Lovers Card in Tarot", category: "Tarot", image: "https://placehold.co/800x450.png", dataAiHint: 'lovers hands' },
    { id: '3', title: "Finding Your Life Path Number", category: "Numerology", image: "https://placehold.co/800x450.png", dataAiHint: 'ancient script' },
    { id: '4', title: "A Beginner's Guide to Meditation", category: "Wellness", image: "https://placehold.co/800x450.png", dataAiHint: 'serene landscape' },
];

export default async function Home() {
  const userName = "Explorer";

  let aiMatch: MatchConsultantOutput;

  try {
    const matchInput = {
      profileData: "A user feeling anxious about their career path and looking for clarity and direction. They prefer a gentle and empathetic approach.",
      consultantSpecialties: consultants.map(c => c.specialty)
    };
    aiMatch = await matchConsultant(matchInput);
  } catch (error) {
    console.error("AI Spellmatch failed. This may be due to a missing or invalid API key.", error);
    aiMatch = {
      specialty: 'Tarot',
      matchReason: "We're currently unable to connect to our AI matching service. Based on popular choice, we recommend exploring Tarot for general guidance. Please ensure your Gemini API key is set up correctly."
    };
  }
  
  const matchedConsultant = consultants.find(c => c.specialty === aiMatch.specialty) || consultants[0];
  
  const availableConsultants = consultants.filter(c => c.status === 'available');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-16">
      
      <section>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
          Welcome, {userName}.
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          What stories are waiting to be unveiled today?
        </p>

        <Card className="mt-8 bg-card/50 border-primary/20 border-dashed shadow-lg">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-2xl">Your Personal AI Spellmatch</CardTitle>
              <CardDescription className="mt-1">
                Based on your energy, we feel a connection for you with...
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/3">
              <ConsultantCard consultant={matchedConsultant} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <UserCheck2 className="w-5 h-5 text-accent" />
                <h4 className="font-headline font-semibold text-lg">Why it's a match:</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {aiMatch.matchReason}
              </p>
              <Button size="lg" className="mt-2 group">
                Connect with {matchedConsultant.name}
                <Sparkles className="w-4 h-4 ml-2 group-hover:scale-125 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="flex justify-between items-baseline">
          <h2 className="font-headline text-3xl font-bold">Available Now</h2>
          <Button variant="link" className="text-primary">View All</Button>
        </div>
        <p className="text-muted-foreground mt-1">Start a conversation in minutes.</p>
        
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
          <h2 className="font-headline text-3xl font-bold">Daily Spellcard</h2>
        </div>
         <p className="text-muted-foreground mt-1">A daily message from the cosmos, just for you.</p>
        <div className="mt-6">
          <DailySpellCard />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-baseline">
          <h2 className="font-headline text-3xl font-bold">Latest Content</h2>
           <Button variant="link" className="text-primary">Explore More</Button>
        </div>
        <p className="text-muted-foreground mt-1">Wisdom and stories from our expert community.</p>
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
