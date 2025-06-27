'use server';

/**
 * @fileOverview 이 파일은 '오늘의 스펠카드'에 표시될 동적 메시지를 생성하는 AI 플로우를 정의합니다.
 * `getDailySpell` 함수와 그 출력 타입 `DailySpellOutput`을 내보냅니다.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DailySpellOutputSchema = z.object({
  title: z.string().describe("카드 뒷면에 표시될 짧고 매력적인 제목 (예: '용기의 불꽃', '지혜의 샘물')."),
  description: z.string().describe("사용자에게 영감을 주는 1-2문장의 설명."),
});

export type DailySpellOutput = z.infer<typeof DailySpellOutputSchema>;

export async function getDailySpell(): Promise<DailySpellOutput> {
  return dailySpellFlow();
}

const dailySpellPrompt = ai.definePrompt({
  name: 'dailySpellPrompt',
  output: {
    schema: DailySpellOutputSchema,
  },
  prompt: `당신은 신비로운 오라클입니다. 사용자의 하루를 위해 영감을 주는 짧은 메시지를 생성합니다.
  
오늘의 운세 카드처럼 작동하며, 긍정적이고 희망적인 메시지를 담아야 합니다.
카드 제목과 한두 문장의 설명을 반환해주세요.`,
});


const dailySpellFlow = ai.defineFlow(
  {
    name: 'dailySpellFlow',
    outputSchema: DailySpellOutputSchema,
  },
  async () => {
    const { output } = await dailySpellPrompt({});
    return output!;
  }
);
