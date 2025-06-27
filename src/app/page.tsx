'use client';

import { useState } from 'react';
import { ConsultantCard } from '@/components/consultant-card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { consultants } from '@/lib/consultants';
import type { Consultant } from '@/types/consultant';

const specialties = ['전체', ...Array.from(new Set(consultants.map(c => c.specialty)))];

export default function Home() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const consultantsPerPage = 24;

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setCurrentPage(1);
  };

  const filteredConsultants = selectedSpecialty === '전체'
    ? consultants
    : consultants.filter(c => c.specialty === selectedSpecialty);

  const totalPages = Math.ceil(filteredConsultants.length / consultantsPerPage);
  const currentConsultants = filteredConsultants.slice(
    (currentPage - 1) * consultantsPerPage,
    currentPage * consultantsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-16">
      
      <section className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden flex items-center justify-center text-center text-white p-4">
        <Image 
          src="/images/hero.jpg"
          alt="신비로운 우주 배경"
          fill
          className="object-cover animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-900/40 to-black/70 animate-gradient-pulse" style={{ backgroundSize: '200% 200%' }} />
        <div className="relative z-10 w-full animate-fade-in-up">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                운명의 길잡이를 찾아보세요
            </h1>
            <p className="text-white/80 mt-4 text-lg max-w-2xl mx-auto">
                당신의 고민에 꼭 맞는 최고의 상담사를 만나보세요.
            </p>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="font-headline text-3xl font-bold">상담사 전체보기</h2>
        </div>
        <p className="text-muted-foreground mt-1 mb-6">당신에게 맞는 상담사를 찾아보세요.</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? 'default' : 'outline'}
              onClick={() => handleSpecialtyChange(specialty)}
              className="rounded-full"
            >
              {specialty}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentConsultants.map((consultant) => (
                <ConsultantCard key={consultant.id} consultant={consultant as Consultant} />
            ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
              <Pagination>
                  <PaginationContent>
                      <PaginationItem>
                          <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                              <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={currentPage === i + 1}>
                                  {i + 1}
                              </PaginationLink>
                          </PaginationItem>
                      ))}
                      <PaginationItem>
                          <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
                      </PaginationItem>
                  </PaginationContent>
              </Pagination>
          </div>
        )}
      </section>
    </div>
  );
}
