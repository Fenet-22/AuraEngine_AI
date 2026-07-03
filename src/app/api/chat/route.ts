import { streamText, tool, convertToModelMessages } from 'ai';

import { groq } from '@ai-sdk/groq';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages = [], userEmail } = await req.json();

    const normalizedMessages = messages.map((m: any) => ({
      ...m,
      parts: m.parts || [{ type: 'text', text: m.text || m.content || "" }]
    }));

    const modelMessages = await convertToModelMessages(normalizedMessages);

    const systemPrompt = `You are the Yenege Event Architect, a high-end designer and spatial planner. 

Your mission is to guide the client to uncover their event's soul, which we will compile into a structured Event Blueprint.

Do NOT act like a simple assistant. Be an expert consultant:
1. Ask one deep, sensory, or structural question at a time (e.g., "For a professional workshop, should the lighting feel focused and energizing, or soft and collaborative?", "How do you want guest movement to flow between the stage and the networking zones?").
2. Focus on extracting:
   - Event type & theme
   - Guest count & approximate budget
   - Target atmosphere, lighting style, and decor accents
   - Layout preferences and seating strategy
   - Stage presence and requirements
3. When you have gathered enough parameters (typically after 5-8 questions), inform the user that their Event Blueprint is ready to be generated, and instruct them to click the "Generate Event Blueprint" button below.`;

    const response = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      // @ts-ignore
      maxSteps: 5,
      messages: modelMessages,
      system: systemPrompt
    });

    const result = await response.toUIMessageStreamResponse();

    return result;
  } catch (error) {
    console.error("Concierge Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to process message' }), { status: 500 });
  }
}
