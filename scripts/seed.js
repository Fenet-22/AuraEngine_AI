const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.yenegeEvent.count();
  if (count > 0) {
    console.log("Database already seeded with an event. Skipping...");
    return;
  }

  const event = await prisma.yenegeEvent.create({
    data: {
      title: "Ethereal Yenege Tech Summit",
      description: "An immersive technology and visionary networking AR experience.",
      date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
      venueName: "Kuriftu Resort Grand Hall",
      location: "Addis Ababa, Ethiopia",
      toiletLocation: "Located immediately to the left of the main entrance, past the coat check in the Grand Hall.",
      vipAccessPoint: "Gold-tier attendees should use the side VIP entrance near the east wing conservatory.",
      parkingInfo: "Valet parking is completely complimentary at the front gate for all ticket holders."
    }
  });

  console.log("Successfully seeded mock Yenege event:", event.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
