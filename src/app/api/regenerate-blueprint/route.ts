import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { blueprintId, changes } = body;

    if (!blueprintId || !changes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existing = await prisma.eventBlueprint.findUnique({
      where: { id: blueprintId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Blueprint not found' }, { status: 404 });
    }

    const merged = { ...existing, ...changes };

    let colorsStr = "neutral";
    try {
      const parsedColors = JSON.parse(merged.colors);
      if (Array.isArray(parsedColors)) colorsStr = parsedColors.join(' and ');
    } catch(e) {
      if (typeof merged.colors === 'string') colorsStr = merged.colors;
    }

    // ---------- VENUE ----------
    const venueMap: Record<string,string> = {
      restaurant: "private restaurant dining area",
      house: "cozy private home gathering",
      outdoor: "small outdoor garden setup",
      castle: "luxury castle venue",
      hotel: "hotel event hall",
      beach: "beachfront setup"
    };

    const venue = venueMap[String(merged.venueType).toLowerCase()] || merged.venueType;

    // ---------- GUEST SCALE ----------
    const guestDescription = (count:number) => {
      if(count<=4) return "very intimate setup with exactly few seats visible";
      if(count<=10) return `small gathering for approximately ${count} people, limited seating`;
      if(count<=30) return `medium gathering with around ${count} guests`;
      if(count<=100) return `event for approximately ${count} attendees`;
      return `large event`;
    };

    const scale = guestDescription(Number(merged.guestCount));

    // ---------- FLOWERS ----------
    const flowers = String(merged.flowers).toLowerCase().includes("none")
      ? "minimal botanical decoration, avoid floral installations"
      : `${merged.flowers} floral styling`;

    // ---------- PROMPT ----------
    const prompt = `Accurate event visualization.

Event:
${merged.eventType}

Venue:
${venue}

Guest Scale:
${scale}

Theme:
${merged.theme}

Layout:
${merged.layout}

Decor:
${merged.decorStyle}

Lighting:
${merged.lighting}

Colors:
${colorsStr}

Stage:
${merged.stageStyle}

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

    const updated = await (prisma as any).eventBlueprint.update({
      where: {
        id: blueprintId,
      },
      data: {
        ...changes,
        conceptImage
      },
    });

    return NextResponse.json({ success: true, blueprint: updated });
  } catch (error) {
    console.error('Error regenerating blueprint:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate blueprint' },
      { status: 500 }
    );
  }
}
