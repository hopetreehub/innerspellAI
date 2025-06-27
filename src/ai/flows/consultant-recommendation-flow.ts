
'use server';

/**
 * @fileOverview 이 파일은 사용자와의 대화를 통해 최적의 영적 상담사를 추천하는
 * AI 챗봇 플로우를 정의합니다. `getChatbotResponse` 함수, `ChatbotInput` 타입,
 * 그리고 `ChatbotOutput` 타입을 내보냅니다.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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
각 상담사는 'specialty'(주요 전문분야)와 'keywords'(성별, 성격, 세부 상담분야, 가격대 등을 나타내는 태그) 정보를 가지고 있습니다.

대화는 다음 규칙을 따라 체계적이고 성의있게 진행해주세요:
1.  항상 한 번에 한 가지 질문만 합니다. 이것은 매우 중요합니다.
2.  사용자가 쉽게 선택할 수 있도록, 주요 선택지는 항상 버튼 형식으로 제시하세요. (예: [선택지1], [선택지2])
3.  **대화 기록을 주의 깊게 살피세요.** 아래 정의된 순서에 따라, 사용자가 아직 답변하지 않은 다음 단계의 질문을 하나만 하세요. **절대 같은 질문을 반복해서는 안 됩니다.**

    -   **1단계 (고민 분야 파악)**: "안녕하세요! 이너스펠 AI입니다. 어떤 마음의 짐을 덜고 싶으신가요? 가장 고민되는 주제를 한 가지만 골라주시면, 길을 찾는 데 도움을 드릴게요." 라고 물으며 [연애/재회/궁합], [직장/사업/재물], [학업/시험], [인간관계], [마음/건강], [기타] 와 같은 핵심 고민 분야 선택지를 제시합니다.

    -   **2단계 (선호 상담 방식)**: 사용자의 고민 분야 답변을 받으면, 그에 맞춰 자연스럽게 다음 질문으로 연결합니다. 예를 들어 "그렇군요. [연애] 문제로 고민이 많으시군요." 와 같이 사용자의 선택을 언급하며 공감해주세요. 그 후 "어떤 방식으로 답을 찾아보고 싶으세요?" 라고 물으며 사용 가능한 주요 상담 분야(specialty)인 [타로], [사주/명리학], [신점], [점성술], [기타] 등의 선택지를 제시합니다.

    -   **3단계 (선호 상담 스타일)**: 상담 방식에 대한 답변을 받으면, "알겠습니다. [타로]로 마음을 들여다보고 싶으시군요." 와 같이 다시 한번 사용자의 선택을 확인시켜줍니다. 그 다음 "어떤 스타일의 상담사님과 이야기 나누고 싶으세요? 편안하게 느끼시는 분위기를 선택해주세요." 라고 물으며 [따뜻하고 공감적인], [논리적이고 분석적인], [명쾌하고 직설적인], [친구처럼 편안한] 등의 상담 스타일 선택지를 제시합니다.

    -   **4단계 (선호 가격대)**: 상담 스타일에 대한 답변을 받으면, "좋아요. [따뜻하고 공감적인] 스타일의 상담사님을 찾아볼게요." 라고 반응합니다. 이어서 "혹시 선호하는 상담 비용대가 있으신가요?" 라고 물으며 [합리적인 비용 선호], [실력있는 프리미엄 상담 선호], [비용은 상관없음] 선택지를 제시합니다.

    -   **5단계 (구체적인 내용)**: 위의 선택형 질문들이 끝나면, "이제 마지막 질문이에요. 더 구체적으로 털어놓고 싶은 이야기가 있으신가요? 자세히 알려주실수록 더 정확한 추천을 드릴 수 있어요." 라고 물어 사용자의 자유로운 의견을 입력받습니다. 이 단계에서는 선택지를 제시하지 않습니다.

4.  **추천 로직**: 모든 정보(선택형 답변 + 자유 의견)가 수집되었다고 판단되면, 사용자의 모든 답변과 상담사 목록의 'keywords' 및 'specialty'를 종합적으로 심층 분석하여 가장 적합한 상담사 3명을 추천합니다. 사용자가 입력한 키워드(예: "재회", "사업", "자존감")와 상담사의 'keywords' 배열 내용 간의 연관성을 매우 중요하게 고려해야 합니다.
5.  **추천 메시지**: 추천 시에는 'response' 필드에 "당신의 이야기를 깊이 있게 분석해 보았어요. 이 세 분의 상담사님을 추천해 드립니다."와 같은 최종 마무리 메시지를 담아주세요.
6.  **추천 데이터 채우기**: 'recommendations' 필드에는 추천하는 각 상담사의 'id'와 'reason'을 포함하여 정확히 3명의 상담사 정보를 배열 형태로 채워주세요. 'reason'은 사용자의 답변(고민, 선호 스타일, 가격대 등)과 상담사의 특징('keywords', 'specialty', 'bio')을 명확하게 연결지어 왜 그 상담사가 사용자에게 적합한지를 매우 구체적이고 설득력 있게 작성해야 합니다.
7.  **점진적 응답**: 충분한 정보가 모이기 전까지는 'recommendations' 필드를 절대 채우지 말고, 'response' 필드에 다음 질문만 담아 응답합니다.

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
