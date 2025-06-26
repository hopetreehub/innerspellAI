'use server';

/**
 * @fileOverview 이 파일은 사용자의 프로필과 선호도를 분석하여 가장 적합한 상담사를 매칭하는
 * AI 스펠 매칭 플로우를 정의합니다. `matchConsultant` 함수, `MatchConsultantInput` 타입,
 * 그리고 `MatchConsultantOutput` 타입을 내보냅니다.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchConsultantInputSchema = z.object({
  profileData: z.string().describe('선호도, 고민, 과거 상호작용을 포함한 사용자 프로필 데이터.'),
  consultantSpecialties: z.array(z.string()).describe('상담가들의 전문 분야 목록 (예: 타로, 점성술).'),
});

export type MatchConsultantInput = z.infer<typeof MatchConsultantInputSchema>;

const MatchConsultantOutputSchema = z.object({
  specialty: z.string().describe('가장 잘 맞는 상담가의 전문 분야 (예: 타로, 점성술).'),
  matchReason: z.string().describe('이 상담가가 사용자에게 가장 적합한 이유에 대한 설명.'),
});

export type MatchConsultantOutput = z.infer<typeof MatchConsultantOutputSchema>;

export async function matchConsultant(input: MatchConsultantInput): Promise<MatchConsultantOutput> {
  return matchConsultantFlow(input);
}

const matchConsultantPrompt = ai.definePrompt({
  name: 'matchConsultantPrompt',
  input: {
    schema: MatchConsultantInputSchema,
  },
  output: {
    schema: MatchConsultantOutputSchema,
  },
  prompt: `당신은 사용자의 필요와 선호도에 맞춰 최고의 영적 상담가를 연결해주는 AI 비서입니다.

다음 사용자 프로필 데이터를 분석하세요:
{{{profileData}}}

사용자의 프로필과 선택 가능한 상담가 전문 분야를 고려하여: {{{consultantSpecialties}}},

가장 적합한 상담가 전문 분야를 결정하고 왜 잘 맞는지 설명해주세요.

상담가의 전문 분야와 상세한 추천 이유를 반환해주세요.
`,
});

const matchConsultantFlow = ai.defineFlow(
  {
    name: 'matchConsultantFlow',
    inputSchema: MatchConsultantInputSchema,
    outputSchema: MatchConsultantOutputSchema,
  },
  async input => {
    const {output} = await matchConsultantPrompt(input);
    return output!;
  }
);
