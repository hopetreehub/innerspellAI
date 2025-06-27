import type { Consultant, Inquiry, ReviewSummary } from '@/types/consultant';

export const consultants: Omit<Consultant, 'reviews' | 'posts' | 'inquiries' | 'satisfaction' | 'reviewSummary'>[] = [
  { id: '1', name: '세라피나', phoneId: 1023, specialty: '타로', image: '/images/con1.png', rating: 4.9, reviewCount: 281, status: 'available', keywords: ['타로', '연애', '미래', '여성', '따뜻함', '프리미엄'], dataAiHint: 'woman mystic', price: 2500, bio: '달의 힘을 빌려 당신의 길을 밝히는 타로 마스터, 세라피나 문입니다. 섬세하고 따뜻한 리딩으로 마음의 안식처가 되어드릴게요.' },
  { id: '2', name: '오리온', phoneId: 2431, specialty: '점성술', image: '/images/con2.png', rating: 4.8, reviewCount: 194, status: 'available', keywords: ['점성술', '출생 차트', '궁합', '남성', '논리적', '합리적'], dataAiHint: 'man telescope', price: 2200, bio: '밤하늘의 별자리처럼, 당신의 인생에도 정해진 지도가 있습니다. 논리적이고 체계적인 점성술로 그 지도를 함께 읽어 나가요.' },
  { id: '3', name: '루나', phoneId: 387, specialty: '해몽', image: '/images/con3.png', rating: 4.9, reviewCount: 156, status: 'busy', keywords: ['해몽', '상징', '잠재의식', '여성', '신비주의', '프리미엄'], dataAiHint: 'woman sleeping', price: 2800, bio: '꿈은 당신의 무의식이 보내는 편지입니다. 꿈의 상징을 해석하여 당신의 내면이 하는 이야기에 귀 기울여보세요.' },
  { id: '4', name: '재스퍼', phoneId: 4409, specialty: '수비학', image: '/images/con4.png', rating: 4.7, reviewCount: 121, status: 'available', keywords: ['수비학', '인생 경로', '운명', '남성', '분석적', '합리적'], dataAiHint: 'numbers code', price: 2000, bio: '숫자는 우주의 언어입니다. 당신의 이름과 생일에 담긴 숫자의 비밀을 풀어 운명의 흐름을 알려드립니다.' },
  { id: '5', name: '아리아', phoneId: 512, specialty: '신점', image: '/images/con5.png', rating: 5.0, reviewCount: 98, status: 'busy', keywords: ['신점', '영적 안내', '조상', '여성', '직설적', '프리미엄'], dataAiHint: 'candle light', price: 3000, bio: '보이지 않는 세계의 목소리를 전해드립니다. 직설적이지만 명쾌한 신점으로 당신의 고민에 답을 찾아드립니다.' },
  { id: '6', name: '카이', phoneId: 6675, specialty: '손금', image: '/images/con6.png', rating: 4.6, reviewCount: 85, status: 'available', keywords: ['손금', '생명선', '감정선', '남성', '따뜻함', '합리적'], dataAiHint: 'open palm', price: 1800, bio: '당신의 손 안에 인생의 이야기가 담겨 있습니다. 따뜻한 시선으로 손금을 읽어 당신의 과거, 현재, 미래를 함께 들여다봅니다.' },
  { id: '7', name: '혜인스님', phoneId: 7100, specialty: '사주', image: '/images/con7.png', rating: 4.9, reviewCount: 312, status: 'available', keywords: ['사주', '명리학', '직업운', '남성', '근엄함', '프리미엄'], dataAiHint: 'monk meditating', price: 2700, bio: '태어난 년, 월, 일, 시에 담긴 운명의 이치를 명리학으로 풀어냅니다. 인생의 큰 그림을 이해하고 나아갈 방향을 제시합니다.' },
  { id: '8', name: '이로운', phoneId: 825, specialty: '작명', image: '/images/con8.png', rating: 4.8, reviewCount: 250, status: 'available', keywords: ['작명', '개명', '상호명', '남성', '논리적', '프리미엄'], dataAiHint: 'man writing', price: 3500, bio: '이름은 한 사람의 인생을 담는 그릇입니다. 사주와 수리, 음양오행을 고려한 최상의 이름으로 당신의 앞날을 축복합니다.' },
  { id: '9', name: '김보살', phoneId: 9420, specialty: '신점', image: '/images/con9.png', rating: 4.9, reviewCount: 420, status: 'busy', keywords: ['신점', '사업운', '금전운', '여성', '직설적', '명성'], dataAiHint: 'korean shaman', price: 3200, bio: '사업과 금전운에 대한 막힘을 시원하게 뚫어드립니다. 다년간의 경험과 명성으로 증명된 명쾌한 해답을 드립니다.' },
  { id: '10', name: '하늘빛', phoneId: 1018, specialty: '타로', image: '/images/con10.png', rating: 4.7, reviewCount: 180, status: 'available', keywords: ['타로', '인간관계', '심리', '여성', '공감적', '합리적'], dataAiHint: 'woman tarot', price: 2000, bio: '타로 카드는 당신의 마음을 비추는 거울입니다. 공감적인 리딩을 통해 복잡한 인간관계의 실마리를 찾아드립니다.' },
  { id: '11', name: '도현', phoneId: 1144, specialty: '풍수지리', image: '/images/con11.png', rating: 4.8, reviewCount: 140, status: 'available', keywords: ['풍수', '인테리어', '이사', '남성', '분석적', '프리미엄'], dataAiHint: 'man compass', price: 2600, bio: '공간의 기운을 바꾸면 운의 흐름이 바뀝니다. 풍수지리 원리에 입각한 분석으로 당신의 공간에 좋은 기운을 불어넣습니다.' },
  { id: '12', name: '소정', phoneId: 1211, specialty: '명상', image: '/images/con12.png', rating: 4.9, reviewCount: 110, status: 'available', keywords: ['명상', '마음챙김', '스트레스', '여성', '따뜻함', '합리적'], dataAiHint: 'woman meditating', price: 1500, bio: '복잡한 마음을 잠재우고 내면의 평화를 찾는 시간. 따뜻한 안내에 따라 마음챙김 명상으로 스트레스를 해소하세요.' },
  { id: '13', name: '백도사', phoneId: 1395, specialty: '관상', image: '/images/con13.png', rating: 4.7, reviewCount: 195, status: 'available', keywords: ['관상', '첫인상', '인생조언', '남성', '직설적', '경험많음'], dataAiHint: 'wise old man', price: 2300, bio: '얼굴에는 살아온 인생과 살아갈 인생이 보입니다. 오랜 경험에서 우러나오는 직설적인 조언으로 인생의 방향을 잡아드립니다.' },
  { id: '14', name: '아라', phoneId: 1422, specialty: '타로', image: '/images/con14.png', rating: 4.8, reviewCount: 220, status: 'busy', keywords: ['타로', '학업', '시험', '여성', '논리적', '합리적'], dataAiHint: 'young woman books', price: 2100, bio: '학업과 시험, 진로에 대한 고민을 타로로 풀어봅니다. 논리적이고 명쾌한 리딩으로 당신의 성공적인 미래를 응원합니다.' },
  { id: '15', name: '정도령', phoneId: 1550, specialty: '신점', image: '/images/con15.png', rating: 4.9, reviewCount: 350, status: 'available', keywords: ['신점', '결혼', '궁합', '남성', '따뜻함', '명성'], dataAiHint: 'korean young shaman', price: 2900, bio: '결혼과 궁합, 인연의 문제로 고민하고 계신가요? 따뜻한 마음과 신의 목소리로 당신의 인연을 찾아드립니다.' },
  { id: '16', name: '유진', phoneId: 1680, specialty: '사주', image: '/images/con16.png', rating: 4.8, reviewCount: 280, status: 'available', keywords: ['사주', '신년운세', '건강운', '여성', '분석적', '합리적'], dataAiHint: 'woman looking calendar', price: 2400, bio: '다가오는 해의 운세를 미리 알고 대비하세요. 분석적인 사주 풀이로 당신의 신년 운세와 건강운을 자세히 알려드립니다.' },
  { id: '17', name: '엘라', phoneId: 1729, specialty: '타로', image: '/images/con1.png', rating: 4.9, reviewCount: 175, status: 'available', keywords: ['타로', '심리', '자아탐색', '여성', '공감적', '프리미엄'], dataAiHint: 'woman cards', price: 2600, bio: '타로 카드를 통해 당신의 깊은 내면을 탐색하고, 스스로의 길을 찾을 수 있도록 돕는 심리 타로 전문가입니다.' },
  { id: '18', name: '라이언', phoneId: 1844, specialty: '점성술', image: '/images/con2.png', rating: 4.7, reviewCount: 130, status: 'available', keywords: ['점성술', '직업', '재물', '남성', '현실적', '합리적'], dataAiHint: 'man charts', price: 2300, bio: '별들의 움직임 속에서 당신의 직업과 재물에 대한 현실적인 조언을 찾아드립니다. 실용적인 점성술 상담.' },
  { id: '19', name: '소피아', phoneId: 1981, specialty: '타로', image: '/images/con3.png', rating: 4.9, reviewCount: 210, status: 'busy', keywords: ['타로', '육아', '자녀', '여성', '따뜻함', '경험많음'], dataAiHint: 'mother child', price: 2700, bio: '아이의 마음과 부모의 마음을 연결하는 육아 타로 상담. 따뜻한 공감과 현실적인 조언으로 육아의 어려움을 함께 나눕니다.' },
  { id: '20', name: '노아', phoneId: 2025, specialty: '사주', image: '/images/con4.png', rating: 4.8, reviewCount: 290, status: 'available', keywords: ['사주', '궁합', '결혼', '남성', '분석적', '프리미엄'], dataAiHint: 'man couple', price: 2800, bio: '두 사람의 사주를 정밀하게 분석하여 최고의 궁합을 찾아드립니다. 결혼과 인연에 대한 깊이 있는 통찰을 제공합니다.' },
  { id: '21', name: '가이아', phoneId: 2177, specialty: '오라클', image: '/images/con5.png', rating: 5.0, reviewCount: 150, status: 'available', keywords: ['오라클', '영적성장', '치유', '여성', '신비주의', '명상'], dataAiHint: 'goddess nature', price: 3100, bio: '자연과 우주의 메시지를 담은 오라클 카드로 영적 성장을 돕고 상처받은 마음을 치유합니다. 깊은 힐링의 시간을 경험하세요.' },
  { id: '22', name: '현우', phoneId: 2288, specialty: '주역', image: '/images/con6.png', rating: 4.6, reviewCount: 105, status: 'available', keywords: ['주역', '사업운', '선택', '남성', '논리적', '전통'], dataAiHint: 'man traditional', price: 2500, bio: '인생의 중대한 선택의 기로에 섰을 때, 주역 64괘를 통해 하늘의 뜻을 묻고 최상의 길을 찾아냅니다.' },
  { id: '23', name: '에이든', phoneId: 2359, specialty: '룬', image: '/images/con7.png', rating: 4.7, reviewCount: 95, status: 'busy', keywords: ['룬', '북유럽', '미래예측', '남성', '직설적', '희귀분야'], dataAiHint: 'viking runes', price: 2900, bio: '고대 북유럽의 신비로운 문자, 룬에 담긴 지혜로 당신의 미래를 예측하고 현재의 문제에 대한 답을 찾습니다.' },
  { id: '24', name: '클로이', phoneId: 2401, specialty: '타로', image: '/images/con8.png', rating: 4.9, reviewCount: 188, status: 'available', keywords: ['타로', '반려동물', '교감', '여성', '따뜻함', '프리미엄'], dataAiHint: 'woman with dog', price: 2800, bio: '말 못하는 우리 아이, 반려동물의 마음이 궁금하신가요? 펫타로를 통해 당신의 소중한 가족과 더 깊이 교감해보세요.' },
  { id: '25', name: '선우', phoneId: 2511, specialty: '사주', image: '/images/con9.png', rating: 4.8, reviewCount: 305, status: 'available', keywords: ['사주', '궁합', '재물운', '남성', '따뜻함', '명성'], dataAiHint: 'gentleman hanbok', price: 2750, bio: '따뜻하고 명쾌한 사주 풀이로 당신의 재물운과 인연의 흐름을 짚어드립니다. 마음의 평안을 찾아가세요.'},
  { id: '26', name: '이설', phoneId: 2630, specialty: '신점', image: '/images/con10.png', rating: 4.9, reviewCount: 450, status: 'busy', keywords: ['신점', '연애운', '재회', '여성', '공감적', '용함'], dataAiHint: 'woman praying', price: 3300, bio: '애타는 연애 문제, 재회의 가능성을 신의 목소리로 들어보세요. 공감과 소통으로 당신의 사랑을 응원합니다.'},
  { id: '27', name: '강산', phoneId: 2777, specialty: '관상', image: '/images/con11.png', rating: 4.7, reviewCount: 210, status: 'available', keywords: ['관상', '사업운', '인간관계', '남성', '카리스마', '경험많음'], dataAiHint: 'charismatic businessman', price: 2400, bio: '사람의 얼굴에는 길이 있습니다. 카리스마 있는 관상 풀이로 사업의 성패와 인간관계의 해법을 제시합니다.'},
  { id: '28', name: '윤슬', phoneId: 2894, specialty: '타로', image: '/images/con12.png', rating: 4.8, reviewCount: 240, status: 'available', keywords: ['타로', '직업운', '이직', '여성', '논리적', '프리미엄'], dataAiHint: 'professional woman', price: 2650, bio: '직업과 이직 문제로 고민 중이신가요? 논리적이고 체계적인 타로 리딩으로 당신의 커리어 플랜을 함께 세워나갑니다.'},
  { id: '29', name: '해모수', phoneId: 2905, specialty: '주역', image: '/images/con13.png', rating: 4.9, reviewCount: 180, status: 'available', keywords: ['주역', '인생상담', '운세', '남성', '지혜로움', '전통'], dataAiHint: 'wise sage', price: 3000, bio: '주역의 깊은 지혜로 인생의 큰 흐름을 읽어냅니다. 중요한 결정을 앞두고 있다면 해모수와 함께 길을 찾아보세요.'},
  { id: '30', name: '채아', phoneId: 3033, specialty: '오라클', image: '/images/con14.png', rating: 5.0, reviewCount: 165, status: 'busy', keywords: ['오라클', '힐링', '내면아이', '여성', '따뜻함', '치유'], dataAiHint: 'woman nature', price: 3100, bio: '아름다운 오라클 카드로 당신의 내면 아이를 만나고 상처를 치유하는 시간을 가져보세요. 따뜻한 힐링 에너지를 전해드립니다.'},
  { id: '31', name: '무진', phoneId: 3148, specialty: '신점', image: '/images/con15.png', rating: 4.8, reviewCount: 380, status: 'available', keywords: ['신점', '금전운', '시험운', '남성', '직설적', '명쾌함'], dataAiHint: 'serious man', price: 3200, bio: '금전, 시험, 합격운에 대한 명쾌한 해답을 원하시나요? 막힌 곳을 시원하게 뚫어드리는 직설적인 신점을 경험해보세요.'},
  { id: '32', name: '지아', phoneId: 3277, specialty: '점성술', image: '/images/con16.png', rating: 4.9, reviewCount: 230, status: 'available', keywords: ['점성술', '궁합', '별자리', '여성', '신비주의', '프리미엄'], dataAiHint: 'woman stars', price: 2850, bio: '별들의 속삭임으로 당신과 그 사람의 인연을 확인해보세요. 신비로운 점성술의 세계로 당신을 초대합니다.'}
];

