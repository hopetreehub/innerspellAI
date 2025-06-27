import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Shield, Briefcase } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-150px)] items-center justify-center py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">이너스펠허브 로그인</CardTitle>
          <CardDescription>
            이용하실 서비스 유형을 선택해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="#">
              <User className="mr-2" />
              고객으로 로그인
            </Link>
          </Button>
          <Button asChild variant="secondary" className="w-full" size="lg">
            <Link href="#">
              <Briefcase className="mr-2" />
              상담사로 로그인
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full" size="lg">
            <Link href="#">
              <Shield className="mr-2" />
              관리자로 로그인
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
