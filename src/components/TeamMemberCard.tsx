import React from 'react';
import { Linkedin } from 'lucide-react';

interface TeamMemberCardProps {
  name: string;
  title: string;
  description: string;
  photoUrl: string;
  linkedinUrl: string;
}

export function TeamMemberCard({ name, title, description, photoUrl, linkedinUrl }: TeamMemberCardProps) {
  return (
    <div className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
      
      {/* Main card */}
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 overflow-hidden transform transition-all duration-500 group-hover:bg-white/15 group-hover:border-white/30 h-full">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0.5 bg-gray-900 rounded-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center h-full">
          {/* Photo with gradient border */}
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full p-1">
              <img 
                src={photoUrl} 
                alt={name}
                className="w-full h-full rounded-full object-cover border-2 border-gray-900"
              />
            </div>
            
            {/* Floating LinkedIn badge */}
            <a 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-300 shadow-lg"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Name and Title */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-500">
              {name}
            </h3>
            <p className="text-sm text-purple-300 font-medium">{title}</p>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm flex-grow mb-4 group-hover:text-gray-200 transition-colors duration-500">
            {description}
          </p>

          {/* Gradient divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent my-3 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Skills tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {title.split(' ').slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70 group-hover:bg-white/20 group-hover:text-white transition-all duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Hover effect lines */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Shadow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 -z-10"></div>
    </div>
  );
}
