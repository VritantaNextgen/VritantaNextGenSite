import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import db from '../services/database'
import bcrypt from 'bcryptjs'

interface User {
  id: string
  email: string
  passwordHash?: string
  passwordhash?: string // For Supabase compatibility
  displayName?: string
  role: 'customer' | 'admin' | 'superadmin'
  avatarUrl?: string
  createdAt?: string
  updatedAt?: string
  lastLogin?: string
  isActive?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  hasRole: (role: string | string[]) => boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  isCustomer: boolean
  loginWithEmail: (email: string, password: string) => Promise<User>
  logout: (redirectUrl?: string) => void
  updateUserRole: (userId: string, role: 'admin' | 'superadmin' | 'customer') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'modular_saas_user'
const COMPANY_ADMIN_EMAILS = [
  'admin@modularsaas.com',
  'kai.jiabo.feng@gmail.com',
  'support@modularsaas.com',
  'vioamit1818@gmail.com'
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        // Ensure at least one admin user exists for dev/testing
        const dbContent = localStorage.getItem('db_usersNew') || '[]'
        let users = JSON.parse(dbContent)
        const adminExists = users.some((u: any) => u.email === 'admin@example.com' && (u.role === 'admin' || u.role === 'superadmin'))
        if (!adminExists) {
          // Create a default admin user with plain text password for dev
          const defaultAdmin = {
            id: `user_${Date.now()}_admin`,
            email: 'admin@example.com',
            passwordHash: 'admin123', // Plain text for dev
            displayName: 'Admin User',
            role: 'admin',
            isActive: '1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          users.push(defaultAdmin)
          localStorage.setItem('db_usersNew', JSON.stringify(users))
          console.log('[Auth] Default admin created for dev')
        }
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const stored: User = JSON.parse(raw)
          // Validate user still exists
          const found = await db.users.list({ where: { id: stored.id }, limit: 1 })
          if (found.length > 0) {
            const current = found[0] as User
            // Promote company admins in-memory
            const role = COMPANY_ADMIN_EMAILS.includes(current.email) ? 'superadmin' : (current.role || 'customer')
            const normalized = { ...current, role }
            setUser(normalized)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
          } else {
            // fallback to legacy users table
            const legacy = await db.users.list({ where: { id: stored.id }, limit: 1 })
            if (legacy.length > 0) {
              const current = legacy[0] as User
              const role = COMPANY_ADMIN_EMAILS.includes(current.email) ? 'superadmin' : (current.role || 'customer')
              const normalized = { ...current, role }
              setUser(normalized)
              localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
            } else {
              setUser(null)
              localStorage.removeItem(STORAGE_KEY)
            }
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Auth init error:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const hasRole = (roles: string | string[]) => {
    if (!user) return false
    const arr = Array.isArray(roles) ? roles : [roles]
    return arr.includes(user.role)
  }

  const loginWithEmail = async (rawEmail: string, rawPassword: string): Promise<User> => {
    const email = (rawEmail || '').trim()
    const password = (rawPassword || '').trim()

    console.log('[Auth] Login attempt', { emailMasked: email.replace(/(^.).+(@.*$)/, '$1***$2') })
    console.log('[Auth] Starting login process...')
    
    // Log the localStorage state for debugging
    try {
      const dbContent = localStorage.getItem('db_usersNew') || '[]'
      console.log('[Auth] Current users in database:', JSON.parse(dbContent).length);
    } catch (e) {
      console.error('[Auth] Error checking database state:', e)
    }

    if (!email || !password) {
      console.log('[Auth] Missing email or password')
      throw new Error('Please enter email and password')
    }

    // Try exact match first
    console.log('[Auth] Searching in usersNew collection with exact match...')
    let users = await db.users.list({ where: { email }, limit: 1 })
    console.log('[Auth] usersNew exact match result:', users.length > 0 ? 'Found' : 'Not found')

    // Fallback: lowercased email (some records may be normalized)
    if (users.length === 0) {
      console.log('[Auth] Trying lowercase email search...')
      users = await db.users.list({ where: { email: email.toLowerCase() }, limit: 1 })
      console.log('[Auth] usersNew lowercase result:', users.length > 0 ? 'Found' : 'Not found')
    }

    // Fallback: legacy users table
    if (users.length === 0) {
      console.log('[Auth] Searching in legacy users collection...')
      const legacy = await db.users.list({ where: { email }, limit: 1 })
      console.log('[Auth] Legacy users result:', legacy.length > 0 ? 'Found' : 'Not found')
      if (legacy.length > 0) {
        users = legacy as any
      }
    }

    if (users.length === 0) {
      console.warn('[Auth] No user found for email')
      throw new Error('Invalid email or password')
    }

    const found = users[0] as User
    console.log('[Auth] Found user:', { id: found.id, email: found.email, role: found.role })

    // Block inactive accounts
    if (found.isActive === '0') {
      console.log('[Auth] Account is inactive')
      throw new Error('Account is disabled. Please contact support.')
    }

    const hash = found.passwordHash || found.passwordhash || ''

    // Compare password: support bcrypt hashes and plaintext fallback for dev records
    let passwordMatches = false
    try {
      console.log('[Auth] Comparing password:', { entered: password, stored: hash })
      if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
        // Use bcrypt for hashes
        passwordMatches = await bcrypt.compare(password, hash)
      } else {
        // Plaintext fallback (dev/test)
        passwordMatches = hash === password
      }
      console.log('[Auth] Password match result:', passwordMatches)
    } catch (e) {
      passwordMatches = false
    }

    if (!passwordMatches) {
      console.log('[Auth] Password does not match')
      throw new Error('Invalid email or password')
    }

    // Determine final role (auto-promote company emails)
    const role: User['role'] = COMPANY_ADMIN_EMAILS.includes(found.email)
      ? 'superadmin'
      : (found.role || 'customer')

    console.log('[Auth] User role determined:', { 
      email: found.email, 
      originalRole: found.role, 
      finalRole: role, 
      isInCompanyAdminList: COMPANY_ADMIN_EMAILS.includes(found.email) 
    })

    const normalized: User = { ...found, role }

    // Update last login
    try {
      await db.users.update(found.id, {
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } catch (e) {
      console.warn('[Auth] Failed to update lastLogin (non-blocking)')
    }

    setUser(normalized)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    return normalized
  }

  const logout = (redirectUrl?: string) => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    if (redirectUrl && typeof window !== 'undefined') {
      window.location.href = redirectUrl
    }
  }

  // Fix role type assignment in updateUserRole
  const updateUserRole = async (userId: string, role: 'admin' | 'superadmin' | 'customer') => {
    if (!user || user.role !== 'superadmin') {
      throw new Error('Only superadmins can update user roles')
    }
    await db.users.update(userId, { role, updatedAt: new Date().toISOString() })
    if (userId === user.id) {
      const refreshed = await db.users.list({ where: { id: userId }, limit: 1 })
      if (refreshed.length > 0) {
        const current = refreshed[0] as User
        const normalized = {
          ...current,
          role: COMPANY_ADMIN_EMAILS.includes(current.email) ? 'superadmin' : (current.role || 'customer')
        }
        setUser(normalized)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      }
    }
  }

  const contextValue: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    hasRole,
    isAdmin: hasRole(['admin', 'superadmin']),
    isSuperAdmin: hasRole('superadmin'),
    isCustomer: hasRole('customer'),
    loginWithEmail,
    logout,
    updateUserRole,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}