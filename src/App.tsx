import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LandingPage } from './components/LandingPage'
import { LoginSelection } from './components/LoginSelection'
import { CustomerDashboard } from './components/CustomerDashboard'
import { ECommerceComparison } from './components/ECommerceComparison'
import { DataAnalytics } from './components/DataAnalytics'
import { AdminWorkspace } from './components/AdminWorkspace'
import { SuperAdminPortal } from './components/SuperAdminPortal'
import { WebsiteBuilder } from './components/WebsiteBuilder'
import { AuthProvider, useAuth } from './hooks/useAuth'
import PaymentsSetup from './components/PaymentsSetup'
import Register from './components/Register'
import { BlogPage } from './components/BlogPage'
import { BlogPost } from './components/BlogPost'
import { BlogAdmin } from './components/BlogAdmin'

function AppContent() {
  const { user, loading, isAdmin, isCustomer, isSuperAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle automatic redirects after authentication
  React.useEffect(() => {
    if (!loading && user) {
      console.log('Checking redirect for user:', { 
        email: user.email, 
        role: user.role, 
        pathname: location.pathname,
        isAdmin,
        isCustomer,
        isSuperAdmin
      })
      
      // Only redirect from the dedicated login page, never from the landing page
      if (location.pathname === '/login') {
        // Redirect authenticated users to their appropriate dashboard
        if (isSuperAdmin) {
          console.log('Redirecting to super-admin')
          navigate('/super-admin', { replace: true })
        } else if (isAdmin) {
          console.log('Redirecting to admin-dashboard')
          navigate('/admin-dashboard', { replace: true })
        } else if (isCustomer) {
          console.log('Redirecting to dashboard')
          navigate('/dashboard', { replace: true })
        }
      }
    }
  }, [user, loading, location.pathname, navigate, isAdmin, isCustomer, isSuperAdmin])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading ModularSaaS Platform...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginSelection onBack={() => navigate('/')} onRoleSelect={() => {}} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          user ? (
            isCustomer || isSuperAdmin ? <CustomerDashboard /> : 
            isAdmin ? <Navigate to="/admin-dashboard" replace /> :
            <Navigate to="/login" replace />
          ) : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/ecommerce-comparison" 
        element={
          user ? (
            isCustomer || isSuperAdmin ? <ECommerceComparison /> :
            <Navigate to="/login" replace />
          ) : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/data-analytics"
        element={
          user ? (
            isCustomer || isSuperAdmin ? <DataAnalytics /> :
            <Navigate to="/login" replace />
          ) : <Navigate to="/login" replace />
        }
      />
      <Route 
        path="/admin-dashboard" 
        element={
          user ? (
            isAdmin || isSuperAdmin ? <AdminWorkspace /> : 
            isCustomer ? <Navigate to="/customer-dashboard" replace /> :
            <Navigate to="/login" replace />
          ) : <Navigate to="/login" replace />
        } 
      />
      
      {/* Super Admin Portal */}
      <Route 
        path="/super-admin" 
        element={
          user ? (
            isSuperAdmin ? <SuperAdminPortal /> : 
            isAdmin ? <Navigate to="/admin-dashboard" replace /> :
            <Navigate to="/customer-dashboard" replace />
          ) : <Navigate to="/login" replace />
        } 
      />
      
      {/* Website Builder */}
      <Route 
        path="/website-builder" 
        element={
          user ? <WebsiteBuilder /> : <Navigate to="/login" replace />
        } 
      />

      {/* Blog Admin */}
      <Route 
        path="/blog-admin"
        element={
          user ? (
            isAdmin || isSuperAdmin ? <BlogAdmin /> :
            <Navigate to="/login" replace />
          ) : <Navigate to="/login" replace />
        }
      />

      {/* Payments Setup */}
      <Route path="/payments" element={<PaymentsSetup />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  console.log('Rendering App component');
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App