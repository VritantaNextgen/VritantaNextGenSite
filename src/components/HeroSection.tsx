import { Button } from './ui/button';
import { Play } from 'lucide-react';

export function HeroSection() {
  return (
    <main className="relative overflow-hidden min-h-screen flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/2 w-64 h-64 bg-pink-500/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
      </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* Enhanced Badge with improved animation */}
          <div className="inline-flex items-center bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20 animate-pulse">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></div>
            <span className="text-sm text-white/90 font-medium">Now available in public beta</span>
          </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Your Partner in
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Digital Transformation
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          We deliver cutting-edge solutions in Data Analytics, AI, and Automation, 
          alongside top-tier freelance services to elevate your business to new heights.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="btn-main px-8 py-4 text-lg font-bold group"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Free Trial
            <div className="ml-2 w-5 h-5 bg-white/20 rounded group-hover:bg-white/40 transition-all duration-300"></div>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="btn-secondary px-8 py-4 text-lg font-bold group"
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>

        {/* Stats with enhanced design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { number: '50+', label: 'Happy Clients', color: 'from-purple-400 to-pink-400' },
            { number: '100+', label: 'Projects', color: 'from-blue-400 to-cyan-400' },
            { number: '24/7', label: 'Support', color: 'from-green-400 to-emerald-400' },
            { number: '99.9%', label: 'Uptime', color: 'from-orange-400 to-red-400' }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.number}
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors duration-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Trusted by section */}
        <div className="mb-16">
          <p className="text-gray-400 mb-6 text-lg">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap justify-center gap-6 opacity-70">
            {['Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook', 'Netflix'].map((company, index) => (
              <div key={index} className="w-28 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-300">
                <span className="text-white/80 text-sm font-medium">{company}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Widgets */}
        <div className="absolute left-10 top-1/4 transform -translate-y-1/2">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          </div>
        </div>

        <div className="absolute right-12 top-1/3 transform -translate-y-1/2">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
            <div className="w-6 h-6 bg-white/20 rounded"></div>
          </div>
        </div>

        <div className="absolute left-16 bottom-1/4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float" style={{ animationDelay: '3s' }}>
            <div className="w-4 h-4 bg-white/20 rounded-full"></div>
          </div>
        </div>

        <div className="absolute right-16 bottom-1/3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float" style={{ animationDelay: '4s' }}>
            <div className="w-3 h-3 bg-white/20 rounded"></div>
          </div>
        </div>

        {/* Removed scroll indicator */}
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-20 w-8 h-8 bg-purple-400/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-40 left-32 w-6 h-6 bg-blue-400/40 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-40 left-40 w-4 h-4 bg-pink-400/50 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
    </main>
  );
}
