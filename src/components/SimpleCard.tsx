import React from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags?: string[];
  gradient?: string;
}

export function SimpleCard({ 
  title, 
  description, 
  tags = [], 
  gradient = "from-purple-500 via-pink-500 to-blue-500"
}: ProjectCardProps) {
  return (
    <div className="card hover:scale-105 transition-transform duration-300">
      {/* Icon with subtle gradient */}
      <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center mb-4`}>
        <div className="w-6 h-6 bg-white rounded opacity-80"></div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4">
        {description}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Project data for demonstration
export const projectData = [
  {
    title: "AI Analytics Dashboard",
    description: "Real-time data visualization with machine learning insights.",
    tags: ["React", "AI", "DataViz"],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "E-Commerce Automation",
    description: "Automated inventory management and customer service AI.",
    tags: ["Automation", "AI", "E-commerce"],
    gradient: "from-green-500 to-blue-500"
  },
  {
    title: "Smart Marketing Platform",
    description: "AI-powered marketing automation with personalized journeys.",
    tags: ["Marketing", "AI", "Automation"],
    gradient: "from-orange-500 to-red-500"
  },
  {
    title: "RPA Workflow System",
    description: "Robotic process automation for business optimization.",
    tags: ["RPA", "Automation", "Workflow"],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Customer Intelligence",
    description: "Advanced customer analytics and behavior prediction.",
    tags: ["Analytics", "AI", "Customer"],
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    title: "Supply Chain AI",
    description: "Intelligent supply chain management with predictive logistics.",
    tags: ["AI", "Logistics", "Supply"],
    gradient: "from-teal-500 to-indigo-500"
  }
];
