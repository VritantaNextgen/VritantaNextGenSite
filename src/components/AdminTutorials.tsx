import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { 
  Play, 
  BookOpen, 
  Video, 
  FileText, 
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  Users,
  Settings,
  Brain,
  Workflow,
  Globe,
  HelpCircle,
  ExternalLink
} from 'lucide-react'

interface Tutorial {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  type: 'video' | 'article' | 'interactive'
  completed?: boolean
  steps?: TutorialStep[]
}

interface TutorialStep {
  id: string
  title: string
  description: string
  action?: string
  tip?: string
}

const tutorials: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Developer Workspace',
    description: 'Learn the basics of navigating and using your admin interface',
    category: 'Basics',
    difficulty: 'beginner',
    duration: '10 min',
    type: 'interactive',
    steps: [
      {
        id: 'step-1',
        title: 'Welcome to Your Developer Workspace',
        description: 'Your Developer Workspace is a powerful admin interface that gives you complete control over your platform. Let\'s explore the main areas.',
        tip: 'Take your time to familiarize yourself with the layout - it\'s designed for efficiency.'
      },
      {
        id: 'step-2',
        title: 'Navigation Sidebar',
        description: 'The left sidebar contains all your main tools: Dashboard, Tool Builder, Workflows, AI Agents, User Management, and Settings.',
        action: 'Click on each menu item to explore different sections',
        tip: 'Each section has its own specialized interface optimized for that task.'
      },
      {
        id: 'step-3',
        title: 'Dashboard Overview',
        description: 'Your dashboard shows recent projects, system status, and quick actions. This is your command center.',
        tip: 'Bookmark important projects for quick access from the dashboard.'
      },
      {
        id: 'step-4',
        title: 'Real-time Collaboration',
        description: 'Your workspace supports real-time collaboration. You can see other admins online and their activities.',
        tip: 'Look for the online indicator in the top-right corner to see who else is working.'
      }
    ]
  },
  {
    id: 'tool-builder-guide',
    title: 'Building Your First Tool',
    description: 'Create custom tools using the drag-and-drop tool builder',
    category: 'Tool Building',
    difficulty: 'beginner',
    duration: '15 min',
    type: 'interactive',
    steps: [
      {
        id: 'tool-step-1',
        title: 'Understanding the Tool Builder',
        description: 'The Tool Builder lets you create custom functionality without coding. You can drag tools between workspaces to configure access.',
        tip: 'Start with simple tools and gradually add complexity as you learn.'
      },
      {
        id: 'tool-step-2',
        title: 'Tool Marketplace',
        description: 'The marketplace contains pre-built tools you can use. Drag them to Customer Workspace or Admin Workspace to make them available.',
        action: 'Try dragging a tool from the marketplace to the Customer Workspace',
        tip: 'Tools in Customer Workspace are visible to all customers, while Admin Workspace tools are admin-only.'
      },
      {
        id: 'tool-step-3',
        title: 'Creating Custom Tools',
        description: 'Click "Create Tool" to build your own custom tool. You can define its functionality, appearance, and behavior.',
        action: 'Create a new tool and configure its basic settings',
        tip: 'Give your tools descriptive names and clear descriptions for better organization.'
      }
    ]
  },
  {
    id: 'workflow-automation',
    title: 'Workflow Automation Mastery',
    description: 'Build powerful automation workflows with triggers, actions, and conditions',
    category: 'Automation',
    difficulty: 'intermediate',
    duration: '25 min',
    type: 'interactive',
    steps: [
      {
        id: 'workflow-step-1',
        title: 'Workflow Fundamentals',
        description: 'Workflows consist of three main components: Triggers (what starts the workflow), Actions (what happens), and Conditions (decision points).',
        tip: 'Think of workflows as "if this, then that" logic chains.'
      },
      {
        id: 'workflow-step-2',
        title: 'Creating Your First Workflow',
        description: 'Start with a simple workflow: when a new user signs up, send them a welcome email.',
        action: 'Create a new workflow and add a trigger',
        tip: 'Always test your workflows with sample data before activating them.'
      },
      {
        id: 'workflow-step-3',
        title: 'Advanced Workflow Patterns',
        description: 'Learn about conditional logic, loops, and error handling in workflows.',
        tip: 'Use conditions to create branching logic and handle different scenarios.'
      }
    ]
  },
  {
    id: 'ai-agent-creation',
    title: 'AI Agent Development',
    description: 'Create intelligent AI agents with custom personalities and capabilities',
    category: 'AI',
    difficulty: 'intermediate',
    duration: '20 min',
    type: 'interactive',
    steps: [
      {
        id: 'ai-step-1',
        title: 'AI Agent Basics',
        description: 'AI agents are intelligent assistants that can understand natural language and perform tasks. They can be customized for specific roles.',
        tip: 'Start with a clear purpose for your agent - what specific problem should it solve?'
      },
      {
        id: 'ai-step-2',
        title: 'Configuring Agent Personality',
        description: 'The system prompt defines your agent\'s personality, knowledge, and behavior. Be specific about how it should respond.',
        action: 'Create an agent and write a detailed system prompt',
        tip: 'Include examples of good responses in your system prompt for better results.'
      },
      {
        id: 'ai-step-3',
        title: 'Testing and Refinement',
        description: 'Use the test panel to interact with your agent and refine its responses.',
        action: 'Test your agent with various inputs and adjust the system prompt',
        tip: 'Test edge cases and unusual inputs to make your agent more robust.'
      }
    ]
  },
  {
    id: 'blog-management',
    title: 'Blog Management & Real-time Updates',
    description: 'Master the blog system with real-time collaboration features',
    category: 'Content',
    difficulty: 'beginner',
    duration: '12 min',
    type: 'interactive',
    steps: [
      {
        id: 'blog-step-1',
        title: 'Blog Manager Overview',
        description: 'The Blog Manager allows you to create, edit, and publish blog posts with real-time collaboration.',
        tip: 'Changes you make are instantly visible to other admins working on the same content.'
      },
      {
        id: 'blog-step-2',
        title: 'Creating and Publishing Posts',
        description: 'Create new posts, edit content, and publish them instantly. All changes are synchronized in real-time.',
        action: 'Create a new blog post and publish it',
        tip: 'Use the excerpt field for better SEO and social media sharing.'
      },
      {
        id: 'blog-step-3',
        title: 'SEO Optimization',
        description: 'Configure SEO settings including meta titles, descriptions, and featured images for better search visibility.',
        tip: 'Keep SEO titles under 60 characters and descriptions under 160 characters.'
      }
    ]
  },
  {
    id: 'user-management',
    title: 'User Management & Permissions',
    description: 'Manage users, roles, and permissions effectively',
    category: 'Administration',
    difficulty: 'intermediate',
    duration: '18 min',
    type: 'interactive',
    steps: [
      {
        id: 'user-step-1',
        title: 'Understanding User Roles',
        description: 'There are three user roles: Customer (basic access), Admin (full workspace access), and SuperAdmin (user management + all admin features).',
        tip: 'Only SuperAdmins can change user roles and manage other administrators.'
      },
      {
        id: 'user-step-2',
        title: 'Role-Based Access Control',
        description: 'Different roles see different interfaces. Customers get a streamlined dashboard, while admins get the full developer workspace.',
        tip: 'Company email addresses are automatically promoted to SuperAdmin status.'
      },
      {
        id: 'user-step-3',
        title: 'Managing User Permissions',
        description: 'SuperAdmins can promote customers to admin status and manage access to different tools and features.',
        action: 'Practice changing user roles (if you have SuperAdmin access)',
        tip: 'Be careful when granting admin access - it gives users significant control over the platform.'
      }
    ]
  }
]

