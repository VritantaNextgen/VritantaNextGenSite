import db from './database';
import bcrypt from 'bcryptjs';

// Function to clear the database for testing
export function clearDatabase() {
  console.log('Clearing database...');
  localStorage.removeItem('db_users');
  console.log('Database cleared');
}

// Function to seed the database with initial data
export async function seedDatabase() {
  // Check if database already has users
  const existingUsers = await db.users.list({ where: {}, limit: 1 });
  if (existingUsers.length > 0) {
    console.log('Database already has users, skipping seed');
    return;
  }
  
  // Only clear if no users exist
  clearDatabase();

  console.log('Seeding database with initial data...');

  // Create admin user
  console.log('Creating superadmin user...');
  const adminUser = await db.users.create({
    email: 'admin@modularsaas.com',
    passwordHash: await bcrypt.hash('admin123', 10),
    displayName: 'Admin User',
    role: 'superadmin',
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    isActive: '1',
  });
  console.log('Created superadmin user:', adminUser);

  // Create customer user
  console.log('Creating customer user...');
  const customerUser = await db.users.create({
    email: 'customer@example.com',
    passwordHash: await bcrypt.hash('customer123', 10),
    displayName: 'Customer User',
    role: 'customer',
    avatarUrl: 'https://ui-avatars.com/api/?name=Customer+User&background=0D8ABC&color=fff',
    isActive: '1',
  });
  console.log('Created customer user:', customerUser);

  // Create regular admin user
  console.log('Creating admin user...');
  const supportUser = await db.users.create({
    email: 'support@modularsaas.com',
    passwordHash: await bcrypt.hash('support123', 10),
    displayName: 'Support Admin',
    role: 'admin',
    avatarUrl: 'https://ui-avatars.com/api/?name=Support+Admin&background=0D8ABC&color=fff',
    isActive: '1',
  });
  console.log('Created admin user:', supportUser);

  console.log('Database seeded successfully');
}

// Function to create a test user for development
export async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await db.users.list({ where: { email: 'test@example.com' }, limit: 1 });
    if (existingUser.length > 0) {
      console.log('Test user already exists');
      return existingUser[0];
    }
    
    // Create test user
    console.log('Creating test user...');
    const testUser = await db.users.create({
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('test123', 10),
      displayName: 'Test User',
      role: 'customer',
      avatarUrl: 'https://ui-avatars.com/api/?name=Test+User&background=0D8ABC&color=fff',
      isActive: '1',
    });
    console.log('Created test user:', testUser);
    return testUser;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}