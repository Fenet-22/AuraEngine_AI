import { PrismaClient } from '@prisma/client';
import BlueprintViewer from "./BlueprintViewer";

async function getBlueprint(id: string) {
  try {
    // Attempt local API fetch as requested by the user
    const res = await fetch(`http://localhost:3000/api/blueprint/${id}`, {
      cache: "no-store"
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Local API fetch failed, falling back to direct database query:", e);
  }

  // Fallback to direct database query if local fetch fails (e.g. running on custom port/host)
  const prisma = new PrismaClient();
  const bp = await prisma.eventBlueprint.findUnique({
    where: { id }
  });

  if (!bp) {
    throw new Error("Blueprint not found");
  }

  return {
    blueprint: {
      ...bp,
      colors: JSON.parse(bp.colors as string),
      notes: JSON.parse(bp.notes as string)
    }
  };
}

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const data = await getBlueprint(params.id);
  const bp = data.blueprint;

  return (
    <BlueprintViewer blueprint={bp} id={params.id} />
  );
}
