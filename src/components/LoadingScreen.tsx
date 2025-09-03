import React, { useState, useEffect, useRef } from 'react';

const LoadingScreen = ({ onLoaded }: { onLoaded: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + Math.random() * 3 + 1; // Smooth random progression
        }
        clearInterval(interval);
        return 100;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onLoaded();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, onLoaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const createParticles = () => {
      particles = [];
      const colors = [
        'rgba(139, 92, 246, 0.6)', // purple
        'rgba(59, 130, 246, 0.6)', // blue
        'rgba(168, 85, 247, 0.6)', // violet
        'rgba(99, 102, 241, 0.6)', // indigo
      ];

      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.9)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 z-50 flex items-center justify-center overflow-hidden">
      {/* Canvas background with particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-indigo-500 rounded-full blur-2xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Animated logo with glow effect */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30 transform hover:scale-110 transition-transform duration-500 group">
            <span className="text-white text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              MS
            </span>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl opacity-70 blur-xl group-hover:opacity-90 transition-opacity duration-500"></div>
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute -top-3 -left-3 w-5 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-orbit-1 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-orbit-2 shadow-lg shadow-blue-400/50"></div>
          <div className="absolute -top-3 -right-3 w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-orbit-3 shadow-lg shadow-indigo-400/50"></div>
        </div>

        {/* Progress bar with advanced styling */}
        <div className="w-96 max-w-full">
          <div className="relative">
            {/* Background track */}
            <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              {/* Main progress fill */}
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
              </div>
            </div>
            
            {/* Progress percentage with floating animation */}
            <div className="absolute -top-8 right-0">
              <span className="text-white text-sm font-semibold bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 animate-float">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Loading text with advanced animations */}
        <div className="text-center space-y-4">
          <h2 className="text-white text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-fade-in">
            ModularSaaS Platform
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <p className="text-gray-300 text-sm font-medium animate-typing">
              Loading your workspace
            </p>
          </div>
        </div>

        {/* Animated dots with different colors */}
        <div className="flex space-x-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full animate-bounce ${
                i === 0 ? 'bg-purple-400' : 
                i === 1 ? 'bg-blue-400' : 
                'bg-indigo-400'
              }`}
              style={{ 
                animationDelay: `${i * 200}ms`,
                boxShadow: `0 0 10px ${i === 0 ? 'rgba(139, 92, 246, 0.5)' : i === 1 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(99, 102, 241, 0.5)'}`
              }}
            ></div>
          ))}
        </div>

        {/* Subtle copyright text */}
        <p className="text-gray-500 text-xs absolute bottom-4 opacity-70">
          Loading your next-generation SaaS experience
        </p>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes orbit-1 {
          0% { transform: rotate(0deg) translateX(25px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(25px) rotate(-360deg); }
        }
        @keyframes orbit-2 {
          0% { transform: rotate(45deg) translateX(20px) rotate(-45deg); }
          100% { transform: rotate(405deg) translateX(20px) rotate(-405deg); }
        }
        @keyframes orbit-3 {
          0% { transform: rotate(90deg) translateX(18px) rotate(-90deg); }
          100% { transform: rotate(450deg) translateX(18px) rotate(-450deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes typing {
          0% { opacity: 0; transform: translateY(10px); }
          50% { opacity: 1; transform: translateY(0px); }
          100% { opacity: 0.7; transform: translateY(-5px); }
        }
        .animate-orbit-1 {
          animation: orbit-1 4s linear infinite;
        }
        .animate-orbit-2 {
          animation: orbit-2 3s linear infinite reverse;
        }
        .animate-orbit-3 {
          animation: orbit-3 5s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        .animate-typing {
          animation: typing 1.5s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
