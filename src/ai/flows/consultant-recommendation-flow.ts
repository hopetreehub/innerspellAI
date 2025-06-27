
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
  response: z.string(),
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
    // For debugging: A much simpler system prompt to ensure basic conversation flow.
    const systemPrompt = `You are a friendly chatbot. When a user tells you their concern, your only job is to ask for their preferred consultation style by presenting these options clearly:
- 따뜻하고 공감하는 스타일
- 명쾌하고 직설적인 스타일
- 논리적이고 분석적인 스타일
`;

    try {
      // Convert the simple message history into the format Genkit expects,
      // where 'content' is an array of 'Part' objects.
      const history = input.messages.map(m => ({
        role: m.role,
        content: [{ text: m.content }]
      }));

      const { text } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        system: systemPrompt,
        prompt: history,
      });

      if (!text) {
        throw new Error("AI did not return a valid text response.");
      }

      return { response: text };

    } catch (error) {
      console.error("Error in chatbotFlow:", error);
      return {
        response: '죄송합니다. AI 응답을 받아오는 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      };
    }
  }
);
