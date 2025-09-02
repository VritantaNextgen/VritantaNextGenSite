import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface EmailPasswordLoginProps {
  onBack: () => void
  onSuccess: (user: any) => void
}

export function EmailPasswordLogin({ onBack, onSuccess }: EmailPasswordLoginProps) {
  const { loginWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Add debug information
    console.log('[Login] Attempting login with:', { email })
    
    // Check localStorage availability
    if (typeof localStorage === 'undefined') {
      console.error('[Login] localStorage is not available')
      setError('Browser storage is not available. Please enable cookies and try again.')
      setLoading(false)
      return
    }
    
    // Check if we have any users in the database
    try {
      const dbContent = localStorage.getItem('db_usersNew') || '[]'
      const users = JSON.parse(dbContent)
      console.log('[Login] Users in database:', users.length)
      
      if (users.length === 0) {
        console.warn('[Login] No users found in database')
        // Create a test user directly if none exist
        const testUser = {
          id: `user_${Date.now()}_test`,
          email: 'test@example.com',
          passwordHash: 'test123', // Plain text for easy testing
          displayName: 'Test User',
          role: 'customer',
          isActive: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem('db_usersNew', JSON.stringify([testUser]))
        console.log('[Login] Created test user directly in localStorage')
      }
    } catch (e) {
      console.error('[Login] Error checking database:', e)
    }

    try {
      const user = await loginWithEmail(email, password)
      console.log('[Login] Login successful:', user)
      onSuccess(user)
    } catch (err: any) {
      console.error('[Login] Login error:', err)
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-8 text-gray-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login Options
        </Button>

        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Account Login</CardTitle>
            <p className="text-gray-400">Enter your credentials to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/30 text-red-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-black/20 border-white/20 text-white placeholder:text-gray-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                New here?{' '}
                <a href="/register" className="text-purple-300 hover:text-purple-200 underline">Create an account</a>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Tip: Use test@example.com / test123 to login
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Or admin@example.com / admin123 for admin access
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}