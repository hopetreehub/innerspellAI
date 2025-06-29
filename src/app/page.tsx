import Image from 'next/image';
import { consultants } from '@/lib/consultants';
import { ConsultantBrowser } from '@/features/consultants/components/consultant-browser';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-16">
      
      <section className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden flex items-center justify-center text-center text-white p-4">
        <Image 
          src="https://placehold.co/1200x600.png"
          alt="신비로운 우주 배경"
          fill
          className="object-cover animate-slow-zoom"
          priority
          data-ai-hint="mystical cosmos"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-900/40 to-black/70 animate-gradient-pulse" />
        <div className="relative z-10 w-full animate-fade-in-up">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                운명의 길잡이를 찾아보세요
            </h1>
            <p className="text-white/80 mt-4 text-lg max-w-2xl mx-auto">
                당신의 고민에 꼭 맞는 최고의 상담사를 만나보세요.
            </p>
        </div>
      </section>

      <ConsultantBrowser consultants={consultants} />
    </div>
  );
}
