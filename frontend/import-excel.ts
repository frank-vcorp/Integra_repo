import { PrismaClient, GenderRestriction } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function getOrCreateCategory(name: string) {
  let cat = await prisma.testCategory.findFirst({ where: { name } });
  if (!cat) {
    cat = await prisma.testCategory.create({ data: { name } });
  }
  return cat;
}

async function main() {
  console.log('📦 Importando datos del Excel de Lety...');
  
  const data = JSON.parse(fs.readFileSync('../context/pruebas.json', 'utf-8'));
  
  const catLab = await getOrCreateCategory('Laboratorio');
  const catGen = await getOrCreateCategory('Estudios Generales');
  const catImg = await getOrCreateCategory('Imagenología');
  const catAmb = await getOrCreateCategory('Ambulancia');

  const categoryMap: Record<string, string> = {
    'LABORATORIO': catLab.id,
    'GENERALES': catGen.id,
    'IMAGEN ': catImg.id,
    'AMBULANCIA': catAmb.id
  };

  let count = 0;
  // Limpiar catálogo actual para evitar duplicados masivos por ahora
  // await prisma.medicalTest.deleteMany(); 
  
  for (const row of data) {
    for (const [colName, testVal] of Object.entries(row)) {
      if (!testVal || typeof testVal !== 'string') continue;
      
      const testName = testVal.trim();
      const catId = categoryMap[colName];
      if (!catId) continue;
      
      // Auto-detect gender restriction based on keywords
      let gender = GenderRestriction.ALL;
      const lowerName = testName.toLowerCase();
      if (lowerName.includes('embarazo') || lowerName.includes('papanicolau') || lowerName.includes('mastografia') || lowerName.includes('gineco')) {
        gender = GenderRestriction.FEMALE;
      } else if (lowerName.includes('prostát') || lowerName.includes('prostat')) {
        gender = GenderRestriction.MALE;
      }
      
      // Upsert by name so we don't duplicate
      const existing = await prisma.medicalTest.findFirst({ where: { name: testName } });
      if (!existing) {
        // Generar un código único simple
        const code = colName.substring(0,3).trim() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        await prisma.medicalTest.create({
          data: {
            name: testName,
            code,
            categoryId: catId,
            options: [],
            targetGender: gender
          }
        });
        count++;
      }
    }
  }

  console.log(`✅ ¡Importación completada! Se insertaron ${count} pruebas nuevas desde el Excel.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
