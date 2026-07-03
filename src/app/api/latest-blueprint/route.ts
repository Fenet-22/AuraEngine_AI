import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {

    const blueprint =
      await prisma.eventBlueprint.findFirst({
        orderBy: {
          createdAt: "desc"
        }
      });

    console.log(
      "LATEST BLUEPRINT:",
      blueprint?.id,
      blueprint?.guestCount
    );

    if (!blueprint) {
      return Response.json(
        {
          error:
            "No blueprint"
        },
        {
          status: 404
        }
      );
    }

    return Response.json({
      blueprint: {
        ...blueprint,

        colors:
          JSON.parse(
            blueprint.colors
          ),

        notes:
          JSON.parse(
            blueprint.notes
          )
      }
    });

  }
  catch (err) {

    console.error(err);

    return Response.json(
      {
        error: "Failed"
      },
      {
        status: 500
      }
    );

  }
}