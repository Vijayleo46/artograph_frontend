const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupDefaultData() {
  try {
    console.log('Setting up default data...');

    // Create a default therapist if none exists
    const existingTherapist = await prisma.user.findFirst({
      where: { role: 'THERAPIST' }
    });

    if (!existingTherapist) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const therapist = await prisma.user.create({
        data: {
          email: 'therapist@example.com',
          password: hashedPassword,
          name: 'Default Therapist',
          role: 'THERAPIST',
        },
      });
      console.log('✅ Created default therapist:', therapist.email);
    } else {
      console.log('✅ Therapist already exists:', existingTherapist.email);
    }

    // Create a default admin if none exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'ADMIN',
        },
      });
      console.log('✅ Created default admin:', admin.email);
    } else {
      console.log('✅ Admin already exists:', existingAdmin.email);
    }

    console.log('\n✅ Setup complete!');
    console.log('\nNote: Authentication is disabled, so you don\'t need these credentials.');
    console.log('These users are just for database relationships (therapistId, etc.)');
    
  } catch (error) {
    console.error('Error setting up default data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDefaultData();




