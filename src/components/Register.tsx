import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Mail, Lock, User, ArrowLeft, Sparkles } from 'lucide-react'
import bcrypt from 'bcryptjs'
import blink from '../blink/client'
import { useAuth } from '../hooks/useAuth'

export function Register() {
  const navigate = useNavigate()
  const { loginWithEmail } = useAuth()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validate = () => {
    if (!email || !password || !confirm || !name) {
      setError('Please fill out all fields')
      return false
    }
    const emailRegex = /.+@.+\..+/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)
    try {
      const normalizedEmail = email.trim().toLowerCase()

      const existingNew = await blink.db.usersNew.list({ where: { email: normalizedEmail }, limit: 1 })
      if (existingNew.length > 0) {
        setError('An account with this email already exists. Please sign in.')
        setLoading(false)
        return
      }

      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)

      const newUser = {
        id: `user_${Date.now()}`,
        email: normalizedEmail,
        passwordHash,
        displayName: name.trim(),
        role: 'customer',
        isActive: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await blink.db.usersNew.create(newUser)

      await loginWithEmail(normalizedEmail, password)

      navigate('/customer-dashboard', { replace: true })
    } catch (err: any) {
      console.error('Registration failed:', err)
      setError(err?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-black/20 border-white/10 backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Create Your Account</CardTitle>
            <p className="text-gray-400">Join to start building and automating.</p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-900/50 border-red-500/50 text-white">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required className="pl-10 bg-black/30 border-white/20 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required className="pl-10 bg-black/30 border-white/20 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8+ characters" required className="pl-10 bg-black/30 border-white/20 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-gray-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" required className="pl-10 bg-black/30 border-white/20 h-12" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold bg-white text-purple-700 hover:bg-gray-200 mt-4">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="font-medium text-blue-400 hover:text-blue-300">
                  Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Register