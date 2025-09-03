import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import LoadingScreen from './components/LoadingScreen'
import './index.css'
import { seedDatabase, createTestUser } from './services/seed'
import { logDatabaseState, fixDatabaseIssues } from './services/debug'

// Global loading state
let isAppInitialized = false;

// Seed the database with initial data
async function initializeApp() {
  console.log('Initializing application...');
  try {
    // Bypass database initialization for now to fix rendering issues
    console.log('Skipping database initialization for development...');
    
    // Set a small delay to simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('App initialization complete (database skipped)');
    isAppInitialized = true;
  } catch (error) {
    console.error('Error initializing application:', error);
    // Even if there's an error, we should still render the app
    isAppInitialized = true;
  }
}

// Create a loading component wrapper
function AppWithLoading() {
  const [isLoading, setIsLoading] = React.useState(!isAppInitialized);

  React.useEffect(() => {
    if (!isAppInitialized) {
      initializeApp().then(() => {
        setIsLoading(false);
      });
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoaded={() => setIsLoading(false)} />;
  }

  return (
    <React.StrictMode>
      <Toaster position="top-right" />
      <App />
    </React.StrictMode>
  );
}

// Start the initialization and render
console.log('Starting application initialization...');
const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  console.log('Root created, rendering app...');
  root.render(<AppWithLoading />);
  console.log('Render called');
} else {
  console.error('Root element not found!');
}
