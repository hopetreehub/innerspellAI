
'use client';

import { useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { getConsultantById } from '@/lib/consultants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function InquiryPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = typeof params.id === 'string' ? params.id : '';
  const consultant = getConsultantById(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!consultant) {
    notFound();
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: '입력 오류',
        description: '제목과 내용을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    // In a real application, you would send the data to your backend here.
    console.log('Submitting inquiry:', { title, content, isPrivate, consultantId: id });

    toast({
      title: '문의 등록 완료',
      description: '문의가 성공적으로 등록되었습니다. 잠시 후 상세 페이지로 이동합니다.',
    });

    // Redirect back to the consultant detail page after a short delay
    setTimeout(() => {
      router.push(`/consultant/${consultant.id}`);
    }, 1500);
  };

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
          <CardTitle className="text-2xl font-headline">1:1 문의하기</CardTitle>
          <CardDescription>
            {consultant.name} 상담사에게 궁금한 점을 직접 문의해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="문의 제목을 입력해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                placeholder="문의 내용을 상세하게 입력해주세요."
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="private"
                checked={isPrivate}
                onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
              />
              <Label htmlFor="private" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                상담사만 볼 수 있도록 비밀글로 문의합니다.
              </Label>
            </div>
            <Button type="submit" size="lg" className="w-full">
              문의 등록하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
