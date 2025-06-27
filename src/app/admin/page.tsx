
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getAiConfig, saveAiConfig, type AiConfig } from '@/lib/ai-config';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [isSaving, startSavingTransition] = useTransition();
  
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
  
  useEffect(() => {
    if (isAuthenticated) {
      startSavingTransition(async () => {
        const loadedConfig = await getAiConfig();
        setConfig(loadedConfig);
      });
    }
  }, [isAuthenticated]);

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

  const handleSave = () => {
    if (!config) return;
    startSavingTransition(async () => {
      try {
        await saveAiConfig(config);
        toast({
          title: '저장 완료',
          description: 'AI 설정이 성공적으로 저장되었습니다.',
        });
      } catch (error) {
        toast({
          title: '저장 실패',
          description: '설정을 저장하는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
        console.error(error);
      }
    });
  };

  const handleModelChange = (model: string) => {
    if (!config) return;
    setConfig({ ...config, model });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!config) return;
    setConfig({ ...config, systemPrompt: e.target.value });
  };
  
  if (isCheckingAuth || !isAuthenticated) {
      return (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              <p>인증 확인 중...</p>
          </div>
      );
  }
  
  if (!config) {
      return (
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
             <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full max-w-md" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-28 ml-auto" />
                </CardFooter>
             </Card>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-headline">AI 챗봇 설정</CardTitle>
              <CardDescription>
                AI 챗봇의 모델과 행동 지침(시스템 프롬프트)을 관리합니다.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model-select">AI 모델 선택</Label>
            <Select value={config.model} onValueChange={handleModelChange}>
              <SelectTrigger id="model-select">
                <SelectValue placeholder="AI 모델을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="googleai/gemini-1.5-flash-latest">
                  Gemini 1.5 Flash (빠른 속도, 비용 효율적)
                </SelectItem>
                <SelectItem value="googleai/gemini-1.5-pro-latest">
                  Gemini 1.5 Pro (고성능, 유료)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              모델 변경 시 응답 속도와 비용, 성능이 달라질 수 있습니다.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="system-prompt">시스템 프롬프트 (행동 지침)</Label>
            <Textarea
              id="system-prompt"
              value={config.systemPrompt}
              onChange={handlePromptChange}
              className="min-h-[500px] font-mono text-xs leading-5"
              placeholder="AI 챗봇의 행동 지침을 여기에 입력하세요."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
            {isSaving ? '저장 중...' : '설정 저장하기'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
