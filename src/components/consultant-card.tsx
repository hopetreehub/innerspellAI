import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Phone } from 'lucide-react';
import type { Consultant } from '@/types/consultant';

export function ConsultantCard({ consultant }: { consultant: Consultant }) {
  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 flex">
      <div className="relative w-1/3 aspect-[3/4]">
        <Image
          src={consultant.image}
          alt={consultant.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 15vw, 10vw"
          data-ai-hint={consultant.dataAiHint}
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-1 w-2/3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-base font-semibold truncate leading-tight">{consultant.name}</h3>
            <Badge variant={consultant.status === 'available' ? "secondary" : "outline"} className={`text-xs ${consultant.status === 'available' ? 'text-secondary-foreground' : 'bg-black/50 text-white backdrop-blur-sm border-white/50'}`}>
              {consultant.status === 'available' ? '가능' : '상담중'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">[{consultant.phoneId}] {consultant.specialty}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-secondary text-secondary" />
            <span className="font-semibold text-sm">{consultant.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({consultant.reviewCount})</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {consultant.keywords.slice(0, 2).map(keyword => (
              <Badge key={keyword} variant="outline" className="text-xs font-normal">{keyword}</Badge>
            ))}
          </div>
        </div>
        <Button className="w-full mt-3" size="sm">
          <Phone className="mr-2 h-4 w-4" /> 전화상담
        </Button>
      </div>
    </Card>
  );
}
