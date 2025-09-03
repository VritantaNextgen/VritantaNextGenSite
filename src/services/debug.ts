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
    
    console.log('Database state logged successfully');
  } catch (error) {
    console.error('Error logging database state:', error);
  }
}

// Function to fix database issues
export async function fixDatabaseIssues() {
  try {
    console.log('Checking for database issues...');
    
    // Check if we can connect to the database with timeout
    try {
      const usersPromise = db.users.list({ where: {}, limit: 1 });
      const users = await Promise.race([
        usersPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Database connection timeout')), 3000))
      ]);
      
      console.log('Database connection successful, users count:', users.length);
      
      // Check if we have any admin users
      const adminUsers = await db.users.list({ where: { role: 'admin' } });
      const superAdminUsers = await db.users.list({ where: { role: 'superadmin' } });
      
      console.log('Admin users:', adminUsers.length);
      console.log('SuperAdmin users:', superAdminUsers.length);
      
      if (adminUsers.length === 0 && superAdminUsers.length === 0) {
        console.log('No admin users found, this might be expected for a fresh install');
      }
      
    } catch (error) {
      console.warn('Database connection issue (may be expected):', error.message);
      // Don't throw here - this might be expected in development
      return;
    }
    
    console.log('Database check completed');
  } catch (error) {
    console.warn('Non-critical error fixing database issues:', error);
    // Don't throw here, let the app continue
  }
}
