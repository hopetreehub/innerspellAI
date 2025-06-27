'use server';

/**
 * @fileOverview 이 파일은 사용자와의 대화를 통해 최적의 영적 상담사를 추천하는
 * AI 챗봇 플로우를 정의합니다. `getChatbotResponse` 함수, `ChatbotInput` 타입,
 * 그리고 `ChatbotOutput` 타입을 내보냅니다.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// 컨설턴트 데이터의 Zod 스키마 정의
const ConsultantSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  keywords: z.array(z.string()),
  // AI가 참고할 수 있는 다른 필드들을 추가할 수 있습니다.
});

// 챗봇 플로우의 입력 스키마 정의
export const ChatbotInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).describe('사용자와 챗봇 간의 대화 기록'),
  consultants: z.array(ConsultantSchema).describe('추천 가능한 상담사 목록'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

// 챗봇 플로우의 출력 스키마 정의
export const ChatbotOutputSchema = z.object({
  response: z.string().describe('챗봇의 다음 응답 메시지'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

// 클라이언트에서 호출할 서버 액션 함수
export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

// 챗봇의 행동을 정의하는 프롬프트
const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `당신은 '이너스펠 AI'입니다. 사용자가 자신의 고민에 가장 잘 맞는 영적 상담사를 찾을 수 있도록 돕는 친절하고 전문적인 챗봇입니다.

당신의 목표는 사용자와의 대화를 통해 필요한 정보를 수집하고, 이를 바탕으로 아래 제공된 상담사 목록에서 최적의 인물을 추천하는 것입니다.

사용 가능한 상담사 목록:
{{{json consultants}}}

대화는 다음 규칙을 따라 진행해주세요:
1.  항상 한 번에 한 가지 질문만 합니다.
2.  사용자가 선택하기 쉽도록 가능한 경우 여러 선택지를 버튼 형태로 제시하세요. (예: [선택지1], [선택지2])
3.  수집해야 할 정보:
    - 주된 고민 분야 (예: 연애, 직업, 금전, 인간관계)
    - 선호하는 상담 스타일 (예: 따뜻하고 공감적인, 명쾌하고 직설적인)
    - 선호하는 상담사 성별 (예: 남성, 여성, 상관없음)
    - 관심있는 상담 종류 (예: 타로, 사주, 신점 등)
4.  모든 정보가 수집되면, 사용자의 답변과 상담사 목록의 'keywords'를 종합적으로 분석하여 가장 적합한 상담사 한 명을 추천합니다.
5.  추천 시에는 상담사의 이름, 전문 분야를 명시하고, 왜 그 상담사를 추천하는지에 대한 이유를 구체적으로 설명해주세요.
6.  대화가 끝나면 마지막에 더 궁금한 점이 있는지 물어보세요.

대화 기록:
{{#each messages}}
- {{role}}: {{content}}
{{/each}}

이제 사용자의 다음 메시지에 응답할 차례입니다. 대화의 흐름에 맞춰 가장 적절한 다음 말을 생성해주세요.
`,
});

// 챗봇 로직을 처리하는 Genkit 플로우
const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    // Gemini API 호출 시 API 키가 없으면 에러를 던질 수 있으므로, 환경 변수 확인
    if (!process.env.GEMINI_API_KEY) {
      return {
        response: 'AI 기능을 설정하는 중 오류가 발생했습니다. 관리자에게 문의해주세요. (API 키가 설정되지 않았습니다.)'
      };
    }

    try {
        const { output } = await chatbotPrompt(input);
        return output || { response: "죄송합니다. 응답을 생성하는 데 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
    } catch (error) {
        console.error("Chatbot flow error:", error);
        return { response: "죄송합니다. AI 서비스 연결에 실패했습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요." };
    }
  }
);
