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

당신의 목표는 사용자와 자연스러운 대화를 나누며 사용자의 요구사항을 단계별로 파악하는 것입니다.
대화는 항상 질문과 선택지 제공 형식으로 진행해야 합니다. 사용자에게 질문을 한 뒤, 사용자가 고를 수 있는 선택지를 반드시 대괄호 \`[]\`로 감싸서 2~5개 제공해주세요. 예를 들어, "어떤 고민이 있으신가요? [연애] [직업] [금전]" 과 같은 형식입니다.

대화 단계:
1.  **고민 세분화**: 사용자가 처음 선택한 고민에 대해 더 구체적인 질문을 하고 선택지를 제공합니다. (예: '연애' 선택 시 -> [재회] [짝사랑] [권태기])
2.  **선호 스타일 파악**: 사용자가 선호하는 상담 스타일(예: 따뜻함, 직설적)을 질문하고 선택지를 제공합니다.
3.  **가격대 파악**: 사용자가 원하는 가격대를 질문하고 선택지를 제공합니다.
4.  **추천**: 모든 정보가 모이면, 'getConsultants' 도구를 사용하여 전체 상담사 목록을 가져옵니다. 그 후, 사용자의 요구사항에 가장 적합한 상담사 3명을 추천합니다. 각 추천에는 명확하고 설득력 있는 추천 이유를 포함해야 합니다.

규칙:
-   한 번에 하나의 질문만 하세요.
-   모든 질문에는 반드시 대괄호 \`[]\`로 감싼 선택지를 포함해야 합니다.
-   충분한 정보가 모이기 전까지는 절대로 상담사를 추천하거나 도구를 사용해서는 안 됩니다.
-   추천 단계에서는 선택지를 제공하지 않아도 됩니다.`;


// 챗봇 로직을 처리하는 Genkit 플로우
const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    try {
      // 대화 기록의 형식을 AI 모델에 맞게 변환합니다.
      // 1. 'assistant' 역할을 'model' 역할로 변경합니다.
      // 2. content 형식을 올바른 형식(단순 문자열)으로 사용합니다.
      const mappedHistory = input.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        content: msg.content,
      }));

      // 3. 대화의 마지막 메시지를 'prompt'로, 나머지를 'history'로 분리합니다.
      //    이것이 AI.generate()의 올바른 사용법입니다.
      const lastMessage = mappedHistory.pop();
      if (!lastMessage) {
        return { response: "오류: 대화 내용이 없습니다." };
      }

      const result = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: lastMessage.content,
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
