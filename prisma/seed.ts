const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AuraEngine Demo Data...');

  // 0. Clear existing data to avoid duplicates
  await prisma.menuItem.deleteMany();
  await prisma.venueAsset.deleteMany();
  await prisma.eventSchedule.deleteMany();

  // 1. Seed Venue Assets (Digital Twin)
  await prisma.venueAsset.createMany({
    data: [
      { assetName: 'Main Stage', xCoordinate: 10.5, yCoordinate: 20.0, floorLevel: 1 },
      { assetName: 'Restrooms Area A', xCoordinate: 5.0, yCoordinate: 50.0, floorLevel: 1 },
      { assetName: 'Emergency Exit West', xCoordinate: 0.0, yCoordinate: 30.0, floorLevel: 1 },
      { assetName: 'VIP Lounge', xCoordinate: 80.0, yCoordinate: 10.0, floorLevel: 2 },
      { assetName: 'Food Court', xCoordinate: 40.0, yCoordinate: 40.0, floorLevel: 1 },
      { assetName: 'Coffee Station', xCoordinate: 20.0, yCoordinate: 60.0, floorLevel: 1 },
    ]
  });

  // 1.1 Seed Menu Items
  await prisma.menuItem.createMany({
    data: [
      // Ethiopian Dishes
      { name: 'Doro Wat', description: 'Traditional Ethiopian spicy chicken stew with hard-boiled eggs.', ingredients: 'chicken, berbere, eggs, clarified butter', isGlutenFree: true, isVegan: false, isNutFree: true },
      { name: 'Kitfo', description: 'Minced raw beef marinated in mitmita and niter kibbeh.', ingredients: 'beef, mitmita, clarified butter, ayib', isGlutenFree: true, isVegan: false, isNutFree: true },
      { name: 'Shiro Wot', description: 'Chickpea flour stew cooked with garlic and ginger.', ingredients: 'chickpeas, garlic, ginger, berbere', isGlutenFree: true, isVegan: true, isNutFree: true },
      { name: 'Misir Wot', description: 'Red lentil stew simmered in a spicy berbere sauce.', ingredients: 'lentils, berbere, onions, garlic', isGlutenFree: true, isVegan: true, isNutFree: true },
      { name: 'Gomen', description: 'Collard greens sautéed with onions and garlic.', ingredients: 'collard greens, onions, garlic, ginger', isGlutenFree: true, isVegan: true, isNutFree: true },
      { name: 'Tibs', description: 'Sautéed beef or lamb with onions, peppers, and rosemary.', ingredients: 'beef, onions, peppers, rosemary', isGlutenFree: true, isVegan: false, isNutFree: true },
      { name: 'Beyaynetu', description: 'A colorful platter of various vegetarian stews.', ingredients: 'lentils, chickpeas, cabbage, beets, salad', isGlutenFree: true, isVegan: true, isNutFree: true },
      { name: 'Firfir', description: 'Shredded injera mixed with spicy berbere sauce.', ingredients: 'injera, berbere, onions, clarified butter', isGlutenFree: true, isVegan: false, isNutFree: true },
      { name: 'Kik Alicha', description: 'Split pea stew cooked with turmeric and ginger.', ingredients: 'split peas, turmeric, ginger, garlic', isGlutenFree: true, isVegan: true, isNutFree: true },
      { name: 'Injera', description: 'Sourdough flatbread, the staple of Ethiopian cuisine.', ingredients: 'teff flour, water', isGlutenFree: true, isVegan: true, isNutFree: true },

      // European Dishes
      { name: 'Beef Wellington', description: 'Beef fillet coated with pâté and duxelles, wrapped in puff pastry.', ingredients: 'beef, mushrooms, pastry, eggs, flour', isGlutenFree: false, isVegan: false, isNutFree: true },
      { name: 'Margherita Pizza', description: 'Classic pizza with tomato, mozzarella, and basil.', ingredients: 'flour, tomatoes, mozzarella, basil', isGlutenFree: false, isVegan: false, isNutFree: true },
      { name: 'Spaghetti Carbonara', description: 'Pasta with eggs, cheese, pancetta, and black pepper.', ingredients: 'pasta, eggs, pecorino romano, pancetta', isGlutenFree: false, isVegan: false, isNutFree: true },
      { name: 'Ratatouille', description: 'Stewed vegetable dish originating in Nice.', ingredients: 'eggplant, zucchini, peppers, tomatoes', isGlutenFree: true, isVegan: true, isNutFree: true },
      { name: 'Salmon en Papillote', description: 'Salmon baked in parchment paper with herbs.', ingredients: 'salmon, lemon, herbs, butter', isGlutenFree: true, isVegan: false, isNutFree: true },
      { name: 'Duck Confit', description: 'Duck leg cured with salt and slow-cooked in its own fat.', ingredients: 'duck, salt, duck fat, thyme', isGlutenFree: true, isVegan: false, isNutFree: true },
      { name: 'Quiche Lorraine', description: 'Savory open tart with custard, cheese, and bacon.', ingredients: 'eggs, cream, bacon, pastry', isGlutenFree: false, isVegan: false, isNutFree: true },
      { name: 'Wiener Schnitzel', description: 'Breaded and pan-fried veal cutlet.', ingredients: 'veal, flour, eggs, breadcrumbs', isGlutenFree: false, isVegan: false, isNutFree: true },
      { name: 'Paella Valenciana', description: 'Rice dish with rabbit, chicken, and green beans.', ingredients: 'rice, rabbit, chicken, saffron, beans', isGlutenFree: true, isVegan: false, isNutFree: true },
      { name: 'Crème Brûlée', description: 'Dessert with a rich custard base topped with hardened caramel.', ingredients: 'cream, egg yolks, sugar, vanilla', isGlutenFree: true, isVegan: false, isNutFree: true }
    ]
  });

  // 2. Seed Event Schedule (Real-time Sync)
  await prisma.eventSchedule.createMany({
    data: [
      { 
        sessionName: 'Advanced React Workshop', 
        startTime: new Date(Date.now() + 1000 * 60 * 30), // 30 mins from now
        status: 'Delayed', 
        location: 'Hall B' 
      },
      { 
        sessionName: 'AI Strategy Keynote', 
        startTime: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        status: 'Active', 
        location: 'Main Stage' 
      },
      { 
        sessionName: 'Networking Mixer', 
        startTime: new Date(Date.now() + 1000 * 60 * 120), // 2 hours from now
        status: 'Starting Soon', 
        location: 'Rooftop Terrace' 
      }
    ]
  });

  // 3. Create a Demo Mentor / Professional
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor.alex@yenege.com' },
    update: {},
    create: {
      email: 'mentor.alex@yenege.com',
      name: 'Alex Rivera',
      vipLevel: 'speaker',
      professionalInterests: 'AI, Web3',
      technicalSkills: 'React, Solidity, Python',
      professionalTags: {
        create: [
          { tagName: 'React', category: 'Expertise' },
          { tagName: 'Solidity', category: 'Expertise' },
          { tagName: 'Seeking: Co-founder', category: 'Seeking' }
        ]
      }
    }
  });

  console.log('Seeding complete! AuraEngine is now primed for the demo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
