import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export const maxDuration = 30;

function extractJSON(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON found");
  }

  return JSON.parse(
    text.substring(start, end + 1)
  );
}

function normalizeBlueprint(bp: any) {
  return {
    eventType:
      bp.eventType || "Workshop",

    guestCount:
      Number(bp.guestCount || 100),

    budget:
      Number(bp.budget || 0),

    venueType:
      bp.venueType ||
      "Indoor Venue",

    theme:
      bp.theme ||
      "Modern Professional",

    colors:
      Array.isArray(bp.colors)
        ? bp.colors
        : ["White", "Black"],

    layout:
      bp.layout ||
      "Conference",

    flowers:
      bp.flowers ||
      "Minimal Greenery",

    lighting:
      bp.lighting ||
      "Soft White",

    decorStyle:
      bp.decorStyle ||
      "Modern",

    stageStyle:
      bp.stageStyle ||
      "LED Stage",

    notes:
      Array.isArray(bp.notes)
        ? bp.notes
        : [],
  };
}

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const conversation =
      body.conversation || "";

    console.log(
      "CONVERSATION:",
      conversation
    );

    if (!conversation) {
      return Response.json(
        {
          error:
            "Conversation required",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await generateText({
        model:
          groq(
            "llama-3.3-70b-versatile"
          ),

        temperature: 0.7,

        prompt: `
You are AuraEngine Event Architect.

Your ONLY task:

Convert conversation into ONE valid JSON object.

Rules:

- Return JSON only.
- Never use Unknown.
- Infer missing design choices.
- Every field required.
- Output no explanation.

Conversation:

${conversation}

Return EXACTLY:

{
 "eventType":"",
 "guestCount":0,
 "budget":0,
 "venueType":"",
 "theme":"",
 "colors":[""],
 "layout":"",
 "flowers":"",
 "lighting":"",
 "decorStyle":"",
 "stageStyle":"",
 "notes":[""]
}
`,
      });

    console.log(
      "RAW AI:",
      result.text
    );

    const parsed =
      extractJSON(
        result.text
      );

    const blueprint =
      normalizeBlueprint(
        parsed
      );

    return Response.json({
      success: true,

      blueprint,
    });
  } catch (error) {
    console.error(
      "Blueprint Error:",
      error
    );

    return Response.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Generation failed",
      },
      {
        status: 500,
      }
    );
  }
}