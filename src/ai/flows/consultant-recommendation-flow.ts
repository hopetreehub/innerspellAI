'use server';

/**
 * @fileOverview 이 파일은 AI 챗봇의 핵심 로직을 담고 있습니다.
 * 사용자의 고민을 파악하고, 'getConsultantsTool'을 사용하여 실제 상담사 목록을 조회한 후,
 * 가장 적합한 상담사를 추천하는 역할을 합니다.
 */

import { ai } from '@/ai/genkit';
import { getConsultantsTool } from '@/ai/tools/consultant-tool';
import { z } from 'zod';

const ChatbotInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const RecommendationSchema = z.object({
  id: z.string().describe("추천하는 상담사의 고유 ID"),
  reason: z.string().describe("이 상담사를 추천하는 간결하고 설득력 있는 이유."),
});

const ChatbotOutputSchema = z.object({
  response: z.string().describe("사용자에게 보여줄 AI의 대화 응답."),
  recommendations: z
    .array(RecommendationSchema)
    .optional()
    .describe("최종 추천 시에만 사용. 추천하는 상담사 목록."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;


export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const systemPrompt = `You are Innerspell AI, a friendly and expert assistant. Your goal is to help users find the perfect spiritual consultant by following a strict, two-step process.

**Process:**

1.  **Gather Information:** You must gather two pieces of information from the user in this specific order:
    *   **Concern Area:** The user's primary problem category.
    *   **Consultation Style:** The user's preferred way of talking with a consultant.

2.  **Recommend:** Once you have *both* the concern and the style, you must stop asking questions and immediately use the \`getConsultants\` tool to recommend up to 3 matching consultants.

**Rules for Gathering Information:**

*   **Rule #1: Check History First.** Before asking any question, review the entire conversation history. *NEVER* ask for information you already have.
*   **Rule #2: Ask for Concern Area.** If you do not know the user's concern area, you MUST ask for it by presenting *only* these options:
    - 연애/재회/궁합
    - 직장/사업/재물
    - 가족/인간관계
    - 학업/진로
    - 심리/건강
    - 기타
*   **Rule #3: Ask for Consultation Style.** If you *have* the concern area but do *not* have the consultation style, you MUST ask for it by presenting *only* these options:
    - 따뜻하고 공감하는 스타일
    - 명쾌하고 직설적인 스타일
    - 논리적이고 분석적인 스타일

**Rules for Recommending:**

*   **Rule #4: Use the Tool.** As soon as you have both pieces of information, you MUST use the \`getConsultants\` tool.
*   **Rule #5: Format the Output.** Your final response must use the \`recommendations\` field in the output. The \`response\` field should only contain a brief concluding message like "AI가 분석한 결과를 토대로 최적의 상담사를 추천해 드릴게요." Do not put consultant details in the \`response\` text. The \`recommendations\` field must contain the consultant's \`id\` and a \`reason\` for the recommendation.`;

    try {
      const history = input.messages;

      // When the conversation starts, history is empty. We need an initial prompt.
      const prompt = history.length > 0 
        ? history 
        : "You are the AI assistant. Greet the user and start the conversation by following the instructions in your system prompt.";

      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        system: systemPrompt,
        prompt: prompt,
        tools: [getConsultantsTool],
        output: {
          schema: ChatbotOutputSchema,
        },
      });

      if (!output) {
        throw new Error("AI did not return a valid response.");
      }
      return output;

    } catch (error) {
      console.error("Error in chatbotFlow:", error);
      return {
        response: '죄송합니다. AI 응답을 받아오는 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      };
    }
  }
);