// Function to get a single consultant with mock reviews and posts
export const getConsultantById = (id: string): Consultant | undefined => {
  const consultantData = consultants.find(c => c.id === id);
  if (!consultantData) return undefined;

  // Mock data for reviews and posts
  const mockReviews: Consultant['reviews'] = [
    { id: '1', author: '행운가득', rating: 5, comment: '정말 명쾌하고 따뜻한 상담이었어요! 마음이 편안해졌습니다.', createdAt: '2024-05-20' },
    { id: '2', author: '고민해결', rating: 5, comment: '답답했던 문제의 실마리를 찾았어요. 왜 이분을 추천하는지 알겠네요. 최고!', createdAt: '2024-05-18' },
    { id: '3', author: '희망찾기', rating: 4, comment: '현실적인 조언 덕분에 많은 도움이 되었습니다. 감사합니다.', createdAt: '2024-05-15' },
  ];

  const mockPosts: Consultant['posts'] = [
    { id: '1', title: '2024년 하반기, 연애운 상승하는 별자리는?', content: '다가오는 하반기, 사랑의 기운이 가득한 별자리들을 소개합니다. 여러분의 별자리는 어디에 속해있을까요? 자세한 내용을 확인해보세요...', createdAt: '2024-05-10' },
    { id: '2', title: '타로카드가 말해주는 "재회"의 시그널', content: '헤어진 연인과의 재회를 고민하고 있나요? 타로카드의 특정 조합은 재회의 가능성을 암시하기도 합니다. 과연 어떤 카드들이 있을까요?', createdAt: '2024-05-02' },
  ];

  const mockInquiries: Inquiry[] = [
    {
      id: '1',
      title: '재물운에 대해 궁금합니다.',
      author: '부자되고파',
      createdAt: '2024-05-22',
      content: '안녕하세요, 선생님. 제 전반적인 재물운의 흐름과 언제쯤 금전적으로 안정을 찾을 수 있을지 궁금해서 문의드립니다.',
      isPrivate: false,
      answer: {
        content: '안녕하세요, 부자되고파 님. 문의주셔서 감사합니다. 전반적인 사주 흐름을 보았을 때...',
        createdAt: '2024-05-23'
      }
    },
    {
      id: '2',
      title: '비밀글입니다.',
      author: '익명고객',
      createdAt: '2024-05-21',
      content: '이 내용은 상담사님만 보실 수 있습니다.',
      isPrivate: true,
    },
    {
      id: '3',
      title: '연인과의 궁합이 궁금해요.',
      author: '사랑꾼',
      createdAt: '2024-05-19',
      content: '최근에 만나는 사람이 있는데, 이 사람과의 궁합이 어떤지 자세히 알고 싶습니다. 생년월일은...',
      isPrivate: false,
    },
  ];

  const mockReviewSummary: ReviewSummary = {
    style: {
      '👍 현실적이에요': 5,
      '❤️ 친절해요': 8,
      '😊 따뜻해요': 4,
    },
    field: {
      '고민': 7,
      '궁합': 6,
      '애정': 4,
    },
  };

  return {
    ...consultantData,
    reviews: mockReviews,
    posts: mockPosts,
    inquiries: mockInquiries,
    satisfaction: 95,
    reviewSummary: mockReviewSummary,
  };
};
