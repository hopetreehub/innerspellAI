
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewPostPage() {

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
       <Button variant="ghost" asChild className="mb-4">
            <Link href={`/`}> {/* TODO: Go back to previous page or consultant detail page */}
                <ArrowLeft className="mr-2"/>
                돌아가기
            </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">새 칼럼 작성하기</CardTitle>
          <CardDescription>
            당신의 지식과 경험을 공유하여 사람들에게 영감을 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" placeholder="칼럼의 제목을 입력하세요." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea id="content" placeholder="칼럼 내용을 마크다운 형식으로 작성할 수 있습니다." className="min-h-[400px]" />
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-end">
            <Button type="submit" size="lg">
              칼럼 등록하기
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
