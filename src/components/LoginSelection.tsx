import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { 
  Users, 
  ArrowLeft, 
  Shield, 
  Zap,
  Briefcase
} from 'lucide-react'
import { EmailPasswordLogin } from './EmailPasswordLogin'

interface LoginSelectionProps {
  onBack: () => void
  onRoleSelect: (role: 'customer' | 'admin') => void
}

export function LoginSelection({ onBack }: LoginSelectionProps) {
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [intendedRole, setIntendedRole] = useState<'customer' | 'admin'>('customer')

  const handleRoleIntent = (role: 'customer' | 'admin') => {
    setIntendedRole(role)
    localStorage.setItem('intended_role', role)
    setShowEmailLogin(true)
  }

  if (showEmailLogin) {
    return (
      <EmailPasswordLogin 
        onBack={() => setShowEmailLogin(false)}
        onSuccess={(user) => {
          // Redirect based on actual role from backend
          if (user.role === 'superadmin') {
            window.location.href = '/super-admin'
          } else if (user.role === 'admin') {
            window.location.href = '/admin-dashboard'
          } else {
            window.location.href = '/customer-dashboard'
          }
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-bold text-white tracking-tight">ModularSaaS</span>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-xl text-gray-300">
            Please select your login type to continue.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Customer Login */}
          <Card 
            className="bg-black/20 border-white/10 backdrop-blur-lg hover:border-blue-400/50 transition-all duration-300 group cursor-pointer"
            onClick={() => handleRoleIntent('customer')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold text-white">Customer Login</CardTitle>
              <Users className="w-6 h-6 text-blue-400" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Access your dashboard to manage your services and tools.
              </p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                <Shield className="w-4 h-4 mr-2" />
                Sign in as a Customer
              </Button>
            </CardContent>
          </Card>

          {/* Team Login */}
          <Card 
            className="bg-black/20 border-white/10 backdrop-blur-lg hover:border-purple-400/50 transition-all duration-300 group cursor-pointer"
            onClick={() => handleRoleIntent('admin')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold text-white">Team Login</CardTitle>
              <Briefcase className="w-6 h-6 text-purple-400" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Enter the workspace for administrators and company heads.
              </p>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                <Shield className="w-4 h-4 mr-2" />
                Sign in as a Team Member
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-400">
            New here? <a href="/register" className="font-medium text-blue-400 hover:text-blue-300">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  )
}
