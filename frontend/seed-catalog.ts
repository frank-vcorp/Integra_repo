import { PrismaClient, GenderRestriction } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Inicializando Catálogo Clínico con los datos de Lety...');

  // 1. Crear Categorías
  const catLab = await prisma.testCategory.create({ data: { name: 'Laboratorio' } });
  const catGen = await prisma.testCategory.create({ data: { name: 'Estudios Generales / Sala' } });
  const catImg = await prisma.testCategory.create({ data: { name: 'Imagenología (Rayos X)' } });
  const catAmb = await prisma.testCategory.create({ data: { name: 'Ambulancia / Otros' } });

  // 2. Crear Pruebas (Basado en las notas de la reunión)
  await prisma.medicalTest.createMany({
    data: [
      // Laboratorio
      { code: 'LAB-01', name: 'Análisis Bacteriológico', categoryId: catLab.id, options: ["Inertes", "Agua", "Alimentos"], targetGender: GenderRestriction.ALL },
      { code: 'LAB-02', name: 'Biometría Hemática', categoryId: catLab.id, options: [], targetGender: GenderRestriction.ALL },
      { code: 'LAB-03', name: 'Coproparasitoscópico (Muestras fecales)', categoryId: catLab.id, options: [], targetGender: GenderRestriction.ALL },
      { code: 'LAB-04', name: 'Exudado Faríngeo', categoryId: catLab.id, options: [], targetGender: GenderRestriction.ALL },
      { code: 'LAB-05', name: 'Reacciones Febriles', categoryId: catLab.id, options: [], targetGender: GenderRestriction.ALL },
      { code: 'LAB-06', name: 'Prueba de Embarazo', categoryId: catLab.id, options: [], targetGender: GenderRestriction.FEMALE },
      { code: 'LAB-07', name: 'Perfil Prostático', categoryId: catLab.id, options: [], targetGender: GenderRestriction.MALE },

      // Generales / Sala
      { code: 'GEN-01', name: 'Somatometría (Peso, Talla, Signos Vitales)', categoryId: catGen.id, options: [], targetGender: GenderRestriction.ALL },
      { code: 'GEN-02', name: 'Agudeza Visual', categoryId: catGen.id, options: [], targetGender: GenderRestriction.ALL },
      { code: 'GEN-03', name: 'Examen Médico (Exploración física)', categoryId: catGen.id, options: [], targetGender: GenderRestriction.ALL },
      { code: 'GEN-04', name: 'Audiometría', categoryId: catGen.id, options: [], targetGender: GenderRestriction.ALL },

      // Imagen
      { code: 'IMG-01', name: 'Radiografía de Columna Lumbar (Lateral, etc)', categoryId: catImg.id, options: [], targetGender: GenderRestriction.ALL },
      { code: 'IMG-02', name: 'Radiografía de Tórax', categoryId: catImg.id, options: [], targetGender: GenderRestriction.ALL },
    ]
  });

  console.log('✅ ¡Catálogo Médico poblado con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
