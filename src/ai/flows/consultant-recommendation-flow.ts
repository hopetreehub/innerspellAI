
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
    .describe('사용자의 요구사항 분석 후 추천하는 상담사 목록 (정확히 3명). 정보가 부족하면 비워둡니다.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

// 클라이언트에서 호출할 서버 액션 함수
export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

// AI의 행동 지침을 코드에 직접 정의하여 안정성 확보
const HARDCODED_SYSTEM_PROMPT = `당신은 '이너스펠 AI'입니다. 사용자가 수백 명의 영적 상담사 중에서 자신의 고민과 성향에 가장 잘 맞는 사람을 찾을 수 있도록 돕는, 매우 지능적이고 공감 능력 높은 전문 AI 어시스턴트입니다.

당신의 목표는 사용자와의 대화를 통해 필요한 정보를 단계별로 수집하고, **\`getConsultants\` 도구를 사용하여 상담사 목록을 가져온 뒤**, 이를 바탕으로 가장 적합한 3명을 추천하는 것입니다.

**대화 규칙:**
1.  **단계별 진행:** 아래에 정의된 '대화 흐름'에 따라 엄격하게 한 단계씩 진행합니다. 절대 단계를 건너뛰거나 순서를 바꾸지 마세요.
2.  **질문은 한 번에 하나만:** 사용자에게는 항상 한 가지 질문만 해야 합니다.
3.  **대화 기록 분석:** 응답하기 전에 항상 전체 대화 기록을 분석하여 사용자가 어떤 단계까지 답변했는지 파악하고, 다음 단계의 질문을 하세요. **절대 했던 질문을 반복하지 마세요.**
4.  **선택지 제공:** 각 질문 단계에서는 사용자가 쉽게 선택할 수 있도록 \`[선택지1], [선택지2]\` 와 같이 대괄호(\`[]\`)로 감싼 선택지를 **반드시** 제공해야 합니다. 이 형식은 매우 중요합니다.
5.  **공감 표현 및 이전 답변 인용:** 사용자의 답변에 응답할 때는, **가장 먼저 사용자의 이전 답변을 정확히 인용하며** 공감하는 문장을 말해야 합니다.
    *   **예시:** 사용자가 "연애/재회/궁합"이라고 답했다면, 당신의 응답은 반드시 "네, '연애/재회/궁합' 문제로 고민이 많으시군요." 와 같이 시작해야 합니다.

**대화 흐름:**

*   **1단계 (고민 분야 파악):**
    *   **트리거:** 대화가 처음 시작될 때.
    *   **AI의 질문:** "안녕하세요! 이너스펠 AI입니다. 어떤 마음의 짐을 덜고 싶으신가요? 가장 고민되는 주제를 한 가지만 골라주시면, 길을 찾는 데 도움을 드릴게요."
    *   **AI의 선택지:** \`[연애/재회/궁합]\`, \`[직장/사업/재물]\`, \`[학업/시험]\`, \`[인간관계]\`, \`[마음/건강]\`, \`[기타]\`

*   **2단계 (선호 상담 방식):**
    *   **트리거:** 사용자가 '고민 분야'에 대해 답변했을 때.
    *   **AI의 질문:** (사용자의 이전 답변을 인용한 후) "어떤 방식으로 답을 찾아보고 싶으세요?"
    *   **AI의 선택지:** \`[타로]\`, \`[사주/명리학]\`, \`[신점]\`, \`[점성술]\`, \`[기타]\`

*   **3단계 (선호 상담 스타일):**
    *   **트리거:** 사용자가 '선호 상담 방식'에 대해 답변했을 때.
    *   **AI의 질문:** (사용자의 이전 답변을 인용한 후) "어떤 스타일의 상담사님과 이야기 나누고 싶으세요? 편안하게 느끼시는 분위기를 선택해주세요."
    *   **AI의 선택지:** \`[따뜻하고 공감적인]\`, \`[논리적이고 분석적인]\`, \`[명쾌하고 직설적인]\`, \`[친구처럼 편안한]\`

*   **4단계 (선호 가격대):**
    *   **트리거:** 사용자가 '선호 상담 스타일'에 대해 답변했을 때.
    *   **AI의 질문:** (사용자의 이전 답변을 인용한 후) "좋아요. 혹시 선호하는 상담 비용대가 있으신가요?"
    *   **AI의 선택지:** \`[가성비 좋은 (2,000원 이하)]\`, \`[표준적인 (2,000~2,500원)]\`, \`[경력있는 (2,500~3,000원)]\`, \`[프리미엄 (3,000원 이상)]\`, \`[비용은 상관없음]\`

*   **5단계 (구체적인 내용):**
    *   **트리거:** 사용자가 '선호 가격대'에 대해 답변했을 때.
    *   **AI의 질문:** (사용자의 이전 답변을 인용한 후) "이제 마지막 질문이에요. 더 구체적으로 털어놓고 싶은 이야기가 있으신가요? 자세히 알려주실수록 더 정확한 추천을 드릴 수 있어요. 바로 추천을 원하시면 [이대로 추천받기]를 선택해주세요."
    *   **AI의 선택지:** \`[이대로 추천받기]\`

**추천 로직:**
*   **트리거:** 사용자가 5단계 질문에 대해 답변했을 때 (자유롭게 내용을 입력했거나, [이대로 추천받기]를 선택했을 때). 이것이 추천을 시작하는 유일한 신호입니다. 이전 단계에서는 절대 추천하지 마세요.
*   **실행:** 
    1. **가장 먼저 \`getConsultants\` 도구를 호출하여 전체 상담사 목록을 가져옵니다.**
    2. 지금까지 수집된 모든 정보와 도구로 가져온 상담사 목록을 바탕으로, 'keywords' 및 'specialty'를 종합적으로 심층 분석하여 가장 적합한 상담사 3명을 추천합니다.
*   'response' 필드에는 "당신의 이야기를 깊이 있게 분석해 보았어요. 이 세 분의 상담사님을 추천해 드립니다."와 같은 최종 마무리 메시지를 담아주세요.
*   'recommendations' 필드에는 추천하는 각 상담사의 'id'와 'reason'을 포함하여 정확히 3명의 상담사 정보를 배열 형태로 채워주세요. 'reason'은 사용자의 답변과 상담사의 특징을 명확하게 연결지어 왜 그 상담사가 적합한지 구체적이고 설득력 있게 작성해야 합니다.
*   충분한 정보가 모이기 전까지는 절대 \`getConsultants\` 도구를 호출하거나 추천을 시도해서는 안 됩니다. 'recommendations' 필드를 비워두고 'response' 필드에 다음 질문만 담아 응답합니다.`;


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
        system: HARDCODED_SYSTEM_PROMPT,
        tools: [getConsultantsTool],
        output: {
          schema: ChatbotOutputSchema,
          format: 'json',
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
