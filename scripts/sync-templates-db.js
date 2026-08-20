const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ts = require('typescript');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=(.+)/);
const uri = match ? match[1].trim() : null;

// Dynamically transpile & load template-data.ts
const tsSource = fs.readFileSync(path.join(__dirname, '../src/lib/template-data.ts'), 'utf8');
const jsSource = ts.transpileModule(tsSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

const mod = { exports: {} };
const fn = new Function('module', 'exports', 'require', '__dirname', '__filename', jsSource);
fn(mod, mod.exports, require, path.join(__dirname, '../src/lib'), path.join(__dirname, '../src/lib/template-data.ts'));
const allTemplates = mod.exports.default || mod.exports;

async function sync() {
  if (!uri) {
    console.error('No MONGODB_URI found');
    return;
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const Template = mongoose.model('Template', new mongoose.Schema({}, { strict: false }));
  const Project = mongoose.model('Project', new mongoose.Schema({}, { strict: false }));

  // 1. Update all templates in DB by name or alias
  const nameAliases = {
    "Druk Heritage Kitchen": ["Druk Heritage Kitchen", "Druk Kitchen"],
    "Druk Palace Kitchen": ["Druk Palace Kitchen", "Golden Dragon"],
    "Quick Bite": ["Quick Bite", "Smash House"],
    "Old World Tavern": ["Old World Tavern", "Smokehouse 71"],
    "Spice Route": ["Spice Route", "Sakura"],
  };

  for (const [id, tpl] of Object.entries(allTemplates)) {
    if (!tpl.canvasData) continue;
    const searchNames = nameAliases[tpl.name] || [tpl.name];
    const res = await Template.updateMany(
      { name: { $in: searchNames } },
      { $set: { canvasData: tpl.canvasData, preview: tpl.preview, gradient: tpl.gradient, description: tpl.description } }
    );
    console.log(`Synced template: "${tpl.name}" (names: ${searchNames.join(', ')} -> matched: ${res.matchedCount}, modified: ${res.modifiedCount})`);
  }

  // 2. Update existing projects that match templates by name
  const projects = await Project.find({});
  for (const p of projects) {
    const pName = p.get('name') || '';
    const matchedTpl = Object.values(allTemplates).find(
      (t) => {
        const names = nameAliases[t.name] || [t.name];
        return names.some(n => n.toLowerCase() === pName.toLowerCase());
      }
    );
    if (matchedTpl && matchedTpl.canvasData) {
      p.set('canvasData', matchedTpl.canvasData);
      await p.save();
      console.log(`-> Updated project: "${pName}" (${p._id}) with framed canvasData!`);
    }
  }

  console.log('Sync complete successfully!');
  await mongoose.disconnect();
}

sync().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
