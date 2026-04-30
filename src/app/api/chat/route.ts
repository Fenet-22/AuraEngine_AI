import { streamText, tool, convertToModelMessages } from 'ai';

import { groq } from '@ai-sdk/groq';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages = [] } = await req.json();

    const modelMessages = await convertToModelMessages(messages);

    const isDiscoveryContext = messages.some((m: any) => 
      typeof m.text === 'string' && m.text.includes("core emotion") || 
      typeof m.content === 'string' && m.content.includes("core emotion")
    );

    const systemPrompt = isDiscoveryContext 
      ? `You are the "Yenege Discovery AI", an advanced Persona and Vibe Architect.
      Your purpose is to deeply understand the user's style, energy, aura, and emotional desires to craft their perfect event or space.
      Do NOT settle for simple answers. Ask probing, psychological, and sensory questions (e.g., "What colors do you associate with success?", "If your energy was a sound, what would it be?").
      Keep the conversation engaging and fluid. Only when you feel you have a deep understanding of their 'vibe', gently suggest they are ready to generate their AR Blueprint.
      Your tone should be empathetic, slightly mystical, and highly sophisticated (Luxury Noir).`
      : `You are the "Yenege Concierge" for Yenege.com, a premier events and travel experience service.
      Your tone should be sleek, mysterious, and highly accommodating (Luxury Noir).
      You specialize in weddings, private celebrations, community events, and curated adventures.
      You have access to a live database of Yenege events. ALWAYS use your tools when a guest asks about:
      - Upcoming events, schedules, or dates -> ALWAYS call queryLiveYenegeWebsite first to find the real current events from the main site.
      - Finding facilities like toilets, VIP access, parking -> queryUpcomingEvents
      Keep your responses concise and draw ONLY from the database or scraped site results provided.`;

    const response = await streamText({
      model: groq('llama-3.1-8b-instant'),
      messages: modelMessages,
      system: systemPrompt,
      tools: {
        queryUpcomingEvents: tool({
          description: 'Query the Yenege live database constraint to find upcoming events, their dates, venues, and specific spatial information like toilet locations or VIP access.',
          inputSchema: z.object({
            queryType: z.enum(['list', 'amenity', 'general']).describe('Whether the user wants a list of events, facility amenity locations (toilet/parking), or general info.'),
            eventKeyword: z.string().optional().describe('An optional keyword to filter events by name or description. Leave empty for all upcoming events.')
          }),
          execute: async ({ queryType, eventKeyword }) => {
            // @ts-ignore - Prisma TS caching issue
            const events = await prisma.yenegeEvent.findMany({
              where: eventKeyword ? {
                OR: [
                  { title: { contains: eventKeyword } },
                  { description: { contains: eventKeyword } }
                ]
              } : undefined,
              take: 5
            });
            
            if (events.length === 0) return { status: 'no_events_found', message: 'No events match this query.' };
            
            if (queryType === 'amenity') {
              return events.map((e: any) => ({
                title: e.title,
                toiletLocation: e.toiletLocation,
                vipAccessPoint: e.vipAccessPoint,
                parkingInfo: e.parkingInfo
              }));
            }
            return events.map((e: any) => ({
              title: e.title,
              date: e.date,
              location: e.location,
              description: e.description
            }));
          },
          strict: false
        }),
        queryLiveYenegeWebsite: tool({
          description: 'Fetches the current live home page text from yenege.com. Use this whenever the user asks about upcoming events on the site.',
          inputSchema: z.object({}),
          execute: async () => {
            try {
              const res = await fetch('https://yenege.com');
              if (!res.ok) return { success: false, message: "Couldn't load yenege.com" };
              const html = await res.text();
              // A simple regex to strip HTML tags and scripts/styles
              const textContent = html
                .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
                .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 3000); // Send just up to 3000 chars to avoid prompt token overflow
              return { success: true, content: textContent };
            } catch (err) {
              return { success: false, message: 'Failed to scrape live site.' };
            }
          },
        }),
        updateVenueLayout: tool({
          description: 'Physically modifies the AR Virtual Blueprint layout. Call this tool when the user explicitly requests to change the room aesthetic, vibe, or theme.',
          inputSchema: z.object({
            theme: z.enum(['minimal', 'neon', 'ethereal']).describe('The required layout mode.'),
          }),
          execute: async ({ theme }) => {
            return { success: true, message: `Action dispatched. The AR system is morphing the blueprint to ${theme} scale in real-time.` };
          },
          strict: false
        })
      }
    });

    return response.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Concierge Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to process message' }), { status: 500 });
  }
}
