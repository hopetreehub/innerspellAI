
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    try {
      const isAdmin = localStorage.getItem('isAdminAuthenticated') === 'true';
      if (!isAdmin) {
        router.replace('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
       console.error("Could not access localStorage", error);
       router.replace('/admin/login');
    } finally {
        setIsCheckingAuth(false);
    }
  }, [router]);
  
  const handleLogout = () => {
    try {
      localStorage.removeItem('isAdminAuthenticated');
      router.push('/admin/login');
    } catch (error) {
      toast({
        title: '로그아웃 오류',
        description: '오류가 발생했습니다. 페이지를 새로고침해주세요.',
        variant: 'destructive',
      });
    }
  };
  
  if (isCheckingAuth || !isAuthenticated) {
      return (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              <p>인증 확인 중...</p>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-headline">관리자 페이지</CardTitle>
              <CardDescription>
                이곳에서 앱의 다양한 기능을 관리할 수 있습니다.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="font-semibold">현재 개발 중인 공간입니다.</p>
            <p className="text-sm mt-2">상담사 및 고객 관리 기능이 추가될 예정입니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
