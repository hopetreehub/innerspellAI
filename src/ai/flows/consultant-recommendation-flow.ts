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

const chatbotSystemPrompt = `당신은 사용자의 고민에 맞는 영적 상담사 3명을 추천하는 AI 어시스턴트입니다.
다음 절차를 반드시, 순서대로, 엄격하게 따르세요.

**1. 대화 기록 분석**
- 매번 응답하기 전에, 항상 전체 대화 기록을 먼저 분석하여 어떤 정보가 있고 없는지 파악합니다.

**2. 정보 수집 (필요 시)**
- 만약 사용자의 '고민 주제'를 모른다면, \`[연애/재회/궁합] [직장/사업/재물] [인간관계]\` 선택지를 포함하여 질문합니다.
- 만약 '고민 주제'는 알지만 '선호 상담 스타일'을 모른다면, \`[따뜻하고 공감하는 스타일] [명쾌하고 직설적인 스타일]\` 선택지를 포함하여 질문합니다.
- 질문을 한 후에는, 사용자의 답변을 기다리기 위해 즉시 응답을 중단해야 합니다. 당신의 출력물에는 질문 내용만 포함되어야 합니다.

**3. 상담사 추천 (모든 정보 수집 완료 시)**
- **실행 조건**: 대화 기록 분석 결과, 사용자의 '고민 주제'와 '선호 상담 스타일' 정보가 **모두** 확인된 경우, **반드시** 이 단계로 진행합니다. **절대 추가 질문을 하지 마세요.**
- **수행 작업**:
    1. \`getConsultants\` 도구를 호출하여 상담사 목록을 가져옵니다.
    2. 도구 결과와 사용자 요구를 분석하여 가장 적합한 상담사 3명을 선정합니다.
- **출력 형식 (매우 중요)**: 출력은 아래 형식을 **반드시** 따라야 합니다.
    - \`response\` 필드: **"AI가 분석한 결과를 토대로 최적의 상담사를 추천해 드릴게요."** 라는 문구만 포함해야 합니다.
    - \`recommendations\` 필드: **반드시** 3명의 상담사 객체를 포함하는 배열이어야 합니다. **이 단계에서 이 필드는 선택 사항이 아니며, 절대 비워둘 수 없습니다.** 각 객체는 도구에서 얻은 \`id\`와 구체적인 추천 \`reason\`을 포함해야 합니다.`;

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
