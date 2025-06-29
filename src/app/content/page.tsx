
import { DailySpellCard } from '@/features/content/components/daily-spell-card';

export default function ContentPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl font-bold">오늘의 스펠카드</h1>
          <p className="text-muted-foreground mt-2">우주가 당신만을 위해 보내는 오늘의 메시지.</p>
        </div>
        <DailySpellCard />
      </section>
    </div>
  );
}
