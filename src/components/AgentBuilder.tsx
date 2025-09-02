import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { 
  Plus, 
  Play, 
  Pause, 
  Save,
  Trash2,
  Settings,
  Brain,
  MessageCircle,
  Code2,
  Database,
  Globe,
  Zap,
  Bot,
  TestTube,
  Download,
  Upload
} from 'lucide-react'
import blink from '../blink/client'

interface AIAgent {
  id: string
  name: string
  description: string
  userId: string
  agentConfig: string
  model: string
  systemPrompt: string
  status: string
  createdAt: string
  updatedAt: string
  lastUsed: string | null
  usageCount: number
}

export function AgentBuilder() {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null)
  const [user, setUser] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [testOutput, setTestOutput] = useState('')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        loadAgents(state.user.id)
      }
    })
    return unsubscribe
  }, [])

  const loadAgents = async (userId: string) => {
    try {
      const agentsData = await blink.db.aiAgents.list({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
      })
      setAgents(agentsData)
    } catch (error) {
      console.error('Failed to load agents:', error)
    }
  }

  const createNewAgent = async () => {
    if (!user) return

    setIsCreating(true)
    try {
      const newAgent = {
        id: `agent_${Date.now()}`,
        name: 'New AI Agent',
        description: 'Describe what your agent does',
        userId: user.id,
        agentConfig: JSON.stringify({
          capabilities: ['text-generation', 'analysis'],
          integrations: [],
          settings: {}
        }),
        model: 'gpt-4o-mini',
        systemPrompt: 'You are a helpful AI assistant. Respond professionally and accurately.',
        status: 'active',
        usageCount: 0
      }

      await blink.db.aiAgents.create(newAgent)
      await loadAgents(user.id)
      setSelectedAgent(newAgent)
    } catch (error) {
      console.error('Failed to create agent:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const saveAgent = async () => {
    if (!selectedAgent) return

    try {
      await blink.db.aiAgents.update(selectedAgent.id, {
        name: selectedAgent.name,
        description: selectedAgent.description,
        systemPrompt: selectedAgent.systemPrompt,
        model: selectedAgent.model,
        updatedAt: new Date().toISOString()
      })
      
      await loadAgents(user.id)
    } catch (error) {
      console.error('Failed to save agent:', error)
    }
  }

  const deleteAgent = async (agentId: string) => {
    try {
      await blink.db.aiAgents.delete(agentId)
      await loadAgents(user.id)
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(null)
      }
    } catch (error) {
      console.error('Failed to delete agent:', error)
    }
  }

  const testAgent = async () => {
    if (!selectedAgent || !testInput.trim()) return

    setIsTesting(true)
    setTestOutput('')

    try {
      const { text } = await blink.ai.generateText({
        prompt: testInput,
        model: selectedAgent.model as any,
        maxTokens: 500
      })
      
      setTestOutput(text)
      
      // Update usage count
      await blink.db.aiAgents.update(selectedAgent.id, {
        usageCount: selectedAgent.usageCount + 1,
        lastUsed: new Date().toISOString()
      })
      
    } catch (error) {
      console.error('Failed to test agent:', error)
      setTestOutput('Error: Failed to generate response. Please check your configuration.')
    } finally {
      setIsTesting(false)
    }
  }

  const models = [
    { id: 'gpt-4o-mini', name: 'GPT-4O Mini', description: 'Fast and efficient' },
    { id: 'gpt-4o', name: 'GPT-4O', description: 'Most capable model' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Highest quality' }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex h-full">
        {/* Agent List Sidebar */}
        <div className="w-80 bg-black/30 backdrop-blur-sm border-r border-white/10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">AI Agents</h2>
            <Button 
              onClick={createNewAgent}
              disabled={isCreating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isCreating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {agents.map((agent) => (
              <Card 
                key={agent.id}
                className={`cursor-pointer transition-all group ${
                  selectedAgent?.id === agent.id 
                    ? 'bg-purple-500/20 border-purple-500/50' 
                    : 'bg-black/40 border-white/10 hover:bg-black/60'
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <h3 className="text-white font-medium text-sm">{agent.name}</h3>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{agent.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary"
                          className={
                            agent.status === 'active' ? 'bg-green-500/20 text-green-300' :
                            agent.status === 'training' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-gray-500/20 text-gray-300'
                          }
                        >
                          {agent.status}
                        </Badge>
                        <span className="text-gray-400 text-xs">{agent.usageCount} uses</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteAgent(agent.id)
                      }}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Configuration Area */}
        <div className="flex-1 flex flex-col">
          {selectedAgent ? (
            <>
              {/* Agent Header */}
              <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1 mr-6">
                    <Input
                      value={selectedAgent.name}
                      onChange={(e) => setSelectedAgent(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="text-2xl font-bold bg-transparent border-none text-white p-0 mb-2"
                      placeholder="Agent Name"
                    />
                    <Input
                      value={selectedAgent.description}
                      onChange={(e) => setSelectedAgent(prev => prev ? {...prev, description: e.target.value} : null)}
                      className="bg-transparent border-none text-gray-300 p-0"
                      placeholder="Agent Description"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={saveAgent}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setSelectedAgent(prev => prev ? {...prev, status: prev.status === 'active' ? 'paused' : 'active'} : null)}
                    >
                      {selectedAgent.status === 'active' ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Configuration Tabs */}
              <div className="flex-1 p-6">
                <div className="grid lg:grid-cols-2 gap-6 h-full">
                  {/* Configuration Panel */}
                  <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Agent Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">AI Model</label>
                        <select 
                          value={selectedAgent.model}
                          onChange={(e) => setSelectedAgent(prev => prev ? {...prev, model: e.target.value} : null)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          {models.map(model => (
                            <option key={model.id} value={model.id} className="bg-gray-800">
                              {model.name} - {model.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">System Prompt</label>
                        <Textarea
                          value={selectedAgent.systemPrompt}
                          onChange={(e) => setSelectedAgent(prev => prev ? {...prev, systemPrompt: e.target.value} : null)}
                          className="bg-white/10 border-white/20 text-white min-h-[200px]"
                          placeholder="Define your agent's personality, role, and behavior..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">Status</label>
                          <Badge 
                            className={
                              selectedAgent.status === 'active' ? 'bg-green-500/20 text-green-300' :
                              selectedAgent.status === 'training' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-gray-500/20 text-gray-300'
                            }
                          >
                            {selectedAgent.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">Usage Count</label>
                          <p className="text-gray-300">{selectedAgent.usageCount} interactions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Panel */}
                  <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <TestTube className="w-5 h-5 mr-2" />
                        Test Your Agent
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Test Input</label>
                        <Textarea
                          value={testInput}
                          onChange={(e) => setTestInput(e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Enter a message to test your agent..."
                          rows={4}
                        />
                      </div>

                      <Button 
                        onClick={testAgent}
                        disabled={isTesting || !testInput.trim()}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        {isTesting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Test Agent
                          </>
                        )}
                      </Button>

                      {testOutput && (
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">Agent Response</label>
                          <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-h-64 overflow-y-auto">
                            <p className="text-gray-300 whitespace-pre-wrap">{testOutput}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Brain className="w-24 h-24 text-gray-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">AI Agent Builder</h2>
                <p className="text-gray-300 mb-8 max-w-md">
                  Create intelligent AI agents with custom personalities, capabilities, and integrations. 
                  Select an agent from the sidebar or create a new one to get started.
                </p>
                <Button 
                  onClick={createNewAgent}
                  disabled={isCreating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isCreating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Your First Agent
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}