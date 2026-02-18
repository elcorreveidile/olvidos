import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@olvidosdegranada.es' },
    update: {},
    create: {
      email: 'admin@olvidosdegranada.es',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Crear miembro para el admin
  const member = await prisma.member.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      membershipLevel: 'HONORARY',
      status: 'ACTIVE',
      city: 'Granada',
      isPublic: true,
      bio: 'Administrador de Olvidos de Granada',
    },
  });
  console.log('✅ Admin member created:', member.memberNumber);

  // Crear categorías
  const categorias = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'editoriales' },
      update: {},
      create: {
        name: 'Editoriales',
        slug: 'editoriales',
        description: 'Artículos de opinión y editoriales',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'palabras' },
      update: {},
      create: {
        name: 'Palabras',
        slug: 'palabras',
        description: 'Narrativa, poesía y creación literaria',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'piezas-y-procesos' },
      update: {},
      create: {
        name: 'Piezas y Procesos',
        slug: 'piezas-y-procesos',
        description: 'Procesos creativos y obras en desarrollo',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'soneto500' },
      update: {},
      create: {
        name: 'Soneto500',
        slug: 'soneto500',
        description: 'Sección especial de sonetos',
      },
    }),
  ]);
  console.log('✅ Categories created:', categorias.length);

  // Crear tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'poesia' },
      update: {},
      create: { name: 'Poesía', slug: 'poesia' },
    }),
    prisma.tag.upsert({
      where: { slug: 'narrativa' },
      update: {},
      create: { name: 'Narrativa', slug: 'narrativa' },
    }),
    prisma.tag.upsert({
      where: { slug: 'granada' },
      update: {},
      create: { name: 'Granada', slug: 'granada' },
    }),
    prisma.tag.upsert({
      where: { slug: 'cultura' },
      update: {},
      create: { name: 'Cultura', slug: 'cultura' },
    }),
  ]);
  console.log('✅ Tags created:', tags.length);

  // Crear artículo de prueba
  const article = await prisma.article.upsert({
    where: { slug: 'bienvenidos-a-olvidos-de-granada' },
    update: {},
    create: {
      title: 'Bienvenidos a Olvidos de Granada',
      slug: 'bienvenidos-a-olvidos-de-granada',
      excerpt: 'Artículo de bienvenida a nuestra nueva plataforma digital.',
      content: `
        <h2>¡Bienvenidos!</h2>
        <p>Este es un artículo de prueba para demostrar la funcionalidad de nuestra nueva plataforma.</p>

        <p>Olvidos de Granada es una revista cultural y literaria que recupera y difunde el patrimonio histórico y literario de nuestra ciudad.</p>

        <h3>Nuestra Misión</h3>
        <p>A través de nuestras publicaciones, eventos y actividades, mantenemos vivo el legado cultural de Granada para las generaciones presentes y futuras.</p>

        <blockquote>
          "La cultura es el记忆 de un pueblo, y sin ella, los pueblos pierden su identidad."
        </blockquote>

        <p>Te invitamos a explorar nuestro sitio, conocernos mejor y, si lo deseas, hacerte socio de nuestra asociación.</p>
      `,
      status: 'PUBLISHED',
      featured: true,
      authorId: admin.id,
      publishedAt: new Date(),
      metaTitle: 'Bienvenidos a Olvidos de Granada',
      metaDescription: 'Artículo de bienvenida a nuestra nueva plataforma digital.',
    },
  });
  console.log('✅ Article created:', article.title);

  // Asociar categoría al artículo
  await prisma.categoriesOnArticles.upsert({
    where: {
      articleId_categoryId: {
        articleId: article.id,
        categoryId: categorias[0].id,
      },
    },
    update: {},
    create: {
      articleId: article.id,
      categoryId: categorias[0].id,
    },
  });

  // Crear evento de prueba
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 15);
  futureDate.setHours(19, 0, 0, 0);

  const event = await prisma.event.upsert({
    where: { slug: 'presentacion-nueva-revista' },
    update: {},
    create: {
      title: 'Presentación de la Nueva Revista',
      slug: 'presentacion-nueva-revista',
      description: `
        <p>Os invitamos a la presentación de nuestra nueva plataforma digital y el último número de la revista.</p>

        <h3>Programa</h3>
        <ul>
          <li>19:00h - Recepción de asistentes</li>
          <li>19:30h - Presentación de la nueva web</li>
          <li>20:00h - Lectura de poemas seleccionados</li>
          <li>20:30h - Cóctil de bienvenida</li>
        </ul>

        <p>El evento será en el centro de Granada. ¡Os esperamos!</p>
      `,
      shortDesc: 'Presentación de nuestra nueva plataforma digital y el último número de la revista.',
      location: 'Calle Recogidas, Granada',
      eventType: 'BOOK_PRESENTATION',
      startDate: futureDate,
      capacity: 50,
      status: 'PUBLISHED',
      organizerId: admin.id,
      publishedAt: new Date(),
    },
  });
  console.log('✅ Event created:', event.title);

  console.log('');
  console.log('🎉 Seeding completed!');
  console.log('');
  console.log('📧 Login credentials:');
  console.log('   Email: admin@olvidosdegranada.es');
  console.log('   Password: Admin123!');
  console.log('');
  console.log('🔗 URL: http://localhost:3000/login');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
