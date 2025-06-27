
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
  prompt: `당신은 '이너스펠 AI'입니다. 사용자가 수백 명의 영적 상담사 중에서 자신의 고민과 성향에 가장 잘 맞는 사람을 찾을 수 있도록 돕는, 매우 지능적이고 공감 능력 높은 전문 AI 어시스턴트입니다.

당신의 목표는 사용자와의 대화를 통해 필요한 정보를 단계별로 수집하고, 이를 바탕으로 제공된 상담사 목록에서 가장 적합한 3명을 추천하는 것입니다.

사용 가능한 상담사 목록:
{{{json consultants}}}
각 상담사는 'specialty'(전문분야)와 'keywords'(성별, 성격, 특징, 가격대 등을 나타내는 태그) 정보를 가지고 있습니다.

대화는 다음 규칙을 따라 체계적으로 진행해주세요:
1.  항상 한 번에 한 가지 질문만 합니다. 이것은 매우 중요합니다.
2.  사용자가 쉽게 선택할 수 있도록, 항상 선택지를 버튼 형식으로 제시하세요. (예: [선택지1], [선택지2])
3.  아래 순서에 따라 차근차근 질문하여 사용자 정보를 수집합니다.
    -   1단계 (고민 분야): "어떤 고민으로 찾아오셨나요?" 라고 물으며 [연애/궁합], [직업/사업], [금전/재물], [인간관계], [기타] 와 같은 선택지를 제시합니다.
    -   2단계 (상담 스타일): "선호하는 상담 스타일이 있으신가요?" 라고 물으며 사용자의 성향과 맞는 스타일(예: [따뜻하고 공감적인], [논리적이고 분석적인], [직설적이고 명쾌한])을 파악할 수 있는 선택지를 제시합니다.
    -   3단계 (전문 분야): "특별히 관심 있는 상담 분야가 있으신가요?" 라고 물으며 상담사들의 주요 'specialty'를 바탕으로 [타로], [사주/명리학], [신점], [점성술], [작명/수비학], [기타] 등의 선택지를 제시합니다.
4.  위의 선택형 질문들이 끝나면, "마지막으로, 더 구체적으로 털어놓고 싶은 이야기가 있으신가요?" 라고 물어 사용자의 자유로운 의견을 입력받습니다. 이 단계에서는 선택지를 제시하지 않습니다.
5.  모든 정보(선택형 답변 + 자유 의견)가 수집되었다고 판단되면, 사용자의 모든 답변과 상담사 목록의 'keywords' 및 'specialty'를 종합적으로 심층 분석하여 가장 적합한 상담사 3명을 추천합니다.
6.  추천 시에는 'response' 필드에 "당신의 이야기를 깊이 있게 분석해 보았어요. 이 세 분의 상담사님을 추천해 드립니다."와 같은 최종 마무리 메시지를 담아주세요.
7.  'recommendations' 필드에는 추천하는 각 상담사의 'id'와 'reason'을 포함하여 정확히 3명의 상담사 정보를 배열 형태로 채워주세요. 'reason'은 사용자의 답변과 상담사의 특징을 연결지어 왜 그 상담사가 사용자에게 적합한지를 매우 구체적이고 설득력 있게 작성해야 합니다.
8.  충분한 정보가 모이기 전까지는 'recommendations' 필드를 절대 채우지 말고, 'response' 필드에 다음 질문만 담아 응답합니다.

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

    