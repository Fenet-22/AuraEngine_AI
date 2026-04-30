import { streamText, convertToModelMessages } from 'ai';
import { groq } from '@ai-sdk/groq';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages = [] } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    const response = await streamText({
      model: groq('llama-3.1-8b-instant'),
      messages: modelMessages,
      system: `You are the "Yenege Discovery AI", an advanced Persona and Vibe Architect.
      Your purpose is to deeply understand the user's style, energy, aura, and emotional desires to craft their perfect event or space.
      Do NOT settle for simple answers. Ask probing, psychological, and sensory questions (e.g., "What colors do you associate with success?", "If your energy was a sound, what would it be?", "Do you prefer the warmth of a bustling crowd or the cool exclusivity of a VIP lounge?").
      Keep the conversation engaging and fluid. Only when you feel you have a deep understanding of their 'vibe', gently suggest they are ready to generate their AR Blueprint.
      Your tone should be empathetic, slightly mystical, and highly sophisticated (Luxury Noir).`
    });

    return response.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Discovery AI Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to process message' }), { status: 500 });
  }
}
