
export type Consultant = {
  id: string;
  name: string;
  phoneId: number;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  status: 'available' | 'busy';
  keywords: string[];
  dataAiHint?: string;
};

    
