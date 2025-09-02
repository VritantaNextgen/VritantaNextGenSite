import { useState, useEffect, useRef } from 'react';
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
import { SimpleCard } from "./SimpleCard";

declare global {
  interface Window {
    VANTA: any;
  }
}

export function LandingPage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

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

  useEffect(() => {
    let vantaEffectInstance: any = null;
    if (vantaRef.current && window.VANTA) {
      vantaEffectInstance = window.VANTA.GLOBE({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff3f81,
        backgroundColor: 0x1e0038
      });
      setVantaEffect(vantaEffectInstance);
    }
    return () => {
      if (vantaEffectInstance) vantaEffectInstance.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen text-gray-800 relative">
      {/* Main content */}
      <div className="relative z-10">
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

        {/* Hero Section */}
        <main ref={vantaRef} className="relative pt-20 pb-8 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-blue-600 overflow-hidden flex items-center justify-center min-h-screen">
          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white animate-typewriter">
              Your Partner in Digital Transformation
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in animation-delay-200">
              We deliver cutting-edge solutions in Data Analytics, AI, and Automation, alongside top-tier freelance services to elevate your business.
            </p>
            <div className="flex justify-center gap-4 animate-fade-in animation-delay-400">
              <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-4 text-base font-bold" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                Our Services
              </Button>
              <Button size="lg" variant="outline" className="px-6 py-4 text-base font-bold border-gray-400 text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                View Projects <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </main>

        {/* Services Section */}
        <section id="services" className="py-8 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-600" data-aos="fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Our Services</h2>
              <p className="text-base text-gray-200 mt-2 max-w-2xl mx-auto">We offer a range of services to help your business grow and succeed in the digital age.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <div key={index} className="card-v2">
                  <div className="card-v2__img flex items-center justify-center">
                    <service.icon className="w-16 h-16 text-white" />
                  </div>
                  <div className="card-v2__descr-wrapper">
                    <p className="card-v2__title">
                      {service.title}
                    </p>
                    <p className="card-v2__descr">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-8 bg-white" data-aos="fade-up">
          <div className="about-us-container">
            <div className="about-us-contentLeft">
              <div className="row">
                  <div className="imgWrapper">
                      <img src="https://images.unsplash.com/photo-1687579521048-217e24217d53?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODg5ODcxNzl8&ixlib=rb-4.0.3&q=85" alt="" />
                  </div>
                  <div className="imgWrapper">
                      <img src="https://images.unsplash.com/photo-1686580546412-80e80519abd7?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODg5ODcyMDN8&ixlib=rb-4.0.3&q=85" alt="" />
                  </div>
                  <div className="imgWrapper">
                      <img src="https://images.unsplash.com/photo-1688133338995-a394ce7314e4?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODg5ODcyMDN8&ixlib=rb-4.0.3&q=85" alt="" />
                  </div>
                  <div className="imgWrapper">
                      <img src="https://images.unsplash.com/photo-1686354715732-7e4685269a25?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODg5ODcyNzN8&ixlib=rb-4.0.3&q=85" alt="" />
                  </div>
              </div>
            </div>
            <div className="about-us-contentRight">
              <div className="content">
                <h4>Welcome To</h4>
                <h2>About Us Title...</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex ullam saepe, totam dicta fuga provident. Fuga, labore porro? Dolorem unde, explicabo atque voluptatum laborum harum, quas velit voluptates sit rerum non ullam laboriosam iusto ad sequi hic soluta consequatur quaerat!</p>
                <a href="#">Read More...</a>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section id="team" className="py-8 bg-gray-100" data-aos="fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-extrabold">Our Team</h2>
              <p className="text-base text-gray-600 mt-2 max-w-2xl mx-auto">Meet the talented people behind our success.</p>
            </div>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {teamMembers.map((member, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <SimpleCard />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      </div>
    </div>
  );
}