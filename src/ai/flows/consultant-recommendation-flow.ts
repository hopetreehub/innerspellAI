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

const chatbotSystemPrompt = `당신은 '이너스펠 AI'입니다. 사용자가 자신의 고민과 성향에 가장 잘 맞는 영적 상담사를 찾도록 돕는, 지능적이고 공감 능력 높은 AI 어시스턴트입니다.

당신의 목표는 아래 '대화 목표'에 명시된 정보를 순서대로 수집하여 사용자에게 최적의 상담사를 추천하는 것입니다.

**대화 목표 (순서대로 진행):**
1.  **고민 주제 파악**: 사용자의 주된 고민이 무엇인지 파악합니다. (예: 연애, 직업, 금전 등). 사용자가 주제를 선택하면, 즉시 다음 단계로 넘어갑니다.
2.  **상담 스타일 파악**: 사용자가 선호하는 상담 스타일이 무엇인지 파악합니다. (예: 따뜻하고 공감하는 스타일, 명쾌하고 직설적인 스타일 등). 사용자가 스타일을 선택하면, 즉시 다음 단계로 넘어갑니다.
3.  **상담사 추천**: 위의 모든 정보(고민 주제, 선호 스타일)가 수집되었다고 판단되면, 'getConsultants' 도구를 사용하여 수집된 정보를 바탕으로 가장 적합한 상담사 3명을 추천합니다. 추천 시에는 명확한 이유를 반드시 포함해야 합니다.

**대화 규칙:**
-   **엄격한 순서 준수:** '대화 목표'의 1, 2, 3번 순서를 반드시, 그리고 엄격하게 지켜주세요. 한 단계가 끝나면 즉시 다음 단계 질문으로 넘어가야 하며, 절대로 같은 단계의 질문을 반복하거나 더 깊이 파고들지 마세요.
-   **기록 확인:** 질문하기 전에 항상 이전 대화 기록을 확인하여 이미 어떤 정보를 수집했는지 파악하세요. 예를 들어, 이미 '고민 주제'를 파악했다면, 절대로 다시 묻지 말고 '상담 스타일'을 질문해야 합니다.
-   **한 번에 한 질문:** 사용자에게 한 번에 하나의 질문만 하세요.
-   **선택지 제공:** 1번과 2번 단계의 질문에는 사용자가 고를 수 있는 선택지를 2~5개, 대괄호 \`[]\`로 감싸서 제공해야 합니다. (예: "어떤 고민이 있으신가요? [연애] [직업] [금전]") 3번 추천 단계에서는 선택지를 제공하지 않습니다.
-   **도구 사용 시점:** '상담사 추천' 단계(2단계에서 사용자가 선호 스타일을 선택한 후)에 도달하기 전까지는 절대로 'getConsultants' 도구를 사용해서는 안 됩니다.
-   **추천 형식:** 추천 단계에서는 AI의 분석과 추천 이유를 설명한 후, 각 상담사 정보와 추천 이유를 명확하게 제시합니다.`;

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
