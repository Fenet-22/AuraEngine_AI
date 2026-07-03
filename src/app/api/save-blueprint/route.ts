import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { blueprint, userEmail } = await req.json();

    // ---------- VENUE ----------
    const venueMap: Record<string,string> = {
      restaurant: "private restaurant dining area",
      house: "cozy private home gathering",
      outdoor: "small outdoor garden setup",
      castle: "luxury castle venue",
      hotel: "hotel event hall",
      beach: "beachfront setup"
    };

    const venue = venueMap[String(blueprint.venueType).toLowerCase()] || blueprint.venueType;

    // ---------- GUEST SCALE ----------
    const guestDescription = (count:number) => {
      if(count<=4) return "very intimate setup with exactly few seats visible";
      if(count<=10) return `small gathering for approximately ${count} people, limited seating`;
      if(count<=30) return `medium gathering with around ${count} guests`;
      if(count<=100) return `event for approximately ${count} attendees`;
      return `large event`;
    };

    const scale = guestDescription(Number(blueprint.guestCount));

    // ---------- FLOWERS ----------
    const flowers = String(blueprint.flowers).toLowerCase().includes("none")
      ? "minimal botanical decoration, avoid floral installations"
      : `${blueprint.flowers} floral styling`;

    // ---------- PROMPT ----------
    const prompt = `Accurate event visualization.

Event:
${blueprint.eventType}

Venue:
${venue}

Guest Scale:
${scale}

Theme:
${blueprint.theme}

Layout:
${blueprint.layout}

Decor:
${blueprint.decorStyle}

Lighting:
${blueprint.lighting}

Colors:
${Array.isArray(blueprint.colors) ? blueprint.colors.join(", ") : "neutral"}

Stage:
${blueprint.stageStyle}

Flowers:
${flowers}

STRICT REQUIREMENTS:
- match guest count realistically
- do not exceed seating
- avoid oversized halls
- respect venue type
- avoid wedding setup unless requested
- avoid unnecessary decorations
- realistic proportions
- single coherent scene
- architectural visualization
- cinematic but believable`;

    const encodedPrompt = encodeURIComponent(prompt);
    const conceptImage = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=2048&height=1536&enhance=true&nologo=true`;

    const saved = await (prisma as any).eventBlueprint.create({
      data: {
        userEmail: userEmail || "anonymous",
        eventType: blueprint.eventType,
        guestCount: blueprint.guestCount,
        budget: blueprint.budget,
        venueType: blueprint.venueType,
        theme: blueprint.theme,
        colors: JSON.stringify(blueprint.colors),
        layout: blueprint.layout,
        flowers: blueprint.flowers,
        lighting: blueprint.lighting,
        decorStyle: blueprint.decorStyle,
        stageStyle: blueprint.stageStyle,
        notes: JSON.stringify(blueprint.notes),
        conceptImage
      }
    });

    return Response.json({
      success: true,
      id: saved.id,
      blueprint: saved
    });
  } catch (e) {
    console.error("Save Blueprint Error:", e);
    return Response.json(
      {
        success: false
      },
      {
        status: 500
      }
    );
  }
}
