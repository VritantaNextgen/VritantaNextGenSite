import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { 
  Plus, 
  Play, 
  Pause, 
  Save,
  Trash2,
  Settings,
  ArrowRight,
  Database,
  Mail,
  Webhook,
  Timer,
  Filter,
  Code2,
  Zap
} from 'lucide-react'
import blink from '../blink/client'

interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition'
  name: string
  icon: string
  config: any
  position: { x: number; y: number }
}

interface Workflow {
  id: string
  name: string
  description: string
  userId: string
  workflowData: string
  status: string
  triggerType: string
  triggerConfig: string
  createdAt: string
  updatedAt: string
  lastRun: string | null
  runCount: number
}

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [user, setUser] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        loadWorkflows(state.user.id)
      }
    })
    return unsubscribe
  }, [])

  const loadWorkflows = async (userId: string) => {
    try {
      const workflowsData = await blink.db.workflows.list({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
      })
      setWorkflows(workflowsData)
    } catch (error) {
      console.error('Failed to load workflows:', error)
    }
  }

  const createNewWorkflow = async () => {
    if (!user) return

    setIsCreating(true)
    try {
      const newWorkflow = {
        id: `workflow_${Date.now()}`,
        name: 'New Workflow',
        description: 'Describe your workflow',
        userId: user.id,
        workflowData: JSON.stringify([]),
        status: 'draft',
        triggerType: 'manual',
        triggerConfig: JSON.stringify({}),
        runCount: 0
      }

      await blink.db.workflows.create(newWorkflow)
      await loadWorkflows(user.id)
      setSelectedWorkflow(newWorkflow)
      setNodes([])
    } catch (error) {
      console.error('Failed to create workflow:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const saveWorkflow = async () => {
    if (!selectedWorkflow) return

    try {
      await blink.db.workflows.update(selectedWorkflow.id, {
        workflowData: JSON.stringify(nodes),
        updatedAt: new Date().toISOString()
      })
      
      await loadWorkflows(user.id)
    } catch (error) {
      console.error('Failed to save workflow:', error)
    }
  }

  const deleteWorkflow = async (workflowId: string) => {
    try {
      await blink.db.workflows.delete(workflowId)
      await loadWorkflows(user.id)
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(null)
        setNodes([])
      }
    } catch (error) {
      console.error('Failed to delete workflow:', error)
    }
  }

  const addNode = (type: 'trigger' | 'action' | 'condition') => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      name: type === 'trigger' ? 'New Trigger' : type === 'action' ? 'New Action' : 'New Condition',
      icon: type === 'trigger' ? 'Zap' : type === 'action' ? 'Settings' : 'Filter',
      config: {},
      position: { x: Math.random() * 400, y: Math.random() * 300 }
    }
    setNodes(prev => [...prev, newNode])
  }

  const removeNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
  }

  const nodeTemplates = [
    { type: 'trigger', name: 'Webhook Trigger', icon: Webhook, color: 'text-green-400' },
    { type: 'trigger', name: 'Schedule Trigger', icon: Timer, color: 'text-blue-400' },
    { type: 'action', name: 'Send Email', icon: Mail, color: 'text-purple-400' },
    { type: 'action', name: 'Database Query', icon: Database, color: 'text-orange-400' },
    { type: 'condition', name: 'If/Then Logic', icon: Filter, color: 'text-cyan-400' },
    { type: 'action', name: 'API Call', icon: Code2, color: 'text-pink-400' }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex h-full">
        {/* Workflow List Sidebar */}
        <div className="w-80 bg-black/30 backdrop-blur-sm border-r border-white/10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Workflows</h2>
            <Button 
              onClick={createNewWorkflow}
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
            {workflows.map((workflow) => (
              <Card 
                key={workflow.id}
                className={`cursor-pointer transition-all ${
                  selectedWorkflow?.id === workflow.id 
                    ? 'bg-purple-500/20 border-purple-500/50' 
                    : 'bg-black/40 border-white/10 hover:bg-black/60'
                }`}
                onClick={() => {
                  setSelectedWorkflow(workflow)
                  try {
                    const workflowNodes = JSON.parse(workflow.workflowData || '[]')
                    setNodes(workflowNodes)
                  } catch {
                    setNodes([])
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm mb-1">{workflow.name}</h3>
                      <p className="text-gray-400 text-xs mb-2">{workflow.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary"
                          className={
                            workflow.status === 'active' ? 'bg-green-500/20 text-green-300' :
                            workflow.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-gray-500/20 text-gray-300'
                          }
                        >
                          {workflow.status}
                        </Badge>
                        <span className="text-gray-400 text-xs">{workflow.runCount} runs</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteWorkflow(workflow.id)
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

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {selectedWorkflow ? (
            <>
              {/* Workflow Header */}
              <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-white">{selectedWorkflow.name}</h1>
                    <p className="text-gray-300">{selectedWorkflow.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={saveWorkflow}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run
                    </Button>
                  </div>
                </div>
              </div>

              {/* Node Palette */}
              <div className="bg-black/10 border-b border-white/10 p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="text-white font-medium">Add Components:</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {nodeTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => addNode(template.type as 'trigger' | 'action' | 'condition')}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <template.icon className={`w-4 h-4 mr-2 ${template.color}`} />
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 relative bg-black/5 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                
                {nodes.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Workflow className="w-24 h-24 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Start Building Your Workflow</h3>
                      <p className="text-gray-400 mb-6">Add triggers, actions, and conditions to create powerful automations</p>
                      <Button 
                        onClick={() => addNode('trigger')}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Add Your First Trigger
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8">
                    <div className="flex flex-wrap gap-4">
                      {nodes.map((node, index) => (
                        <Card 
                          key={node.id}
                          className="w-64 bg-black/40 border-white/10 backdrop-blur-sm cursor-move hover:bg-black/60 transition-all"
                          style={{
                            transform: `translate(${node.position.x}px, ${node.position.y}px)`
                          }}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <Badge 
                                variant="secondary"
                                className={
                                  node.type === 'trigger' ? 'bg-green-500/20 text-green-300' :
                                  node.type === 'action' ? 'bg-blue-500/20 text-blue-300' :
                                  'bg-orange-500/20 text-orange-300'
                                }
                              >
                                {node.type}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNode(node.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <h3 className="text-white font-medium mb-2">{node.name}</h3>
                            <p className="text-gray-400 text-sm mb-3">Configure this {node.type}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full border-white/20 text-white hover:bg-white/10"
                            >
                              <Settings className="w-3 h-3 mr-2" />
                              Configure
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Connection Lines (simplified) */}
                    {nodes.length > 1 && (
                      <div className="absolute inset-0 pointer-events-none">
                        {nodes.slice(0, -1).map((node, index) => (
                          <div
                            key={`connection-${index}`}
                            className="absolute w-px h-16 bg-purple-400/50"
                            style={{
                              left: node.position.x + 128,
                              top: node.position.y + 100,
                              transform: 'rotate(45deg)'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Workflow className="w-24 h-24 text-gray-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">Visual Workflow Builder</h2>
                <p className="text-gray-300 mb-8 max-w-md">
                  Create powerful automation workflows with our drag-and-drop interface. 
                  Select a workflow from the sidebar or create a new one to get started.
                </p>
                <Button 
                  onClick={createNewWorkflow}
                  disabled={isCreating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isCreating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Your First Workflow
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}