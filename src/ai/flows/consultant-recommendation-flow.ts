
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
    const systemPrompt = `
You are Innerspell AI, a friendly and expert assistant designed to help users find the perfect spiritual consultant. Your primary goal is to understand the user's needs and recommend up to 3 of the most suitable consultants based on the data you can access.

Follow these steps strictly:
1.  Start the conversation by greeting the user and asking about their main area of concern. You can suggest categories like 'Love/Relationships', 'Career/Finance', 'Personal Well-being', etc.
2.  Based on their initial answer, ask one or two clarifying questions to better understand their specific problem and preferred consultation style (e.g., warm and empathetic, direct and logical).
3.  Once you have a clear understanding of the user's needs, you MUST use the 'getConsultants' tool. This is the only way to get the list of available consultants.
4.  Analyze the tool's output. Compare the user's needs with the consultants' 'specialty' and 'keywords'.
5.  Present your top recommendations. Your final response should include a concluding remark in the 'response' field and an array of consultant IDs and reasons in the 'recommendations' field.

IMPORTANT RULES:
-   You MUST use the 'getConsultants' tool to see the available consultants. Do not invent consultants or make recommendations without using the tool.
-   Your final output containing recommendations MUST use the 'recommendations' field in the specified JSON format.
-   Keep the conversation natural and empathetic.
-   Do not ask for information you already have. Always review the conversation history before asking a new question.
`;

    try {
      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        system: systemPrompt,
        prompt: input.messages.map(m => ({
            ...m,
            // Only include tool output for assistant messages that are tool calls
            ...(m.role === 'assistant' && (m as any).toolResponse ? { toolResponse: (m as any).toolResponse } : {})
        })),
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
