'use server';

/**
 * @fileOverview This file defines the AI Spell Matching flow, which analyzes user profiles and preferences
 * to match them with the most suitable consultant. It exports the `matchConsultant` function,
 * `MatchConsultantInput` type, and `MatchConsultantOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchConsultantInputSchema = z.object({
  profileData: z.string().describe('User profile data including preferences, concerns, and past interactions.'),
  consultantSpecialties: z.array(z.string()).describe('List of consultant specialties e.g. Tarot, Astrology'),
});

export type MatchConsultantInput = z.infer<typeof MatchConsultantInputSchema>;

const MatchConsultantOutputSchema = z.object({
  specialty: z.string().describe('The specialty of the best-matched consultant. e.g. Tarot, Astrology.'),
  matchReason: z.string().describe('Explanation of why this consultant is the best match for the user.'),
});

export type MatchConsultantOutput = z.infer<typeof MatchConsultantOutputSchema>;

export async function matchConsultant(input: MatchConsultantInput): Promise<MatchConsultantOutput> {
  return matchConsultantFlow(input);
}

const matchConsultantPrompt = ai.definePrompt({
  name: 'matchConsultantPrompt',
  input: {
    schema: MatchConsultantInputSchema,
  },
  output: {
    schema: MatchConsultantOutputSchema,
  },
  prompt: `You are an AI assistant designed to match users with the best spiritual consultants based on their needs and preferences.

Analyze the following user profile data:
{{{profileData}}}

Considering the user's profile and the available consultant specialties: {{{consultantSpecialties}}},

determine the most suitable consultant specialty and explain why they are a good match.

Return the consultant specialty and a detailed reason for the match.
`,
});

const matchConsultantFlow = ai.defineFlow(
  {
    name: 'matchConsultantFlow',
    inputSchema: MatchConsultantInputSchema,
    outputSchema: MatchConsultantOutputSchema,
  },
  async input => {
    const {output} = await matchConsultantPrompt(input);
    return output!;
  }
);
