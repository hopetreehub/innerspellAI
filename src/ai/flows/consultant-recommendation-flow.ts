'use server';

/**
 * @fileOverview 이 파일은 AI 챗봇의 핵심 로직을 담고 있습니다.
 * 사용자의 고민을 파악하고, 상담 스타일을 물어보는 대화를 진행합니다.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatbotInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;


const ChatbotOutputSchema = z.object({
  response: z.string().describe("사용자에게 보여줄 AI의 대화 응답."),
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
    const systemPrompt = `You are Innerspell AI, a friendly and expert assistant. Your goal is to help users.
You must follow a two-step process.

**Process:**
1.  **Gather Concern:** First, understand the user's primary concern area.
2.  **Gather Style:** Second, ask for their preferred consultation style.

**Rules:**
*   **Check History:** Before asking a question, review the conversation history. Never ask for information you already have.
*   **Ask Concern First:** If you don't know the concern, ask by presenting these options:
    - 연애/재회/궁합
    - 직장/사업/재물
    - 가족/인간관계
    - 학업/진로
    - 심리/건강
    - 기타
*   **Ask Style Second:** If you have the concern but not the style, ask by presenting these options:
    - 따뜻하고 공감하는 스타일
    - 명쾌하고 직설적인 스타일
    - 논리적이고 분석적인 스타일
*   **Once you have both pieces of information, simply say "정보를 모두 확인했습니다. 이제 가장 적합한 상담사를 찾아드릴게요."**
`;

    try {
      const history = input.messages;

      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        system: systemPrompt,
        prompt: history,
        output: {
          schema: ChatbotOutputSchema,
        },
      });

      if (!output) {
        throw new Error("AI did not return a valid response.");
      }
      // Since we simplified the output, we ensure it conforms to the expected structure.
      return { response: output.response };

    } catch (error) {
      console.error("Error in chatbotFlow:", error);
      return {
        response: '죄송합니다. AI 응답을 받아오는 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      };
    }
  }
);