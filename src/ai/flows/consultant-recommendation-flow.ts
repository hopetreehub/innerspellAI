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

// 챗봇의 행동을 정의하는 프롬프트
const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `당신은 '이너스펠 AI'입니다. 사용자가 자신의 고민에 가장 잘 맞는 영적 상담사를 찾을 수 있도록 돕는 친절하고 전문적인 챗봇입니다.

당신의 목표는 사용자와의 대화를 통해 필요한 정보를 수집하고, 이를 바탕으로 아래 제공된 상담사 목록에서 최적의 인물 3명을 추천하는 것입니다.

사용 가능한 상담사 목록:
{{{json consultants}}}

대화는 다음 규칙을 따라 진행해주세요:
1.  항상 한 번에 한 가지 질문만 합니다.
2.  사용자가 선택하기 쉽도록 가능한 경우 여러 선택지를 버튼 형태로 제시하세요. (예: [선택지1], [선택지2])
3.  필요한 정보를 수집하기 위해 먼저 몇 가지 선택형 질문을 합니다. (고민 분야, 상담 스타일 등)
4.  선택형 질문이 끝나면, "더 구체적으로 어떤 점이 궁금하신가요?" 라고 물어 사용자의 자유로운 의견을 입력받습니다.
5.  모든 정보(선택형 답변 + 자유 의견)가 수집되었다고 판단되면, 사용자의 답변과 상담사 목록의 'keywords' 및 'specialty'를 종합적으로 분석하여 가장 적합한 상담사 3명을 추천합니다.
6.  추천 시에는 'response' 필드에 "당신의 이야기를 종합해볼 때, 이 세 분의 상담사님을 추천해 드려요."와 같은 마무리 메시지를 담아주세요.
7.  'recommendations' 필드에는 추천하는 각 상담사의 'id'와 'reason'을 포함하여 정확히 3명의 상담사 정보를 배열 형태로 채워주세요. 'reason'은 왜 그 상담사가 사용자에게 적합한지를 구체적이고 설득력 있게 작성해야 합니다.
8.  충분한 정보가 모이기 전까지는 'recommendations' 필드를 비워두고 'response' 필드에 다음 질문만 담아 응답합니다.

대화 기록:
{{#each messages}}
- {{role}}: {{content}}
{{/each}}

이제 사용자의 다음 메시지에 응답할 차례입니다. 대화의 흐름에 맞춰 가장 적절한 다음 말을 생성하고, 추천 단계라면 recommendations 필드도 채워주세요.
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
