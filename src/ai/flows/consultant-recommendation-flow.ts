
'use server';

/**
 * @fileOverview 이 파일은 사용자와의 대화를 통해 최적의 영적 상담사를 추천하는
 * AI 챗봇 플로우를 정의합니다. `getChatbotResponse` 함수, `ChatbotInput` 타입,
 * 그리고 `ChatbotOutput` 타입을 내보냅니다.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getAiConfig } from '@/lib/ai-config';

// 컨설턴트 데이터의 Zod 스키마 정의
const ConsultantSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  keywords: z.array(z.string()),
});

// 챗봇 플로우의 입력 스키마 정의
const ChatbotInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).describe('사용자와 챗봇 간의 대화 기록'),
  consultants: z.array(ConsultantSchema).describe('추천 가능한 상담사 목록'),
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
    .describe('사용자의 요구사항 분석 후 추천하는 상담사 목록 (정확히 3명). 정보가 부족하면 비워둡니다.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

// 클라이언트에서 호출할 서버 액션 함수
export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

// 챗봇 로직을 처리하는 Genkit 플로우
const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    try {
        const aiConfig = await getAiConfig();

        const systemPrompt = aiConfig.systemPrompt.replace(
            '{{{json consultants}}}',
            JSON.stringify(input.consultants)
        );

        const history = input.messages.map(msg => ({
            role: msg.role === 'assistant' ? ('model' as const) : ('user' as const),
            content: [{ text: msg.content }]
        }));

        const result = await ai.generate({
            model: aiConfig.model,
            history: history,
            prompt: '', // We pass the full conversation in `history`, so the main prompt is empty.
            system: systemPrompt,
            output: {
                schema: ChatbotOutputSchema,
                format: 'json',
            },
        });
        
        const output = result.output;
        
        if (!output) {
            return { response: "죄송합니다. AI가 유효한 응답을 생성하지 못했습니다. 다시 시도해주세요." };
        }
        
        return output;
    } catch (error) {
        console.error("Chatbot flow error:", error);
        if (error instanceof Error) {
          console.error("Detailed Error Message:", error.message);
        }
        return { 
            response: "죄송합니다. AI 서비스 연결에 실패했습니다. API 키가 유효하지 않거나 관련 클라우드 서비스가 활성화되지 않았을 수 있습니다. 관리자에게 문의하여 AI 설정을 확인해주세요." 
        };
    }
  }
);
