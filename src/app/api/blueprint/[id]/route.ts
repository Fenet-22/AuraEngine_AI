import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Blueprint ID is required' }, { status: 400 });
    }

    // @ts-ignore
    const bp = await prisma.eventBlueprint.findUnique({
      where: { id }
    });

    if (!bp) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      blueprint: {
        ...bp,
        colors: JSON.parse(bp.colors as string),
        notes: JSON.parse(bp.notes as string)
      }
    });
  } catch (error) {
    console.error("Blueprint fetch error:", error);
    return NextResponse.json({ error: 'Failed to fetch blueprint' }, { status: 500 });
  }
}
