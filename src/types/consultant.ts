
export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Post = {
  id:string;
  title: string;
  content: string;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  isPrivate: boolean;
  answer?: {
      content: string;
      createdAt: string;
  }
};

export type ReviewSummary = {
  style: Record<string, number>;
  field: Record<string, number>;
};

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
  price: number;
  bio: string;
  reviews: Review[];
  posts: Post[];
  inquiries: Inquiry[];
  satisfaction?: number;
  reviewSummary?: ReviewSummary;
};
