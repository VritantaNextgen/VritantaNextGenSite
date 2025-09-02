import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Globe, Home, LogOut, Menu, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout('/');
  };

  const sidebarNavItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'E-commerce Comparison', icon: ShoppingCart, path: '/ecommerce-comparison' },
    { name: 'Website Builder', icon: Globe, path: '/website-builder' },
    { name: 'Data Analytics', icon: BarChart, path: '/data-analytics' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <span className={`font-bold text-xl text-gray-800 dark:text-white ${isSidebarOpen ? '' : 'hidden'}`}>Vritanta</span>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
        <nav className="mt-4">
          {sidebarNavItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} p-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-6 h-6" />
              <span className={`ml-4 ${isSidebarOpen ? '' : 'hidden'}`}>{item.name}</span>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Customer Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-300">{user?.email || 'Customer'}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Tool Cards */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* E-commerce Comparison Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-6 h-6 mr-2 text-blue-500" />
                  E-commerce Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Compare products from Amazon, Flipkart, Meesho, and Myntra to find the best deals.
                </p>
                <Button onClick={() => navigate('/ecommerce-comparison')}>Launch Tool</Button>
              </CardContent>
            </Card>

            {/* Website Builder Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-green-500" />
                  Website Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create stunning websites with our easy-to-use drag-and-drop builder.
                </p>
                <Button onClick={() => navigate('/website-builder')}>Launch Tool</Button>
              </CardContent>
            </Card>

            {/* Data Analytics Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="w-6 h-6 mr-2 text-purple-500" />
                  Data Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Gain insights from your data with our powerful analytics platform.
                </p>
                <Button onClick={() => navigate('/data-analytics')}>Launch Tool</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}