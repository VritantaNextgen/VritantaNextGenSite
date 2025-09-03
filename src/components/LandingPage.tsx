import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, BarChart3, Bot, BrainCircuit, Megaphone, Sparkles } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { SimpleCard, projectData } from "./SimpleCard";
import { TeamMemberCard } from "./TeamMemberCard";
import { HeroSection } from "./HeroSection";
import LoadingScreen from './LoadingScreen';

export function LandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleLoaded = () => {
    setLoading(false);
  };

  const services = [
    { icon: BarChart3, title: "Data Analytics", description: "We turn complex data into actionable insights. Our analytics services help you understand market trends, customer behavior, and optimize your business strategy for maximum growth." },
    { icon: Bot, title: "Intelligent RPA", description: "Automate your repetitive and manual tasks with our Intelligent Robotic Process Automation. We build custom bots to streamline your operations, reduce errors, and free up your team for more valuable work." },
    { icon: BrainCircuit, title: "Smart AI Agents", description: "Leverage the power of custom AI agents to handle complex automations, provide intelligent customer support, and perform tasks that require reasoning and learning." },
    { icon: Megaphone, title: "AI-Driven Marketing", description: "Supercharge your marketing campaigns with AI. We provide solutions for targeted advertising, content personalization, and customer segmentation to boost your reach and ROI." }
  ];

  const teamMembers = [
    { name: "John Doe", title: "Fullstack Dev & UX/UI", description: "John is a passionate developer with a keen eye for design.", photoUrl: "https://i.pravatar.cc/150?img=1", linkedinUrl: "#" },
    { name: "Jane Smith", title: "Data Scientist", description: "Jane turns data into stories and insights.", photoUrl: "https://i.pravatar.cc/150?img=2", linkedinUrl: "#" },
    { name: "Peter Jones", title: "AI Specialist", description: "Peter is our resident AI guru, always exploring new frontiers.", photoUrl: "https://i.pravatar.cc/150?img=3", linkedinUrl: "#" },
    { name: "Mary Williams", title: "Marketing Expert", description: "Mary knows how to make our clients shine.", photoUrl: "https://i.pravatar.cc/150?img=4", linkedinUrl: "#" },
    { name: "David Brown", title: "RPA Engineer", description: "David automates the world, one bot at a time.", photoUrl: "https://i.pravatar.cc/150?img=5", linkedinUrl: "#" },
    { name: "Susan Davis", title: "Project Manager", description: "Susan keeps everything on track and on time.", photoUrl: "https://i.pravatar.cc/150?img=6", linkedinUrl: "#" },
    { name: "Michael Miller", title: "Business Analyst", description: "Michael bridges the gap between business and technology.", photoUrl: "https://i.pravatar.cc/150?img=7", linkedinUrl: "#" },
  ];

  return (
    <div className="min-h-screen text-gray-800 relative">
      {loading && <LoadingScreen onLoaded={handleLoaded} />}
      {/* Main content */}
      <div className={`relative z-10 transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-24">
              <div className="flex-shrink-0">
                <a href="#" className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                </a>
              </div>

              {/* Notch Menu */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className="hidden md:flex items-center space-x-2 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full shadow-lg px-4 py-2">
                  <a href="#about" className="px-4 py-2 text-gray-600 hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white rounded-full transition-all duration-300">About</a>
                  <a href="#services" className="px-4 py-2 text-gray-600 hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white rounded-full transition-all duration-300">Services</a>
                  <a href="#team" className="px-4 py-2 text-gray-600 hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white rounded-full transition-all duration-300">Team</a>
                  <a href="/blog" className="px-4 py-2 text-gray-600 hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white rounded-full transition-all duration-300">Blog</a>
                  <a href="#contact" className="px-4 py-2 text-gray-600 hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white rounded-full transition-all duration-300">Contact</a>
                </div>
              </div>

              {/* Right side buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" className="text-gray-600 hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white rounded-full transition-all duration-300" onClick={() => navigate('/login')}>Client Login</Button>
                <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => navigate('/register')}>Get Started</Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section with Image Trail Effect */}
        <HeroSection />

        {/* Gradient Connector */}
        <div className="section-connector"></div>

        {/* Services Section - CodePen Inspired */}
        <section id="services" className="services-bg" data-aos="fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 py-3 rounded-full mb-6">
                <span className="text-purple-300 text-lg font-semibold">Our Expertise</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-4">
                Premium Services
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We deliver cutting-edge solutions that transform businesses through innovation and technology excellence.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => {
                const ServiceIcon = service.icon;
                return (
                  <div key={index} className="service-card group">
                    {/* Service Icon */}
                    <div className="service-icon">
                      <ServiceIcon className="w-8 h-8 text-white" />
                    </div>

                    {/* Service Title */}
                    <h3 className="service-title">
                      {service.title}
                    </h3>

                    {/* Service Description */}
                    <p className="service-description">
                      {service.description}
                    </p>

                    {/* Learn More Link */}
                    <a href="#" className="service-learn-more">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  </div>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="text-center mt-20">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Let's discuss how our services can drive growth and innovation for your organization.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="btn-main px-8 py-3 text-lg font-bold">
                    Get Started
                  </button>
                  <button className="btn-secondary px-8 py-3 text-lg font-bold">
                    View All Services
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient Connector */}
        <div className="section-connector"></div>

        {/* Projects Section */}
        <section id="projects" className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900" data-aos="fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover our innovative solutions that transform businesses through cutting-edge technology and creative design.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectData.map((project, index) => (
                <SimpleCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  gradient={project.gradient}
                  onClick={() => console.log(`Clicked on ${project.title}`)}
                />
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Start Your Project?
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Let's collaborate to create something extraordinary. Our team is ready to bring your vision to life.
                </p>
                <button className="btn-main px-8 py-3 text-lg font-bold">
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient Connector */}
        <div className="section-connector"></div>

        {/* About Us Section - Enhanced */}
        <section id="about" data-aos="fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image Gallery with Modern Layout */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1687579521048-217e24217d53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODg5ODcxNzl8&ixlib=rb-4.0.3&q=80&w=400" 
                      alt="Innovation" 
                      className="w-full h-64 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl group-hover:opacity-0 transition-opacity duration-500"></div>
                  </div>
                  <div className="relative group mt-8">
                    <img 
                      src="https://images.unsplash.com/photo-1686580546412-80e80519abd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODg5ODcyMDN8&ixlib=rb-4.0.3&q=80&w=400" 
                      alt="Collaboration" 
                      className="w-full h-64 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl group-hover:opacity-0 transition-opacity duration-500"></div>
                  </div>
                  <div className="relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1688133338995-a394ce7314e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODg5ODcyMDN8&ixlib=rb-4.0.3&q=80&w=400" 
                      alt="Technology" 
                      className="w-full h-64 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl group-hover:opacity-0 transition-opacity duration-500"></div>
                  </div>
                  <div className="relative group mt-8">
                    <img 
                      src="https://images.unsplash.com/photo-1686354715732-7e4685269a25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODg5ODcyNzN8&ixlib=rb-4.0.3&q=80&w=400" 
                      alt="Success" 
                      className="w-full h-64 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-green-500/20 rounded-2xl group-hover:opacity-0 transition-opacity duration-500"></div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500 rounded-full opacity-60 blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-500 rounded-full opacity-40 blur-xl"></div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-4 py-2 rounded-full">
                  <span className="text-purple-300 text-sm font-semibold">Welcome To</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                  Innovation Meets Excellence
                </h2>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  At ModularSaaS, we're not just building software – we're crafting digital experiences that transform businesses. 
                  Our team of passionate experts combines cutting-edge technology with creative vision to deliver solutions 
                  that drive real results.
                </p>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  With years of experience in AI, automation, and data analytics, we've helped countless businesses 
                  unlock their full potential. Our mission is to make advanced technology accessible and impactful 
                  for organizations of all sizes.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-300 mb-2">50+</div>
                    <div className="text-gray-400">Successful Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-300 mb-2">100%</div>
                    <div className="text-gray-400">Client Satisfaction</div>
                  </div>
                </div>

                <button className="btn-main mt-8">
                  Discover Our Story
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient Connector */}
        <div className="section-connector"></div>

        {/* Our Team Section - Enhanced */}
        <section id="team" data-aos="fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-4">
                Our Dream Team
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Meet the brilliant minds and passionate experts driving innovation and excellence in every project.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMemberCard
                  key={index}
                  name={member.name}
                  title={member.title}
                  description={member.description}
                  photoUrl={member.photoUrl}
                  linkedinUrl={member.linkedinUrl}
                />
              ))}
            </div>

            {/* Team CTA */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Join Our Growing Team
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  We're always looking for talented individuals who are passionate about innovation and excellence.
                </p>
                <button className="btn-main px-8 py-3 text-lg font-bold">
                  View Open Positions
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
