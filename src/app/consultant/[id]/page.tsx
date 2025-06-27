'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { getConsultantById } from '@/lib/consultants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Star, Phone, MessageSquarePlus, PenSquare, Wallet, ThumbsUp, Share2, MessageCircle, Lock, Unlock, CornerDownRight, Gift } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

function SummaryBar({ label, value, total }: { label: string, value: number, total: number }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <Progress value={percentage} className="h-2 flex-1 bg-muted" />
      <span className="w-8 shrink-0 text-right font-medium text-foreground">{value}</span>
    </div>
  );
}


export default function ConsultantDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const consultant = getConsultantById(id);

  if (!consultant) {
    notFound();
  }
  
  const totalStyleReviews = consultant.reviewSummary ? Object.values(consultant.reviewSummary.style).reduce((a, b) => a + b, 0) : 0;
  const totalFieldReviews = consultant.reviewSummary ? Object.values(consultant.reviewSummary.field).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative w-full aspect-[4/5]">
              <Image
                src={consultant.image}
                alt={consultant.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <CardContent className="p-4">
              <h1 className="font-headline text-2xl font-bold">{consultant.name}</h1>
              <p className="text-md text-muted-foreground font-semibold">[{consultant.phoneId}] {consultant.specialty}</p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                <Wallet className="w-4 h-4"/>
                <span>30초당 {consultant.price.toLocaleString()}원</span>
             </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button size="lg" className="w-full text-lg h-12" asChild>
                <Link href={`tel:060-700-1234,${consultant.phoneId}`}>
                  <Phone className="mr-2"/>
                  전화상담
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="w-full text-lg h-12" asChild>
                 <Link href={`/inquiry/${consultant.id}`}>
                    <MessageSquarePlus className="mr-2"/>
                    1:1 문의
                 </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
                <CardTitle className="text-lg">전문분야</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {consultant.keywords.map(keyword => (
                        <Badge key={keyword} variant="outline" className="text-md px-3 py-1">{keyword}</Badge>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">프로필</TabsTrigger>
              <TabsTrigger value="inquiries">1:1 문의</TabsTrigger>
              <TabsTrigger value="reviews">고객 후기</TabsTrigger>
              <TabsTrigger value="posts">상담사 칼럼</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>상담사 소개</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{consultant.bio}</ReactMarkdown>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inquiries Tab */}
            <TabsContent value="inquiries" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle>1:1 문의</CardTitle>
                      <CardDescription>
                        상담사에게 궁금한 점을 직접 문의하고 답변을 받아보세요.
                      </CardDescription>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/inquiry/${consultant.id}`}>
                        <MessageSquarePlus className="mr-2" />
                        1:1 문의하기
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {consultant.inquiries.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {consultant.inquiries.map((inquiry, index) => (
                        <AccordionItem value={`item-${index}`} key={inquiry.id}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-center gap-4 flex-1">
                              {inquiry.isPrivate ? (
                                <Lock className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <Unlock className="w-5 h-5 text-primary" />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold">{inquiry.isPrivate ? '비밀글입니다.' : inquiry.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>{inquiry.author}</span>
                                  <span>·</span>
                                  <span>{inquiry.createdAt}</span>
                                </div>
                              </div>
                              {!inquiry.answer && !inquiry.isPrivate && <Badge variant="outline">답변대기</Badge>}
                              {inquiry.answer && !inquiry.isPrivate && <Badge variant="secondary" className="text-secondary-foreground">답변완료</Badge>}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pl-12 pr-4">
                            {inquiry.isPrivate ? (
                              <p className="text-muted-foreground italic">
                                비밀글은 작성자와 상담사만 열람할 수 있습니다.
                              </p>
                            ) : (
                              <div className="space-y-4">
                                <p className="whitespace-pre-wrap">{inquiry.content}</p>
                                {inquiry.answer && (
                                  <div className="mt-4 p-4 bg-muted/50 rounded-md border">
                                    <h4 className="font-semibold text-primary flex items-center gap-2">
                                       <CornerDownRight className="w-4 h-4" />
                                      {consultant.name}님의 답변
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1 mb-2">{inquiry.answer.createdAt}</p>
                                    <p className="whitespace-pre-wrap">{inquiry.answer.content}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>아직 등록된 1:1 문의가 없습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>고객 후기</CardTitle>
                                <CardDescription>실제 상담을 받은 고객님들의 생생한 후기입니다.</CardDescription>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href={`/review/new/${consultant.id}`}>
                                    <PenSquare className="mr-2"/>후기 작성하기
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                       {/* Review Summary Section */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="p-4 bg-muted/30 border-0">
                                <CardDescription>총 상담 후기</CardDescription>
                                <CardTitle className="text-4xl">{consultant.reviewCount}<span className="text-lg font-medium ml-1">건</span></CardTitle>
                            </Card>
                            <Card className="p-4 bg-muted/30 border-0">
                                <CardDescription>5점 만족도</CardDescription>
                                <div className="flex items-baseline gap-2">
                                <CardTitle className="text-4xl">{consultant.satisfaction || 95}<span className="text-lg font-medium ml-1">%</span></CardTitle>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                                </div>
                                </div>
                            </Card>
                            </div>

                            <div className="bg-muted/30 rounded-lg p-3 text-center text-sm text-primary flex items-center justify-center gap-2 font-semibold">
                                <Gift className="w-4 h-4 text-yellow-500"/>
                                후기 작성 시 코인을 선물로 드립니다!
                            </div>

                            {consultant.reviewSummary && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-4">
                                  <h4 className="font-semibold">상담스타일 😊</h4>
                                  <div className="space-y-3">
                                    {Object.entries(consultant.reviewSummary.style).map(([label, value]) => (
                                      <SummaryBar key={label} label={label} value={value} total={totalStyleReviews} />
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="font-semibold">상담분야 💖</h4>
                                  <div className="space-y-3">
                                    {Object.entries(consultant.reviewSummary.field).map(([label, value]) => (
                                      <SummaryBar key={label} label={label} value={value} total={totalFieldReviews} />
                                    ))}
                                  </div>
                                </div>
                            </div>
                            )}
                        </div>

                       <Separator />

                       {/* Existing Reviews List */}
                       <div className="space-y-6">
                           <h3 className="font-semibold text-lg">전체 후기 ({consultant.reviewCount}개)</h3>
                           {consultant.reviews.map(review => (
                             <div key={review.id} className="space-y-2 border-b border-border pb-4 last:border-b-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold">{review.author}</h4>
                                        <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-secondary fill-secondary' : 'text-muted-foreground/30'}`} />
                                        ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                                </div>
                                <p className="text-sm text-foreground/90 bg-muted/50 p-3 rounded-md">{review.comment}</p>
                             </div>
                           ))}
                       </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-6">
                <Card>
                     <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                               <CardTitle>상담사 칼럼</CardTitle>
                               <CardDescription>{consultant.name}님이 직접 작성한 칼럼입니다.</CardDescription>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/posts/new">
                                    <PenSquare className="mr-2"/>칼럼 작성하기
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                       {consultant.posts.map(post => (
                         <div key={post.id} className="border-b border-border pb-6 last:border-none last:pb-0">
                            <h4 className="font-semibold text-xl hover:text-primary transition-colors cursor-pointer">{post.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{post.createdAt}</p>
                            <p className="text-base text-foreground/80 mt-4 leading-relaxed">{post.content}</p>

                            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                               <Button variant="ghost" size="sm"><ThumbsUp className="mr-2"/>공감 (12)</Button>
                               <Button variant="ghost" size="sm"><Share2 className="mr-2"/>공유</Button>
                            </div>

                            <div className="mt-6 space-y-4">
                                <h5 className="font-semibold flex items-center gap-2"><MessageCircle className="w-4 h-4" /> 댓글 (2)</h5>
                                {/* Existing Comments */}
                                <div className="space-y-3 text-sm">
                                    <div className="bg-muted/50 p-3 rounded-md">
                                        <p className="font-semibold">사용자1</p>
                                        <p className="text-foreground/80">좋은 글 감사합니다!</p>
                                    </div>
                                    <div className="bg-muted/50 p-3 rounded-md">
                                        <p className="font-semibold">사용자2</p>
                                        <p className="text-foreground/80">많은 도움이 되었습니다.</p>
                                    </div>
                                </div>
                                {/* New Comment Form */}
                                <div className="flex items-start gap-2">
                                   <Textarea placeholder="댓글을 입력하세요..." className="min-h-[60px]" />
                                   <Button>등록</Button>
                                </div>
                            </div>
                         </div>
                       ))}
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
