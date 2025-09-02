import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Bot, 
  Download, 
  Code2, 
  Sparkles, 
  Play, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Brain,
  Settings,
  FileCode,
  Rocket
} from 'lucide-react'

interface LandingPageModalsProps {
  freeTrialOpen: boolean
  setFreeTrialOpen: (open: boolean) => void
  learnMoreOpen: boolean
  setLearnMoreOpen: (open: boolean) => void
  watchDemoOpen: boolean
  setWatchDemoOpen: (open: boolean) => void
}

export function LandingPageModals({
  freeTrialOpen,
  setFreeTrialOpen,
  learnMoreOpen,
  setLearnMoreOpen,
  watchDemoOpen,
  setWatchDemoOpen
}: LandingPageModalsProps) {
  const [agentName, setAgentName] = useState('')
  const [agentDescription, setAgentDescription] = useState('')
  const [agentType, setAgentType] = useState('chatbot')
  const [isBuilding, setIsBuilding] = useState(false)
  const [builtAgent, setBuiltAgent] = useState<any>(null)
  const [demoStep, setDemoStep] = useState(0)
  const [demoRunning, setDemoRunning] = useState(false)

  const agentTypes = [
    { id: 'chatbot', name: 'AI Chatbot', icon: Bot, description: 'Conversational AI assistant' },
    { id: 'analyzer', name: 'Data Analyzer', icon: Brain, description: 'Analyze and process data' },
    { id: 'automation', name: 'Task Automation', icon: Settings, description: 'Automate repetitive tasks' },
    { id: 'content', name: 'Content Generator', icon: FileCode, description: 'Generate content and copy' }
  ]

  const demoSteps = [
    'Initializing demo environment...',
    'Loading sample data...',
    'Configuring automation workflows...',
    'Setting up AI models...',
    'Running performance tests...',
    'Demo completed successfully!'
  ]

  const handleBuildAgent = async () => {
    setIsBuilding(true)
    
    // Simulate agent building process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const agent = {
      id: `agent_${Date.now()}`,
      name: agentName,
      description: agentDescription,
      type: agentType,
      code: generateAgentCode(agentName, agentType),
      createdAt: new Date().toISOString()
    }
    
    setBuiltAgent(agent)
    setIsBuilding(false)
  }

  const generateAgentCode = (name: string, type: string) => {
    return `// ${name} - AI Agent
import { createAgent } from '@modularsaas/ai-agent'

export class ${name.replace(/\s+/g, '')}Agent {
  constructor() {
    this.name = '${name}'
    this.type = '${type}'
    this.model = 'gpt-4o-mini'
  }

  async process(input) {
    // AI processing logic here
    const response = await this.generateResponse(input)
    return response
  }

  async generateResponse(input) {
    // Custom ${type} logic
    return {
      success: true,
      data: 'AI-generated response',
      timestamp: new Date().toISOString()
    }
  }
}

export default ${name.replace(/\s+/g, '')}Agent`
  }

  const downloadAgentCode = () => {
    if (!builtAgent) return
    
    const blob = new Blob([builtAgent.code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${builtAgent.name.replace(/\s+/g, '')}-agent.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const runDemo = async () => {
    setDemoRunning(true)
    setDemoStep(0)
    
    for (let i = 0; i < demoSteps.length; i++) {
      setDemoStep(i)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    setDemoRunning(false)
  }

  return (
    <>
      {/* Free Trial Modal - AI Agent Builder */}
      <Dialog open={freeTrialOpen} onOpenChange={setFreeTrialOpen}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold flex items-center">
              <Bot className="w-8 h-8 mr-3 text-purple-400" />
              AI Agent Builder
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Builder Form */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="agentName" className="text-lg font-medium">Agent Name</Label>
                <Input
                  id="agentName"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="My AI Assistant"
                  className="mt-2 bg-black/20 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="agentDescription" className="text-lg font-medium">Description</Label>
                <Textarea
                  id="agentDescription"
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  placeholder="Describe what your AI agent should do..."
                  className="mt-2 bg-black/20 border-white/20 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-lg font-medium">Agent Type</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {agentTypes.map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        agentType === type.id
                          ? 'bg-purple-600/30 border-purple-400'
                          : 'bg-black/20 border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => setAgentType(type.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <type.icon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                        <h4 className="font-medium text-white">{type.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleBuildAgent}
                disabled={!agentName || !agentDescription || isBuilding}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isBuilding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Building Agent...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Build AI Agent
                  </>
                )}
              </Button>
            </div>

            {/* Preview/Result */}
            <div className="bg-black/30 rounded-lg p-6">
              {!builtAgent ? (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">Agent Preview</h3>
                  <p className="text-gray-500">Fill out the form to build your AI agent</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Agent Built Successfully!</h3>
                    <Badge className="bg-green-500/20 text-green-300">Ready</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-400">Name</Label>
                      <p className="text-white font-medium">{builtAgent.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-400">Type</Label>
                      <p className="text-white font-medium capitalize">{builtAgent.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-400">Description</Label>
                      <p className="text-white">{builtAgent.description}</p>
                    </div>
                  </div>

                  <div className="bg-black/40 rounded p-4">
                    <Label className="text-sm text-gray-400">Generated Code Preview</Label>
                    <pre className="text-xs text-green-300 mt-2 overflow-x-auto">
                      {builtAgent.code.substring(0, 200)}...
                    </pre>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={downloadAgentCode}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Code
                    </Button>
                    <Button
                      onClick={() => {
                        setBuiltAgent(null)
                        setAgentName('')
                        setAgentDescription('')
                      }}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Build Another
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Watch Demo Modal */}
      <Dialog open={watchDemoOpen} onOpenChange={setWatchDemoOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 to-blue-900 border-blue-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              <Play className="w-6 h-6 mr-3 text-blue-400" />
              Interactive Demo
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-black/30 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Automated Demo Walkthrough</h3>
              
              {!demoRunning && demoStep === 0 ? (
                <div className="text-center py-8">
                  <Rocket className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                  <p className="text-gray-300 mb-6">
                    Experience our platform with an automated demo that showcases key features
                  </p>
                  <Button
                    onClick={runDemo}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Demo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Demo Progress</span>
                    <span className="text-blue-300">{demoStep + 1} / {demoSteps.length}</span>
                  </div>
                  
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="bg-black/40 rounded p-4">
                    <p className="text-white flex items-center">
                      {demoRunning && demoStep < demoSteps.length - 1 ? (
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                      )}
                      {demoSteps[demoStep]}
                    </p>
                  </div>
                  
                  {demoStep === demoSteps.length - 1 && (
                    <div className="text-center pt-4">
                      <Button
                        onClick={() => {
                          setDemoStep(0)
                          setWatchDemoOpen(false)
                        }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Demo Complete - Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Learn More Modal */}
      <Dialog open={learnMoreOpen} onOpenChange={setLearnMoreOpen}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold flex items-center">
              <Zap className="w-8 h-8 mr-3 text-purple-400" />
              Platform Overview
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-300">What is ModularSaaS?</h3>
                <p className="text-gray-300 leading-relaxed">
                  ModularSaaS is a next-generation platform that combines intelligent automation, 
                  AI-powered analytics, and modular tool integration. Built for both business users 
                  and developers, it offers dual interfaces optimized for different needs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-300">Key Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                    Reduce manual work by up to 80%
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                    10x faster ROI compared to traditional solutions
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                    No-code/low-code development environment
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                    Enterprise-grade security and compliance
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-pink-300">Perfect For</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-black/20 border-white/10">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-white mb-2">Business Teams</h4>
                      <p className="text-sm text-gray-400">Streamlined workflows and automation</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/20 border-white/10">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-white mb-2">Developers</h4>
                      <p className="text-sm text-gray-400">Advanced customization and integration</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-white">Core Features</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Bot className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-white">AI Agent Builder</h4>
                      <p className="text-sm text-gray-400">Create custom AI agents for any task</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Settings className="w-5 h-5 text-purple-400 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-white">Workflow Automation</h4>
                      <p className="text-sm text-gray-400">Visual drag-and-drop workflow builder</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Brain className="w-5 h-5 text-pink-400 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-white">Predictive Analytics</h4>
                      <p className="text-sm text-gray-400">AI-powered insights and forecasting</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Code2 className="w-5 h-5 text-green-400 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-white">Developer Tools</h4>
                      <p className="text-sm text-gray-400">Advanced customization and APIs</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-lg font-bold mb-3 text-white">Ready to Get Started?</h3>
                <p className="text-gray-300 mb-4">
                  Join thousands of companies already transforming their operations with ModularSaaS.
                </p>
                <Button
                  onClick={() => {
                    setLearnMoreOpen(false)
                    setFreeTrialOpen(true)
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}