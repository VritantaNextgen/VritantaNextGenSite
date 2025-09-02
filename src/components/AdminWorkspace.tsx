import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ToolBuilder } from './ToolBuilder'
import { WorkflowBuilder } from './WorkflowBuilder'
import { AgentBuilder } from './AgentBuilder'
import { BlogAdmin } from './BlogAdmin'
import { AdminTutorials } from './AdminTutorials'
import { 
  Code2, 
  Workflow, 
  Brain, 
  Settings, 
  Users, 
  BarChart3,
  Puzzle,
  Globe,
  Plus,
  LogOut,
  Bell,
  HelpCircle,
  BookOpen,
  Shield
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import db from '../services/database'

export function AdminWorkspace() {
  const { user, logout, isSuperAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dbProjects, setDbProjects] = useState<any[]>([])
  const [counts, setCounts] = useState({ tools: 0, users: 0, workflows: 0, agents: 0 })

  const handleLogout = () => {
    logout('/')
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [projects, tools, users, workflows, agents] = await Promise.all([
          db.projects.list({ limit: 8 }),
          db.tools.list({}),
          db.users.list({ where: {}, limit: 1000 }),
          db.workflows.list({}),
          db.aiAgents.list({})
        ])
        setDbProjects(projects)
        setCounts({ tools: tools.length, users: users.length, workflows: workflows.length, agents: agents.length })
      } catch (e) {
        console.error('Failed to load admin dashboard data', e)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Navigation */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Developer Workspace</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Admin Mode
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Bell className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white"
                onClick={() => setActiveTab('tutorials')}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <span className="text-white text-sm block">{user?.displayName || user?.email || 'Admin'}</span>
                  <div className="flex items-center space-x-1">
                    {isSuperAdmin && <Shield className="w-3 h-3 text-yellow-400" />}
                    <span className="text-xs text-gray-400">
                      {isSuperAdmin ? 'SuperAdmin' : 'Admin'}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-300 hover:text-white">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-black/30 backdrop-blur-sm border-r border-white/10 p-4">
          <nav className="space-y-2">
            <Button 
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === 'tools' ? 'default' : 'ghost'} 
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('tools')}
            >
              <Puzzle className="w-4 h-4 mr-2" />
              Tool Builder
            </Button>
            <Button 
              variant={activeTab === 'workflows' ? 'default' : 'ghost'} 
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('workflows')}
            >
              <Workflow className="w-4 h-4 mr-2" />
              Workflows
            </Button>
            <Button 
              variant={activeTab === 'agents' ? 'default' : 'ghost'} 
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('agents')}
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Agents
            </Button>
            <Button 
              variant={activeTab === 'blog' ? 'default' : 'ghost'} 
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('blog')}
            >
              <Globe className="w-4 h-4 mr-2" />
              Blog Manager
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'default' : 'ghost'} 
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-4 h-4 mr-2" />
              User Management
            </Button>
            <Button 
              variant={activeTab === 'tutorials' ? 'default' : 'ghost'} 
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('tutorials')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Tutorials
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'} 
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Projects', value: dbProjects.length, icon: BarChart3 },
                  { label: 'Tools', value: counts.tools, icon: Puzzle },
                  { label: 'Users', value: counts.users, icon: Users },
                  { label: 'AI Agents', value: counts.agents, icon: Brain },
                ].map((s, i) => (
                  <Card key={i} className="bg-black/40 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{s.label}</p>
                        <p className="text-2xl font-bold text-white">{s.value}</p>
                      </div>
                      <s.icon className="w-6 h-6 text-purple-400" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Projects */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Recent Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dbProjects.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">No projects yet</div>
                    ) : (
                      dbProjects.map((project: any) => (
                        <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium">{project.name}</h3>
                            <p className="text-gray-400 text-sm">{project.type} • Updated {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="secondary">{project.status || 'in-progress'}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'tools' && (
            <ToolBuilder />
          )}

          {activeTab === 'workflows' && (
            <WorkflowBuilder />
          )}

          {activeTab === 'agents' && (
            <AgentBuilder />
          )}

          {activeTab === 'blog' && (
            <BlogAdmin />
          )}

          {activeTab === 'tutorials' && (
            <AdminTutorials />
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">User Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">1,247</div>
                      <div className="text-gray-400">Total Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">89</div>
                      <div className="text-gray-400">Active Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">12</div>
                      <div className="text-gray-400">New This Week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Platform Settings</h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-white text-sm font-medium">Platform Name</label>
                      <input 
                        type="text" 
                        defaultValue="ModularSaaS Platform"
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium">Default Theme</label>
                      <select className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                        <option>Dark Mode</option>
                        <option>Light Mode</option>
                        <option>Auto</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Two-Factor Authentication</span>
                      <Badge className="bg-green-500/20 text-green-300">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">API Rate Limiting</span>
                      <Badge className="bg-green-500/20 text-green-300">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Audit Logging</span>
                      <Badge className="bg-green-500/20 text-green-300">Enabled</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}