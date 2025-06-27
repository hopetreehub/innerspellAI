
'use client';

import { useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { getConsultantById } from '@/lib/consultants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Star, ArrowLeft, ImagePlus } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function NewReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = typeof params.id === 'string' ? params.id : '';
  const consultant = getConsultantById(id);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [consultingStyle, setConsultingStyle] = useState('');
  const [consultingField, setConsultingField] = useState('');

  if (!consultant) {
    notFound();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: '입력 오류',
        description: '별점을 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!consultingStyle || !consultingField) {
      toast({
        title: '입력 오류',
        description: '상담 평가 설문을 완료해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: '입력 오류',
        description: '후기 내용을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    // In a real application, you would send the data to your backend here.
    console.log('Submitting review:', { rating, comment, imageFile, consultantId: id, consultingStyle, consultingField });

    toast({
      title: '후기 등록 완료',
      description: '소중한 후기 감사합니다. 잠시 후 상세 페이지로 이동합니다.',
    });

    // Redirect back to the consultant detail page after a short delay
    setTimeout(() => {
      router.push(`/consultant/${consultant.id}`);
    }, 1500);
  };

  const styleOptions = [
    { value: '👍 현실적이에요', id: 'style-1' },
    { value: '❤️ 친절해요', id: 'style-2' },
    { value: '😊 따뜻해요', id: 'style-3' },
    { value: '🧠 논리적이에요', id: 'style-4' },
    { value: '🗣️ 직설적이에요', id: 'style-5' },
  ];

  const fieldOptions = [
    { value: '연애/궁합', id: 'field-1' },
    { value: '직업/사업', id: 'field-2' },
    { value: '금전/재물', id: 'field-3' },
    { value: '인간관계', id: 'field-4' },
    { value: '기타', id: 'field-5' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
       <Button variant="ghost" asChild className="mb-4">
            <Link href={`/consultant/${consultant.id}`}>
                <ArrowLeft className="mr-2"/>
                상세 페이지로 돌아가기
            </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">고객 후기 작성</CardTitle>
          <CardDescription>
            {consultant.name} 상담사와의 상담은 어떠셨나요? 소중한 후기를 남겨주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>별점</Label>
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-8 h-8 cursor-pointer transition-colors ${
                      (hoverRating || rating) > i
                        ? 'text-secondary fill-secondary'
                        : 'text-muted-foreground/30'
                    }`}
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                  />
                ))}
              </div>
            </div>

            {/* Survey Section */}
            <div className="space-y-6 rounded-lg border bg-card p-4 md:p-6">
              <div>
                <h3 className="font-semibold text-foreground">상담 상세 평가</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  더 나은 추천을 위해 상담 경험에 대해 알려주세요.
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>상담 스타일은 어떠셨나요?</Label>
                <RadioGroup value={consultingStyle} onValueChange={setConsultingStyle} className="grid grid-cols-2 gap-x-4 gap-y-2">
                   {styleOptions.map(option => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.id} />
                        <Label htmlFor={option.id} className="font-normal cursor-pointer">{option.value}</Label>
                      </div>
                   ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>어떤 분야에 대해 상담받으셨나요?</Label>
                <RadioGroup value={consultingField} onValueChange={setConsultingField} className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {fieldOptions.map(option => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.id} />
                        <Label htmlFor={option.id} className="font-normal cursor-pointer">{option.value}</Label>
                      </div>
                   ))}
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">후기 내용</Label>
              <Textarea
                id="comment"
                placeholder="상담 후기를 자유롭게 작성해주세요."
                className="min-h-[150px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
               <Label htmlFor="image-upload">사진 첨부 (선택)</Label>
               <Input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
               <Label htmlFor="image-upload" className="w-full border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent hover:border-primary transition-colors">
                  <ImagePlus className="w-10 h-10 text-muted-foreground mb-2"/>
                  <span className="text-sm font-medium text-muted-foreground">{imageFile ? imageFile.name : '클릭하여 사진을 첨부하세요'}</span>
               </Label>
            </div>

            <Button type="submit" size="lg" className="w-full mt-8">
              후기 등록하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
