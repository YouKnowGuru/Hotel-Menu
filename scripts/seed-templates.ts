/**
 * Seeds the MongoDB templates collection from the full static catalogue in
 * src/lib/template-data.ts (all 21 templates, including preview/gradient data).
 *
 * Usage:  npx tsx scripts/seed-templates.ts            (skips if data exists)
 *         npx tsx scripts/seed-templates.ts --force    (replaces existing data)
 */
import { connectToDatabase } from "../src/lib/db/connect";
import Template from "../src/models/Template";
import T from "../src/lib/template-data";

const GRADIENTS = [
  "from-slate-100 to-gray-200",
  "from-amber-100 to-orange-200",
  "from-gray-800 to-slate-900",
  "from-green-100 to-emerald-200",
  "from-yellow-100 to-amber-200",
  "from-orange-100 to-amber-100",
  "from-pink-100 to-rose-200",
  "from-slate-200 to-stone-300",
];

async function seedTemplates() {
  const force = process.argv.includes("--force");

  try {
    await connectToDatabase();

    const existingCount = await Template.countDocuments();
    if (existingCount > 0 && !force) {
      console.log(`Templates already exist (${existingCount}). Skipping seed. Use --force to replace.`);
      process.exit(0);
    }

    if (force && existingCount > 0) {
      await Template.deleteMany({});
      console.log(`Cleared ${existingCount} existing template(s).`);
    }

    const docs = Object.entries(T).map(([id, t], i) => ({
      name: t.name,
      description: t.description,
      category: t.category,
      style: t.style,
      orientation: t.orientation,
      paperSize: t.paperSize,
      thumbnail: `/templates/${id}.png`,
      previewImages: [],
      canvasData: t.canvasData,
      gradient: t.gradient || GRADIENTS[i % GRADIENTS.length],
      preview: t.preview,
      isPremium: t.isPremium,
      tags: t.tags,
      usageCount: 0,
    }));

    const result = await Template.insertMany(docs);
    console.log(`Seeded ${result.length} templates successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding templates:", error);
    process.exit(1);
  }
}

seedTemplates();
