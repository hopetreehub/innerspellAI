'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate network delay
        setTimeout(() => {
            if (username === 'admin' && password === 'admin') {
                try {
                    localStorage.setItem('isAdminAuthenticated', 'true');
                    router.push('/admin');
                } catch (error) {
                    toast({
                        title: '로그인 오류',
                        description: '로컬 스토리지에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.',
                        variant: 'destructive',
                    });
                }
            } else {
                toast({
                    title: '로그인 실패',
                    description: '아이디 또는 비밀번호가 일치하지 않습니다.',
                    variant: 'destructive',
                });
            }
            setIsSubmitting(false);
        }, 500);
    };

    return (
        <div className="container flex min-h-[calc(100vh-150px)] items-center justify-center py-12">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full mb-4">
                        <Lock className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-headline">관리자 로그인</CardTitle>
                    <CardDescription>
                        관리자 계정으로 로그인해주세요.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">아이디</Label>
                            <Input 
                                id="username" 
                                type="text" 
                                placeholder="admin" 
                                required 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="admin"
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? '로그인 중...' : '로그인'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
