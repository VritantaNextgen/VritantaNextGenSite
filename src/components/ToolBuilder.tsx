import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { 
  Plus, 
  Trash2, 
  Settings, 
  Save,
  Play,
  Pause,
  Code2,
  Database,
  Globe,
  Mail,
  MessageCircle,
  BarChart3,
  Users,
  FileText,
  Palette,
  Package,
  Brain,
  Workflow,
  Zap
} from 'lucide-react'
import blink from '../blink/client'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: string
  status: string
  version: string
}

interface DroppableArea {
  id: string
  name: string
  tools: Tool[]
}

const iconMap = {
  Globe, Mail, MessageCircle, BarChart3, Users, FileText, Palette, Package, Brain, Workflow, Database, Code2, Zap
}

export function ToolBuilder() {
  const [tools, setTools] = useState<Tool[]>([])
  const [workspaces, setWorkspaces] = useState<DroppableArea[]>([
    { id: 'customer-workspace', name: 'Customer Workspace', tools: [] },
    { id: 'admin-workspace', name: 'Admin Workspace', tools: [] },
    { id: 'marketplace', name: 'Tool Marketplace', tools: [] }
  ])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draggedTool, setDraggedTool] = useState<Tool | null>(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    loadTools()
  }, [])

  const loadTools = async () => {
    try {
      const toolsData = await blink.db.tools.list()
      setTools(toolsData)
      
      // Initialize marketplace with all tools
      setWorkspaces(prev => prev.map(workspace => 
        workspace.id === 'marketplace' 
          ? { ...workspace, tools: toolsData }
          : workspace
      ))
    } catch (error) {
      console.error('Failed to load tools:', error)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    
    // Find the tool being dragged
    const tool = tools.find(t => t.id === active.id)
    setDraggedTool(tool || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setDraggedTool(null)

    if (!over) return

    const toolId = active.id as string
    const targetWorkspaceId = over.id as string

    // Find the tool and target workspace
    const tool = tools.find(t => t.id === toolId)
    if (!tool) return

    // Update workspaces
    setWorkspaces(prev => {
      const newWorkspaces = prev.map(workspace => ({
        ...workspace,
        tools: workspace.tools.filter(t => t.id !== toolId)
      }))

      const targetWorkspace = newWorkspaces.find(w => w.id === targetWorkspaceId)
      if (targetWorkspace && !targetWorkspace.tools.find(t => t.id === toolId)) {
        targetWorkspace.tools.push(tool)
      }

      return newWorkspaces
    })
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Package
    return IconComponent
  }

  const createNewTool = async () => {
    if (!user) return

    const newTool = {
      id: `tool_${Date.now()}`,
      name: 'New Tool',
      description: 'Custom tool description',
      category: 'Custom',
      icon: 'Package',
      status: 'draft',
      version: '1.0.0',
      createdBy: user.id
    }

    try {
      await blink.db.tools.create(newTool)
      await loadTools()
    } catch (error) {
      console.error('Failed to create tool:', error)
    }
  }

  const deleteTool = async (toolId: string) => {
    try {
      await blink.db.tools.delete(toolId)
      await loadTools()
      
      // Remove from all workspaces
      setWorkspaces(prev => prev.map(workspace => ({
        ...workspace,
        tools: workspace.tools.filter(t => t.id !== toolId)
      })))
    } catch (error) {
      console.error('Failed to delete tool:', error)
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tool Builder</h1>
            <p className="text-gray-300">Drag and drop tools to configure your workspace</p>
          </div>
          <Button 
            onClick={createNewTool}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Tool
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {workspaces.map((workspace) => (
            <Card 
              key={workspace.id}
              className="bg-black/40 border-white/10 backdrop-blur-sm flex flex-col"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center">
                  {workspace.id === 'marketplace' && <Package className="w-5 h-5 mr-2" />}
                  {workspace.id === 'customer-workspace' && <Users className="w-5 h-5 mr-2" />}
                  {workspace.id === 'admin-workspace' && <Settings className="w-5 h-5 mr-2" />}
                  {workspace.name}
                </CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {workspace.tools.length} tools
                </Badge>
              </CardHeader>
              
              <CardContent 
                className="flex-1 min-h-[400px] border-2 border-dashed border-white/20 rounded-lg p-4 transition-colors hover:border-white/40"
                style={{ 
                  backgroundColor: activeId && workspace.id !== 'marketplace' ? 'rgba(99, 102, 241, 0.1)' : 'transparent' 
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const toolId = e.dataTransfer.getData('text/plain')
                  handleDragEnd({ active: { id: toolId }, over: { id: workspace.id } } as DragEndEvent)
                }}
              >
                <div className="grid grid-cols-1 gap-3">
                  {workspace.tools.map((tool) => {
                    const IconComponent = getIconComponent(tool.icon)
                    return (
                      <div
                        key={tool.id}
                        draggable
                        className="bg-white/10 border border-white/20 rounded-lg p-4 cursor-move hover:bg-white/20 transition-all group"
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', tool.id)
                          setActiveId(tool.id)
                          setDraggedTool(tool)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-6 h-6 text-purple-400" />
                            <div>
                              <h3 className="text-white font-medium text-sm">{tool.name}</h3>
                              <p className="text-gray-400 text-xs">{tool.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge 
                              variant="secondary"
                              className={
                                tool.status === 'active' ? 'bg-green-500/20 text-green-300' :
                                tool.status === 'beta' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-gray-500/20 text-gray-300'
                              }
                            >
                              {tool.status}
                            </Badge>
                            {workspace.id === 'marketplace' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteTool(tool.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {workspace.tools.length === 0 && workspace.id !== 'marketplace' && (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Drop tools here to configure this workspace</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DragOverlay>
          {draggedTool && (
            <div className="bg-white/20 border border-white/40 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                {(() => {
                  const IconComponent = getIconComponent(draggedTool.icon)
                  return <IconComponent className="w-6 h-6 text-purple-400" />
                })()}
                <div>
                  <h3 className="text-white font-medium text-sm">{draggedTool.name}</h3>
                  <p className="text-gray-400 text-xs">{draggedTool.category}</p>
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}