
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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
    { id: '5', title: "꿈일기 작성의 놀라운 효과", category: "해몽", image: "https://placehold.co/800x450.png", dataAiHint: 'journal writing' },
    { id: '6', title: "풍수지리로 집에 부를 부르는 법", category: "풍수", image: "https://placehold.co/800x450.png", dataAiHint: 'zen home' },
];

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section>
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold">최신 콘텐츠</h1>
          <p className="text-muted-foreground mt-2">전문가 커뮤니티의 지혜와 이야기를 만나보세요.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestContent.map(content => (
            <Link href="#" key={content.id} className="block group">
              <div className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-2 aspect-[16/10]">
                <Image src={content.image} alt={content.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" data-ai-hint={content.dataAiHint} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <Badge variant="secondary" className="mb-2 text-secondary-foreground">{content.category}</Badge>
                  <h3 className="font-headline text-xl font-semibold">{content.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
