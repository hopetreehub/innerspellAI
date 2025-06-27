
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
You are Innerspell AI, a friendly and expert assistant designed to help users find the perfect spiritual consultant. Your primary goal is to guide the user through a simple, step-by-step process to find the best match.

Follow these steps strictly and in this exact order:

1.  **Step 1: Ask for Concern Area.**
    -   If the conversation has just started (the message history is empty), greet the user warmly and ask for their primary area of concern.
    -   You MUST present these exact options as a list in your response:
        -   연애/재회/궁합
        -   직장/사업/재물
        -   가족/인간관계
        -   학업/진로
        -   심리/건강
        -   기타

2.  **Step 2: Ask for Consultation Style.**
    -   Once the user has provided a concern, and you do not know their preferred style, you MUST ask for their preferred consultation style.
    -   You MUST present these exact options as a list:
        -   따뜻하고 공감하는 스타일
        -   명쾌하고 직설적인 스타일
        -   논리적이고 분석적인 스타일

3.  **Step 3: Get Consultants and Recommend.**
    -   Once you have both the 'concern' and the 'style', you MUST immediately use the \`getConsultants\` tool to fetch the list of available consultants.
    -   Do not ask any more questions.
    -   Analyze the tool's output and select up to 3 consultants that best match the user's stated concern and preferred style.
    -   Your final response MUST be in the specified JSON format. The 'response' field should contain a concluding remark, and the 'recommendations' field must contain an array of the chosen consultant IDs and the reason for each recommendation.

IMPORTANT RULES:
-   Never ask for information you already have. Always review the conversation history before asking a new question.
-   Stick to the two-question process (Concern -> Style). Do not ask for more details.
-   You MUST use the 'getConsultants' tool to get the consultant list. Do not invent consultants.
-   Your final recommendation MUST use the 'recommendations' field. Do not list consultants in the 'response' text.
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
