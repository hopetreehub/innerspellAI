'use server';

/**
 * @fileOverview 이 파일은 사용자와의 대화를 통해 최적의 영적 상담사를 추천하는
 * AI 챗봇 플로우를 정의합니다. `getChatbotResponse` 함수, `ChatbotInput` 타입,
 * 그리고 `ChatbotOutput` 타입을 내보냅니다.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getConsultantsTool } from '@/ai/tools/consultant-tool';

// 챗봇 플로우의 입력 스키마 정의
const ChatbotInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).describe('사용자와 챗봇 간의 대화 기록'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

// 추천된 상담사에 대한 스키마
const RecommendedConsultantSchema = z.object({
  id: z.string().describe('추천된 상담사의 고유 ID'),
  reason: z.string().describe('이 상담사를 추천하는 명확하고 상세한 이유.'),
});

// 챗봇 플로우의 출력 스키마 정의
const ChatbotOutputSchema = z.object({
  response: z.string().describe('사용자에게 보여줄 챗봇의 다음 응답 메시지.'),
  recommendations: z
    .array(RecommendedConsultantSchema)
    .optional()
    .describe('사용자의 요구사항 분석 후 추천하는 상담사 목록. 추천 시에는 반드시 3명을 추천해야 합니다.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

// 클라이언트에서 호출할 서버 액션 함수
export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

// AI의 행동 지침: 더 유연하고 안정적인 방식으로 수정
const chatbotSystemPrompt = `당신은 '이너스펠 AI'입니다. 사용자가 자신의 고민과 성향에 가장 잘 맞는 영적 상담사를 찾도록 돕는, 지능적이고 공감 능력 높은 AI 어시스턴트입니다.

당신의 목표는 사용자와 자연스러운 대화를 나누며 사용자의 요구사항(예: 고민 분야, 선호하는 상담 스타일, 가격대 등)을 파악하는 것입니다.

충분한 정보가 모였다고 판단되면, 반드시 'getConsultants' 도구를 사용하여 추천 가능한 전체 상담사 목록을 가져와야 합니다.

그 목록과 사용자의 요구사항을 비교 분석하여, 가장 적합한 상담사 3명을 추천해주세요. 각 추천에는 명확하고 설득력 있는 추천 이유를 포함해야 합니다.

사용자가 충분한 정보를 제공하기 전까지는 절대로 상담사를 추천하거나 도구를 사용해서는 안 됩니다. 대신, 더 나은 추천을 위해 필요한 추가 정보를 부드럽게 질문해주세요.`;


// 챗봇 로직을 처리하는 Genkit 플로우
const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    try {
      const conversationHistory = input.messages.map(msg => ({
        role: msg.role === 'assistant' ? ('model' as const) : ('user' as const),
        content: [{ text: msg.content }]
      }));

      const result = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        history: conversationHistory,
        system: chatbotSystemPrompt,
        tools: [getConsultantsTool],
        output: {
          schema: ChatbotOutputSchema,
        },
      });

      const output = result.output;

      if (!output) {
        console.error("AI output is null or doesn't match the expected schema.", result);
        return { response: "죄송합니다. AI가 유효한 응답을 생성하지 못했습니다. 응답 형식이 올바르지 않을 수 있습니다. 다시 시도해주세요." };
      }

      return output;
    } catch (error) {
      console.error("Chatbot flow error:", error);
      return {
        response: "죄송합니다. AI 서비스 연결에 실패했습니다. API 키가 유효하지 않거나 관련 클라우드 서비스가 활성화되지 않았을 수 있습니다. 관리자에게 문의하여 AI 설정을 확인해주세요."
      };
    }
  }
);
