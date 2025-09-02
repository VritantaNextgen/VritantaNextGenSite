import React from 'react';
import { BarChart3, Bot, BrainCircuit, Globe, Mail, Users, Folder, Info } from 'lucide-react';

interface XpIconProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

const XpIcon: React.FC<XpIconProps> = ({ icon: Icon, label, onClick }) => (
  <div 
    className="flex flex-col items-center justify-center p-4 space-y-2 cursor-pointer hover:bg-blue-700 hover:bg-opacity-50 rounded-lg transition-colors"
    onClick={onClick}
  >
    <Icon className="w-10 h-10 text-white" />
    <span className="text-white text-sm text-center">{label}</span>
  </div>
);

export function XpWindow() {
  const handleIconClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full max-w-xl mx-auto bg-gray-800 border-2 border-gray-600 rounded-lg shadow-2xl overflow-hidden">
      {/* Title Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 py-2 rounded-t-lg">
        <span className="font-bold">Vritanta OS</span>
        <div className="flex space-x-1">
          <button className="w-4 h-4 bg-red-500 rounded-full"></button>
          <button className="w-4 h-4 bg-yellow-500 rounded-full"></button>
          <button className="w-4 h-4 bg-green-500 rounded-full"></button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 grid grid-cols-3 gap-4 bg-gradient-to-br from-gray-700 to-gray-800">
        <XpIcon icon={Info} label="About Us" onClick={() => handleIconClick('about')} />
        <XpIcon icon={BarChart3} label="Services" onClick={() => handleIconClick('services')} />
        <XpIcon icon={Folder} label="Portfolio" onClick={() => handleIconClick('projects')} />
        <XpIcon icon={Globe} label="Blog" onClick={() => handleIconClick('blog')} />
        <XpIcon icon={Mail} label="Contact" onClick={() => handleIconClick('contact')} />
        <XpIcon icon={Users} label="Client Login" onClick={() => handleIconClick('login')} />
      </div>
    </div>
  );
}
