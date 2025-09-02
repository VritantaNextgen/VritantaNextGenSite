import db from './database';

// Function to log the current database state
export async function logDatabaseState() {
  try {
    const users = await db.users.list({ where: {} });
    console.log('Current database state:');
    console.log('Users:', users.length);
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      });
    });
    
    // Log raw localStorage data
    if (typeof localStorage !== 'undefined') {
      const rawData = localStorage.getItem('db_users');
      console.log('Raw localStorage data exists:', !!rawData);
      if (rawData) {
        try {
          const parsedData = JSON.parse(rawData);
          console.log('Parsed localStorage data length:', parsedData.length);
        } catch (e) {
          console.error('Error parsing localStorage data:', e);
        }
      }
    } else {
      console.warn('localStorage is not available');
    }
  } catch (error) {
    console.error('Error logging database state:', error);
  }
}

// Function to fix database issues
export async function fixDatabaseIssues() {
  try {
    console.log('Attempting to fix database issues...');
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage is not available, cannot fix database');
      return;
    }
    
    // Get current users
    const users = await db.users.list({ where: {} });
    console.log('Current users count:', users.length);
    
    if (users.length === 0) {
      console.log('No users found, creating test users...');
      
      // Create admin user
      const adminUser = {
        id: `user_${Date.now()}_admin`,
        email: 'admin@example.com',
        passwordHash: 'admin123', // Plain text for easy testing
        displayName: 'Admin User',
        role: 'admin',
        isActive: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Create test user
      const testUser = {
        id: `user_${Date.now()}_test`,
        email: 'test@example.com',
        passwordHash: 'test123', // Plain text for easy testing
        displayName: 'Test User',
        role: 'customer',
        isActive: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save users to localStorage directly
      localStorage.setItem('db_users', JSON.stringify([adminUser, testUser]));
      console.log('Test users created and saved directly to localStorage');
    }
    
    console.log('Database fix attempt completed');
  } catch (error) {
    console.error('Error fixing database issues:', error);
  }
}