import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import { seedDatabase, createTestUser } from './services/seed'
import { logDatabaseState, fixDatabaseIssues } from './services/debug'

// Seed the database with initial data
async function initializeApp() {
  console.log('Initializing application...');
  try {
    // Fix any database issues first
    await fixDatabaseIssues();
    // Then proceed with normal initialization
    await seedDatabase();
    // Create a test user for development
    await createTestUser();
    await logDatabaseState();
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeApp().then(() => {
  console.log('Starting React rendering...');
  const rootElement = document.getElementById('root');
  console.log('Root element found:', rootElement);
  
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    console.log('Root created, rendering app...');
    root.render(
      <React.StrictMode>
        <Toaster position="top-right" />
        <App />
      </React.StrictMode>
    );
    console.log('Render called');
  } else {
    console.error('Root element not found!');
  }
})