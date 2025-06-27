'use server';

/**
 * @fileOverview 이 파일은 AI 챗봇의 핵심 로직을 담고 있습니다.
 * 현재는 연결 안정성 테스트를 위해 가장 기본적인 형태로 구현되어 있습니다.
 */

import { ai } from '@/ai/genkit';
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

const ChatbotOutputSchema = z.string();
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

// 가장 단순한 형태의 시스템 프롬프트
const chatbotSystemPrompt = `You are a helpful assistant.`;

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    try {
      const history = input.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        content: [{ text: msg.content }],
      }));

      // 도구, 복잡한 지침, 구조화된 출력 등 모든 것을 제거하고
      // 가장 기본적인 AI 호출만 테스트하여 연결 안정성을 확인합니다.
      const result = await ai.generate({
        history,
        system: chatbotSystemPrompt,
      });

      return result.text;

    } catch (error) {
      console.error("Chatbot flow connection test error:", error);
      // 사용자가 같은 오류 메시지를 보지 않도록 문구를 변경합니다.
      return "죄송합니다. AI 응답을 받아오는 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    }
  }
);
