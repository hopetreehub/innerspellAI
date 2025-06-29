'use client';

import { useState, useMemo } from 'react';
import type { Consultant } from '@/types/consultant';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { ConsultantCard } from './consultant-card';

export function ConsultantBrowser({ consultants }: { consultants: Omit<Consultant, 'reviews' | 'posts' | 'inquiries' | 'satisfaction' | 'reviewSummary'>[] }) {
  const specialties = useMemo(() => ['전체', ...Array.from(new Set(consultants.map(c => c.specialty)))], [consultants]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
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
  );
}
