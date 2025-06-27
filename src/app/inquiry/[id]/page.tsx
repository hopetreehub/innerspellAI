
'use client';

import { notFound, useParams } from 'next/navigation';
import { getConsultantById } from '@/lib/consultants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function InquiryPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const consultant = getConsultantById(id);

  if (!consultant) {
    notFound();
  }

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
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" placeholder="문의 제목을 입력해주세요." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea id="content" placeholder="문의 내용을 상세하게 입력해주세요." className="min-h-[200px]" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="private" />
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
