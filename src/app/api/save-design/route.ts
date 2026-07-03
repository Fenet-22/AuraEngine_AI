import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, blueprintId } = body;

    if (!userEmail || !blueprintId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const savedDesign = await (prisma as any).savedDesign.create({
      data: {
        userEmail,
        blueprintId,
      },
    });

    return NextResponse.json({ success: true, savedDesign });
  } catch (error) {
    console.error('Error saving design:', error);
    return NextResponse.json(
      { error: 'Failed to save design' },
      { status: 500 }
    );
  }
}
