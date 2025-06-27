
'use server';

/**
 * @fileOverview 이 파일은 AI 챗봇의 핵심 로직을 담고 있습니다.
 * 현재는 AI 서비스와의 연결 자체를 테스트하기 위한 가장 단순한 형태로 구현되어 있습니다.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// 입력 스키마는 프론트엔드와의 호환성을 위해 유지하지만, 실제 로직에서는 사용하지 않습니다.
const ChatbotInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.string();
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

// AI 연결을 확인하기 위한 가장 단순한 테스트 플로우
const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    try {
      // 모든 복잡한 로직(히스토리 처리, 시스템 프롬프트 등)을 제거하고,
      // 가장 기본적인 프롬프트만으로 ai.generate 호출을 테스트합니다.
      const result = await ai.generate({
        prompt: "Hello, world. If you can read this, the connection is successful.",
      });

      // 성공 시, AI의 응답에 성공 메시지를 덧붙여 반환합니다.
      return `[연결 테스트 성공] AI가 응답했습니다: "${result.text}"`;

    } catch (error) {
      console.error("AI 연결 '최종 진단' 중 심각한 오류 발생:", error);
      // 이 메시지가 표시된다면, 문제는 코드 외부(API 키, 클라우드 프로젝트 설정)에 있을 확률이 매우 높습니다.
      return "AI 서비스와의 기본 연결 테스트에 실패했습니다. API 키가 유효한지, Google Cloud 프로젝트에서 'Generative Language API'가 활성화되어 있는지, 그리고 프로젝트에 결제 계정이 연결되어 있는지 다시 한번 확인해주세요.";
    }
  }
);
