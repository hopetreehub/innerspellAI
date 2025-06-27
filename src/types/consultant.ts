
export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
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
};