const categories = ['All', 'Basics', 'Tool Building', 'Automation', 'AI', 'Content', 'Administration']

export function AdminTutorials() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(new Set())

  const filteredTutorials = tutorials.filter(tutorial => 
    selectedCategory === 'All' || tutorial.category === selectedCategory
  )

  const handleStartTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial)
    setCurrentStep(0)
  }

  const handleNextStep = () => {
    if (selectedTutorial && currentStep < (selectedTutorial.steps?.length || 0) - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Tutorial completed
      if (selectedTutorial) {
        setCompletedTutorials(prev => new Set([...prev, selectedTutorial.id]))
      }
      setSelectedTutorial(null)
      setCurrentStep(0)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300'
      case 'advanced': return 'bg-red-500/20 text-red-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video
      case 'article': return FileText
      case 'interactive': return Play
      default: return BookOpen
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Tutorials</h1>
              <p className="text-gray-300">Master your Developer Workspace with step-by-step guides</p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-white">{completedTutorials.size}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Tutorials</p>
                    <p className="text-2xl font-bold text-white">{tutorials.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Progress</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round((completedTutorials.size / tutorials.length) * 100)}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Skill Level</p>
                    <p className="text-2xl font-bold text-white">
                      {completedTutorials.size < 2 ? 'Beginner' : 
                       completedTutorials.size < 4 ? 'Intermediate' : 'Advanced'}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'border-white/20 text-white hover:bg-white/10'
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map(tutorial => {
            const TypeIcon = getTypeIcon(tutorial.type)
            const isCompleted = completedTutorials.has(tutorial.id)
            
            return (
              <Card 
                key={tutorial.id} 
                className="bg-black/40 border-white/10 backdrop-blur-sm hover:bg-black/60 transition-all group cursor-pointer"
                onClick={() => handleStartTutorial(tutorial)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg group-hover:text-purple-200 transition-colors">
                          {tutorial.title}
                        </CardTitle>
                        <p className="text-gray-400 text-sm">{tutorial.category}</p>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {tutorial.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>
                        {tutorial.difficulty}
                      </Badge>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {tutorial.duration}
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white group-hover:shadow-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartTutorial(tutorial)
                    }}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Review Tutorial
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Tutorial
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tutorial Modal */}
        {selectedTutorial && (
          <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
            <DialogContent className="max-w-4xl bg-black/90 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white mb-2">
                  {selectedTutorial.title}
                </DialogTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <Badge className={getDifficultyColor(selectedTutorial.difficulty)}>
                    {selectedTutorial.difficulty}
                  </Badge>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedTutorial.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Step {currentStep + 1} of {selectedTutorial.steps?.length || 0}
                  </div>
                </div>
              </DialogHeader>

              {selectedTutorial.steps && selectedTutorial.steps[currentStep] && (
                <div className="py-6">
                  <div className="mb-6">
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / (selectedTutorial.steps?.length || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {selectedTutorial.steps[currentStep].title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {selectedTutorial.steps[currentStep].description}
                      </p>
                    </div>

                    {selectedTutorial.steps[currentStep].action && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-300 mb-1">Action Required</h4>
                            <p className="text-blue-200 text-sm">
                              {selectedTutorial.steps[currentStep].action}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedTutorial.steps[currentStep].tip && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-300 mb-1">Pro Tip</h4>
                            <p className="text-yellow-200 text-sm">
                              {selectedTutorial.steps[currentStep].tip}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-8">
                    <Button 
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={currentStep === 0}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Previous
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">
                        Step {currentStep + 1} of {selectedTutorial.steps?.length || 0}
                      </p>
                    </div>

                    <Button 
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {currentStep === (selectedTutorial.steps?.length || 0) - 1 ? (
                        <>
                          Complete Tutorial
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Next Step
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Quick Help Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Need More Help?</h3>
                  <p className="text-gray-300 mb-4">
                    Can't find what you're looking for? Our support team is here to help you succeed.
                  </p>
                  <div className="flex space-x-4">
                    <Button 
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Documentation
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}