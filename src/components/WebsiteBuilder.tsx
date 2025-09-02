import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Globe, 
  Code2, 
  Palette, 
  Settings, 
  Download, 
  Eye, 
  Rocket, 
  Plus,
  Key,
  Zap,
  Brain,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'
import blink from '../blink/client'
import { useAuth } from '../hooks/useAuth'

interface ApiKey {
  id: string
  serviceName: string
  apiKey: string
  isActive: string
}

interface WebsiteProject {
  id: string
  name: string
  description: string
  templateType: string
  config: string
  htmlContent: string
  cssContent: string
  jsContent: string
  status: string
  deployedUrl?: string
}

interface AIModel {
  id: string
  name: string
  provider: string
  isFree: boolean
  description: string
  contextLength: number
}

export function WebsiteBuilder() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('builder')
  const [projects, setProjects] = useState<WebsiteProject[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Builder state
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('landing')
  const [selectedModel, setSelectedModel] = useState('')
  const [buildPrompt, setBuildPrompt] = useState('')
  const [isBuilding, setIsBuilding] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  // API Keys state
  const [newApiService, setNewApiService] = useState('')
  const [newApiKey, setNewApiKey] = useState('')
  const [addingApiKey, setAddingApiKey] = useState(false)

  // Current project
  const [currentProject, setCurrentProject] = useState<WebsiteProject | null>(null)

  const templates = [
    { id: 'landing', name: 'Landing Page', description: 'Modern landing page with hero section' },
    { id: 'portfolio', name: 'Portfolio', description: 'Personal or business portfolio' },
    { id: 'blog', name: 'Blog', description: 'Clean blog layout with posts' },
    { id: 'ecommerce', name: 'E-commerce', description: 'Online store with product catalog' },
    { id: 'saas', name: 'SaaS App', description: 'SaaS application interface' },
    { id: 'dashboard', name: 'Dashboard', description: 'Admin dashboard with charts' }
  ]

  useEffect(() => {
    loadProjects()
    loadApiKeys()
    loadModels()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadProjects = async () => {
    try {
      const userProjects = await blink.db.websiteProjects.list({
        where: { userId: user?.id },
        orderBy: { createdAt: 'desc' }
      })
      setProjects(userProjects as WebsiteProject[])
    } catch (err) {
      console.error('Failed to load projects:', err)
    }
  }

  const loadApiKeys = async () => {
    try {
      const userApiKeys = await blink.db.apiKeys.list({
        where: { userId: user?.id },
        orderBy: { createdAt: 'desc' }
      })
      setApiKeys(userApiKeys as ApiKey[])
    } catch (err) {
      console.error('Failed to load API keys:', err)
    }
  }

  const loadModels = async () => {
    try {
      // Check if user has OpenRouter API key
      const openRouterKey = apiKeys.find(key => key.serviceName === 'openrouter')
      
      if (openRouterKey) {
        // Fetch models from OpenRouter API
        const response = await blink.data.fetch({
          url: 'https://openrouter.ai/api/v1/models',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${openRouterKey.apiKey}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.status === 200) {
          const modelsData = response.body.data || []
          const formattedModels = modelsData
            .map((model: any) => ({
              id: model.id,
              name: model.name || model.id,
              provider: model.id.split('/')[0] || 'unknown',
              isFree: model.pricing?.prompt === '0' || model.pricing?.completion === '0',
              description: model.description || 'No description available',
              contextLength: model.context_length || 4096
            }))
            .sort((a: AIModel, b: AIModel) => {
              // Sort by free first, then by name
              if (a.isFree && !b.isFree) return -1
              if (!a.isFree && b.isFree) return 1
              return a.name.localeCompare(b.name)
            })

          setModels(formattedModels)
        }
      } else {
        // Default models if no OpenRouter key
        setModels([
          {
            id: 'gpt-4o-mini',
            name: 'GPT-4o Mini',
            provider: 'openai',
            isFree: false,
            description: 'Fast and efficient model for most tasks',
            contextLength: 128000
          },
          {
            id: 'claude-3-haiku',
            name: 'Claude 3 Haiku',
            provider: 'anthropic',
            isFree: false,
            description: 'Fast and cost-effective model',
            contextLength: 200000
          }
        ])
      }
    } catch (err) {
      console.error('Failed to load models:', err)
      setError('Failed to load AI models')
    }
  }

  const handleAddApiKey = async () => {
    if (!newApiService || !newApiKey) {
      setError('Service name and API key are required')
      return
    }

    try {
      setAddingApiKey(true)
      setError('')

      const apiKeyData = {
        id: `api_${Date.now()}`,
        userId: user?.id,
        serviceName: newApiService.toLowerCase(),
        apiKey: newApiKey,
        isActive: '1'
      }

      await blink.db.apiKeys.create(apiKeyData)
      
      setSuccess('API key added successfully')
      setNewApiService('')
      setNewApiKey('')
      
      await loadApiKeys()
      
      // Reload models if OpenRouter key was added
      if (newApiService.toLowerCase() === 'openrouter') {
        await loadModels()
      }
    } catch (err) {
      console.error('Failed to add API key:', err)
      setError('Failed to add API key')
    } finally {
      setAddingApiKey(false)
    }
  }

  const handleBuildWebsite = async () => {
    if (!projectName || !buildPrompt) {
      setError('Project name and build prompt are required')
      return
    }

    try {
      setIsBuilding(true)
      setError('')

      // Generate website content using AI
      const prompt = `Create a ${selectedTemplate} website with the following requirements: ${buildPrompt}. 
      Generate clean, modern HTML, CSS, and JavaScript code. Make it responsive and professional.
      Project name: ${projectName}
      Description: ${projectDescription}`

      const { text } = await blink.ai.generateText({
        prompt,
        model: selectedModel || 'gpt-4o-mini',
        maxTokens: 4000
      })

      // Parse the generated content (simplified for demo)
      const htmlContent = extractCodeBlock(text, 'html') || generateDefaultHTML()
      const cssContent = extractCodeBlock(text, 'css') || generateDefaultCSS()
      const jsContent = extractCodeBlock(text, 'js') || generateDefaultJS()

      // Save project to database
      const project = {
        id: `project_${Date.now()}`,
        userId: user?.id,
        name: projectName,
        description: projectDescription,
        templateType: selectedTemplate,
        config: JSON.stringify({ model: selectedModel, prompt: buildPrompt }),
        htmlContent,
        cssContent,
        jsContent,
        status: 'draft'
      }

      await blink.db.websiteProjects.create(project)
      
      setCurrentProject(project as WebsiteProject)
      setSuccess('Website built successfully!')
      
      // Reset form
      setProjectName('')
      setProjectDescription('')
      setBuildPrompt('')
      
      await loadProjects()
    } catch (err) {
      console.error('Failed to build website:', err)
      setError('Failed to build website. Please try again.')
    } finally {
      setIsBuilding(false)
    }
  }

  const extractCodeBlock = (text: string, language: string): string => {
    const regex = new RegExp(`\`\`\`${language}([\\s\\S]*?)\`\`\``, 'i')
    const match = text.match(regex)
    return match ? match[1].trim() : ''
  }

  const generateDefaultHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>${projectName}</h1>
        <nav>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>
    <main>
        <section id="hero">
            <h2>Welcome to ${projectName}</h2>
            <p>${projectDescription}</p>
            <button class="cta-button">Get Started</button>
        </section>
    </main>
    <script src="script.js"></script>
</body>
</html>`
  }

  const generateDefaultCSS = () => {
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

nav {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
}

nav a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

nav a:hover {
    opacity: 0.8;
}

#hero {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding-top: 80px;
}

.cta-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 50px;
    cursor: pointer;
    font-size: 1.1rem;
    margin-top: 2rem;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
}`
  }

  const generateDefaultJS = () => {
    return `document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    
    ctaButton.addEventListener('click', function() {
        alert('Welcome to ${projectName}!');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});`
  }

  const downloadProject = (project: WebsiteProject) => {
    const files = [
      { name: 'index.html', content: project.htmlContent },
      { name: 'styles.css', content: project.cssContent },
      { name: 'script.js', content: project.jsContent }
    ]

    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  const getPreviewStyles = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' }
      case 'tablet':
        return { width: '768px', height: '1024px' }
      default:
        return { width: '100%', height: '600px' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <Globe className="w-10 h-10 mr-3 text-blue-400" />
            Website Builder
          </h1>
          <p className="text-gray-300">Build stunning websites with AI assistance</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30 text-red-300">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/30 text-green-300">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/40 border-white/10">
            <TabsTrigger value="builder" className="data-[state=active]:bg-purple-600">
              <Code2 className="w-4 h-4 mr-2" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-purple-600">
              <Globe className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="apis" className="data-[state=active]:bg-purple-600">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
          </TabsList>

          {/* Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Builder Form */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI Website Builder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="projectName" className="text-white">Project Name</Label>
                    <Input
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="My Awesome Website"
                      className="bg-black/20 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectDescription" className="text-white">Description</Label>
                    <Textarea
                      id="projectDescription"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Brief description of your website"
                      className="bg-black/20 border-white/20 text-white"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label className="text-white">Template Type</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="bg-black/20 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} - {template.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">AI Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="bg-black/20 border-white/20 text-white">
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              {model.isFree && <Badge className="ml-2 bg-green-500/20 text-green-300">Free</Badge>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="buildPrompt" className="text-white">Build Instructions</Label>
                    <Textarea
                      id="buildPrompt"
                      value={buildPrompt}
                      onChange={(e) => setBuildPrompt(e.target.value)}
                      placeholder="Describe what you want your website to look like and do..."
                      className="bg-black/20 border-white/20 text-white"
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={handleBuildWebsite}
                    disabled={isBuilding || !projectName || !buildPrompt}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isBuilding ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Building Website...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Build with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Preview
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={previewMode === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('desktop')}
                        className="p-2"
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={previewMode === 'tablet' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('tablet')}
                        className="p-2"
                      >
                        <Tablet className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={previewMode === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('mobile')}
                        className="p-2"
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg overflow-hidden mx-auto" style={getPreviewStyles()}>
                    {currentProject ? (
                      <iframe
                        srcDoc={`
                          ${currentProject.htmlContent}
                          <style>${currentProject.cssContent}</style>
                          <script>${currentProject.jsContent}</script>
                        `}
                        className="w-full h-full border-0"
                        title="Website Preview"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>Build a website to see preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {currentProject && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        onClick={() => downloadProject(currentProject)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Code
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">No projects yet. Create your first website!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <Card key={project.id} className="bg-black/20 border-white/10 hover:bg-black/30 transition-colors">
                        <CardContent className="p-6">
                          <h3 className="text-white font-bold mb-2">{project.name}</h3>
                          <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-purple-500/20 text-purple-300">
                              {project.templateType}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setCurrentProject(project)}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadProject(project)}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="apis" className="space-y-6">
            {/* Add API Key */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Add API Key
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="service" className="text-white">Service</Label>
                    <Select value={newApiService} onValueChange={setNewApiService}>
                      <SelectTrigger className="bg-black/20 border-white/20 text-white">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openrouter">OpenRouter</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="google">Google AI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="apiKey" className="text-white">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      placeholder="Enter API key"
                      className="bg-black/20 border-white/20 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleAddApiKey}
                      disabled={addingApiKey}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {addingApiKey ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Key
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Keys List */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Your API Keys</CardTitle>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">No API keys configured</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="bg-black/20 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium capitalize">{apiKey.serviceName}</h4>
                          <p className="text-gray-400 text-sm">
                            {apiKey.apiKey.substring(0, 8)}...{apiKey.apiKey.substring(apiKey.apiKey.length - 4)}
                          </p>
                        </div>
                        <Badge className={apiKey.isActive === '1' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                          {apiKey.isActive === '1' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Models */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Available AI Models</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {models.map((model) => (
                    <Card key={model.id} className="bg-black/20 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{model.name}</h4>
                          {model.isFree && <Badge className="bg-green-500/20 text-green-300">Free</Badge>}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{model.provider}</p>
                        <p className="text-gray-500 text-xs">{model.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}