import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-150px)] items-center justify-center py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">로그인</CardTitle>
          <CardDescription>
            이너스펠에 오신 것을 환영합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="email@example.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">비밀번호</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                비밀번호를 잊으셨나요?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" size="lg">
            로그인
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
            계정이 없으신가요?&nbsp;
            <Link href="#" className="underline">
                회원가입
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
