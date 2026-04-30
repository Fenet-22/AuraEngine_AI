import { generateObject, convertToModelMessages } from 'ai';

import { groq } from '@ai-sdk/groq';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages = [] } = await req.json();

    const modelMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content || m.text || ""
    }));

    let object = {
      theme: "minimal" as const,
      coreEmotion: "curiosity",
      primaryColor: "#000000",
      designConcept: "An unexplored void of possibilities."
    };

    try {
      const generated = await generateObject({
        model: groq('llama-3.1-8b-instant'),
        providerOptions: {
          groq: {
            structuredOutputs: false,
          },
        },
        schema: z.object({
          theme: z.enum(['minimal', 'neon', 'ethereal']).describe('The general architectural aesthetic of the space.'),
          coreEmotion: z.string().describe('The primary emotional tone the user requested.'),
          primaryColor: z.string().describe('A hex code representing the dominant accent color for the environment.'),
          designConcept: z.string().describe('A poetic, one-sentence description of the final environmental setup.'),
        }),
        messages: modelMessages,
        system: `You are the underlying Psychological Preference Mapping (PPM) engine for Yenege.com.
        Your goal is to parse the user's conversational intent and map it to structured spatial configurations.
        Analyze the chat history to determine the optimal 'theme', 'coreEmotion', and 'primaryColor' and output exactly in valid JSON format.
        CRITICAL RULES:
        1. YOU MUST ONLY output valid JSON.
        2. The 'theme' attribute MUST BE EXACTLY ONE of: "minimal", "neon", or "ethereal". Do NOT invent new themes like "Whimsical Floral" or "CyberGarden".
        3. You MUST include a 'designConcept' string as required by the schema.`
      });
      object = generated.object as any;
    } catch (llmError) {
      console.warn("Vibe Mapper LLM Parsing Error (falling back to default):", llmError);
    }

    try {
      await prisma.vibeProfile.create({
        data: {
          theme: object.theme,
          coreEmotion: object.coreEmotion,
          primaryColor: object.primaryColor,
        }
      });
    } catch (e) {
      console.error("DB Save Error:", e);
    }

    return Response.json(object);
  } catch (error) {
    console.error("Vibe Mapper Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to process vibe mapping' }), { status: 500 });
  }
}
