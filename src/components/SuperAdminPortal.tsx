import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Users, 
  Shield, 
  Settings, 
  Database, 
  Plus, 
  CheckCircle, 
  XCircle,
  Crown,
  UserPlus,
  Key
} from 'lucide-react'
import bcrypt from 'bcryptjs'
import db from '../services/database'
import { useAuth } from '../hooks/useAuth'

interface User {
  id: string
  email: string
  displayName: string
  role: 'customer' | 'admin' | 'superadmin'
  isActive: string
  createdAt: string
  lastLogin?: string
  accessGrantedBy?: string
  accessGrantedAt?: string
  passwordHash?: string
}

export function SuperAdminPortal() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Add User Form
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserRole, setNewUserRole] = useState<'customer' | 'admin'>('customer')
  const [addingUser, setAddingUser] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    customerUsers: 0
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const allUsers = await db.users.list({ where: {} })
      
      setUsers(allUsers as User[])
      
      // Calculate stats
      const active = allUsers.filter((u: any) => u.isActive === '1').length
      const admins = allUsers.filter((u: any) => u.role === 'admin' || u.role === 'superadmin').length
      const customers = allUsers.filter((u: any) => u.role === 'customer').length
      
      setStats({
        totalUsers: (allUsers as any[]).length,
        activeUsers: active,
        adminUsers: admins,
        customerUsers: customers
      })
    } catch (err) {
      console.error('Failed to load users:', err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserName) {
      setError('Email and name are required')
      return
    }

    try {
      setAddingUser(true)
      setError('')
      
      const newUser = {
        id: `user_${Date.now()}`,
        email: newUserEmail.toLowerCase(),
        displayName: newUserName,
        role: newUserRole,
        isActive: '1',
        accessGrantedBy: user?.id,
        accessGrantedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await db.users.create(newUser)
      
      setSuccess(`User ${newUserName} added successfully`)
      setNewUserEmail('')
      setNewUserName('')
      setNewUserRole('customer')
      
      // Reload users
      await loadUsers()
    } catch (err) {
      console.error('Failed to add user:', err)
      setError('Failed to add user. Email might already exist.')
    } finally {
      setAddingUser(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await db.users.update(userId, {
        role: newRole as 'customer' | 'admin' | 'superadmin',
        updatedAt: new Date().toISOString()
      })
      
      setSuccess('User role updated successfully')
      await loadUsers()
    } catch (err) {
      console.error('Failed to update user role:', err)
      setError('Failed to update user role')
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === '1' ? '0' : '1'
      await db.users.update(userId, {
        isActive: newStatus,
        updatedAt: new Date().toISOString()
      })
      
      setSuccess(`User ${newStatus === '1' ? 'activated' : 'deactivated'} successfully`)
      await loadUsers()
    } catch (err) {
      console.error('Failed to toggle user status:', err)
      setError('Failed to update user status')
    }
  }

  const handleSetPassword = async (userId: string) => {
    const newPass = window.prompt('Enter a new password (min 8 chars)')
    if (!newPass) return
    if (newPass.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    try {
      setError('')
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(newPass, salt)
      await db.users.update(userId, {
        passwordHash,
        updatedAt: new Date().toISOString()
      })
      setSuccess('Password set successfully')
    } catch (err) {
      console.error('Failed to set password:', err)
      setError('Failed to set password')
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30"><Crown className="w-3 h-3 mr-1" />Super Admin</Badge>
      case 'admin':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30"><Shield className="w-3 h-3 mr-1" />Admin</Badge>
      case 'customer':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30"><Users className="w-3 h-3 mr-1" />Customer</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (!user || user.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300">You need super admin privileges to access this portal.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <Crown className="w-10 h-10 mr-3 text-red-400" />
                Super Admin Portal
              </h1>
              <p className="text-gray-300">Manage users, access control, and system settings</p>
            </div>
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Super Admin Access
            </Badge>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30 text-red-300">
            <XCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/30 text-green-300">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Admin Users</p>
                  <p className="text-3xl font-bold text-white">{stats.adminUsers}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Customers</p>
                  <p className="text-3xl font-bold text-white">{stats.customerUsers}</p>
                </div>
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-black/40 border-white/10">
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="access" className="data-[state=active]:bg-purple-600">
              <Key className="w-4 h-4 mr-2" />
              Access Control
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Add User Form */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add New User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="bg-black/20 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name" className="text-white">Display Name</Label>
                    <Input
                      id="name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-black/20 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <Select value={newUserRole} onValueChange={(value: 'customer' | 'admin') => setNewUserRole(value)}>
                      <SelectTrigger className="bg-black/20 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleAddUser}
                      disabled={addingUser}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {addingUser ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add User
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  All Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading users...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="bg-black/20 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{user.displayName || 'No Name'}</h4>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {getRoleBadge(user.role)}
                              <Badge className={user.isActive === '1' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                                {user.isActive === '1' ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Select
                            value={user.role}
                            onValueChange={(value) => handleUpdateUserRole(user.id, value)}
                            disabled={user.role === 'superadmin'}
                          >
                            <SelectTrigger className="w-32 bg-black/20 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              {user.role === 'superadmin' && <SelectItem value="superadmin">Super Admin</SelectItem>}
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                            disabled={user.role === 'superadmin'}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            {user.isActive === '1' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetPassword(user.id)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Set Password
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Control Tab */}
          <TabsContent value="access">
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Access Control Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Access control features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system">
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">System Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">System settings will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}