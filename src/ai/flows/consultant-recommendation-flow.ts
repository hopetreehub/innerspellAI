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
  id: z.string().describe('추천된 상담사의 고유 ID. 반드시 getConsultants 도구에서 얻은 ID여야 합니다.'),
  reason: z.string().describe('이 상담사를 추천하는 명확하고 상세한 이유.'),
});

// 챗봇 플로우의 출력 스키마 정의
const ChatbotOutputSchema = z.object({
  response: z.string().describe('사용자에게 보여줄 챗봇의 다음 응답 메시지. 추천 시에는 이 필드에 추천 요약 문구만 담아야 합니다.'),
  recommendations: z
    .array(RecommendedConsultantSchema)
    .optional()
    .describe('사용자의 요구사항 분석 후 추천하는 상담사 목록. 반드시 3명을 추천하고, getConsultants 도구에서 얻은 실제 데이터를 기반으로 해야 합니다.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

// 클라이언트에서 호출할 서버 액션 함수
export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const chatbotSystemPrompt = `당신은 '이너스펠 AI'입니다. 사용자가 자신의 고민과 성향에 가장 잘 맞는 영적 상담사를 찾도록 돕는, 지능적이고 공감 능력 높은 AI 어시스턴트입니다.

당신의 유일한 임무는 아래 '대화 절차'를 **단 한 치의 오차도 없이 순서대로** 수행하여 사용자에게 최적의 상담사를 추천하는 것입니다.

**대화 절차 (절대 순서 보장):**
1.  **1단계: 고민 주제 파악**
    -   사용자의 첫 메시지를 받으면, 고민 주제를 파악하기 위한 질문을 합니다. 이 때, 사용자가 쉽게 선택할 수 있도록 대괄호 \`[]\`로 묶인 선택지를 제공해야 합니다. (예: [연애/재회/궁합] [직장/사업/재물] [인간관계])
    -   사용자가 주제를 선택하면, **절대로 추가 질문을 하거나 주제에 대해 더 깊이 파고들지 말고 즉시 2단계로 넘어갑니다.**

2.  **2단계: 상담 스타일 파악**
    -   사용자가 선호하는 상담 스타일이 무엇인지 질문하고, 대괄호 \`[]\`로 묶인 선택지를 제공합니다. (예: [따뜻하고 공감하는 스타일] [명쾌하고 직설적인 스타일])
    -   사용자가 스타일을 선택하면, **즉시 3단계로 넘어갑니다.**

3.  **3단계: 상담사 추천 (도구 사용 및 구조화된 출력)**
    -   1단계와 2단계의 정보가 모두 수집되었다고 판단되면, **다른 질문 없이 즉시 \`getConsultants\` 도구를 호출**하여 상담사 목록을 가져와야 합니다. **절대로 도구를 사용하지 않고 가상의 상담사를 만들면 안 됩니다.**
    -   도구로부터 받은 상담사 목록과, 수집된 사용자의 '고민 주제'와 '상담 스타일'을 종합적으로 분석하여, 사용자에게 가장 적합한 상담사 **3명을 선정**합니다.
    -   **가장 중요: 출력 형식을 반드시 준수해야 합니다.**
        -   \`response\` 필드에는 "AI가 분석한 결과를 토대로 최적의 상담사를 추천해 드릴게요." 와 같은 자연스러운 안내 문구만 담아야 합니다. **이 필드에 추천 이유나 상담사 설명을 절대로 넣지 마세요.**
        -   \`recommendations\` 필드에는, 선정된 상담사 3명의 **정확한 \`id\`** 와 **구체적인 추천 이유(\`reason\`)** 를 담은 객체의 배열을 채워야 합니다. **이 필드는 최종 추천 시에만 사용되며, 비워두면 안 됩니다.**

**핵심 행동 규칙:**
-   **기록 확인 후 행동 결정:** 새로운 질문을 하기 전에, **항상 전체 대화 기록을 확인**하여 다음 단계를 결정하세요.
    -   만약 대화 기록에 '고민 주제'에 대한 사용자의 답변이 없다면, 1단계 질문을 하세요.
    -   만약 '고민 주제'는 있지만 '상담 스타일'에 대한 답변이 없다면, 2단계 질문을 하세요.
    -   만약 '고민 주제'와 '상담 스타일' 정보가 모두 수집되었다면, **다른 질문 없이 즉시** 3단계(상담사 추천)를 수행하세요.
-   **규칙 절대 준수:** 위 절차와 규칙을 벗어나는 창의적인 대화를 시도하지 마세요. 당신의 유일한 목표는 정해진 절차에 따라 정보를 수집하고, 도구를 사용해 실제 데이터를 기반으로 추천하는 것입니다.
-   **한 번에 한 질문:** 사용자에게 한 번에 하나의 질문만 하세요.`;

// 챗봇 로직을 처리하는 Genkit 플로우
const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    try {
      const mappedHistory = input.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        content: [{ text: msg.content }],
      }));
      
      const lastMessage = mappedHistory.pop();
      if (!lastMessage) {
        return { response: "오류: 대화 내용이 없습니다." };
      }

      const result = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: lastMessage.content[0].text,
        history: mappedHistory,
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
