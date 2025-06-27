'use server';

/**
 * @fileOverview 이 파일은 사용자와의 대화를 통해 최적의 영적 상담사를 추천하는
 * AI 챗봇 플로우를 정의합니다. getChatbotResponse 함수를 내보냅니다.
 * 이 버전은 안정성 확보를 위해 단순화되었습니다.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getConsultantsTool } from '@/ai/tools/consultant-tool';

// 입력 스키마는 동일하게 유지
const ChatbotInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

// 출력을 단순 문자열로 변경하여 안정성 확보
const ChatbotOutputSchema = z.string();
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

// 클라이언트에서 호출할 서버 액션 함수
export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

// AI의 행동 지침을 단순화하여 AI가 더 유연하게 반응하도록 함
const chatbotSystemPrompt = `당신은 사용자의 고민에 맞는 영적 상담사를 추천하는 AI 어시스턴트입니다.
대화를 통해 사용자의 고민과 선호하는 상담 스타일을 파악하세요.
추천이 필요하다고 판단되면, 'getConsultants' 도구를 사용해 상담사 목록을 조회한 후, 그 정보를 바탕으로 가장 적합한 상담사 3명을 추천해주세요.
추천할 때는 각 상담사의 이름, 전문 분야, 그리고 추천하는 이유를 명확하게 설명해야 합니다.`;

// 챗봇 로직을 처리하는 Genkit 플로우
const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    try {
      const history = input.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        content: [{ text: msg.content }],
      }));
      
      const result = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        history,
        system: chatbotSystemPrompt,
        tools: [getConsultantsTool],
        // 복잡한 출력 스키마를 제거하여 AI의 부담을 줄이고 안정성을 높입니다.
      });

      return result.text;

    } catch (error) {
      console.error("Chatbot flow error:", error);
      return "죄송합니다. AI 서비스 연결에 실패했습니다. API 키가 유효하지 않거나 관련 클라우드 서비스가 활성화되지 않았을 수 있습니다. 관리자에게 문의하여 AI 설정을 확인해주세요.";
    }
  }
);
