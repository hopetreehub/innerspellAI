'use server';

/**
 * @fileOverview 이 파일은 사용 가능한 상담사 목록을 가져오는 Genkit 도구를 정의합니다.
 */

import { ai } from '@/ai/genkit';
import { consultants } from '@/lib/consultants';
import { z } from 'zod';

// AI 프롬프트가 사용할 상담사 데이터의 간소화된 스키마
const ConsultantForAISchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  keywords: z.array(z.string()),
});

export const getConsultantsTool = ai.defineTool(
  {
    name: 'getConsultants',
    description: '추천할 수 있는 상담사 전체 목록을 가져옵니다. 최종 추천을 할 때 반드시 이 도구를 사용해야 합니다.',
    outputSchema: z.array(ConsultantForAISchema),
  },
  async () => {
    // 실제 앱에서는 이 부분에서 데이터베이스를 조회합니다.
    // 이 도구는 AI가 추천을 하기 위해 사용 가능한 상담사 목록을 반환합니다.
    return consultants.map(c => ({
      id: c.id,
      name: c.name,
      specialty: c.specialty,
      keywords: c.keywords,
    }));
  }
);
