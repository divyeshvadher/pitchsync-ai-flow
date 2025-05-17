
import React from "react";

const Web3Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      {/* Animated orbs/blobs */}
      <div className="orb w-[500px] h-[500px] -top-[100px] -left-[100px] bg-neon-purple/30"></div>
      <div className="orb w-[600px] h-[600px] -bottom-[200px] -right-[100px] bg-neon-blue/20 animation-delay-2000"></div>
      <div className="orb w-[400px] h-[400px] bottom-[10%] left-[20%] bg-neon-cyan/20 animation-delay-4000"></div>
      
      {/* Vector wave at bottom */}
      <svg className="absolute bottom-0 left-0 w-full opacity-10 wave" 
        viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="none">
        <path 
          fill="currentColor" 
          className="text-neon-purple" 
          d="M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,181.3C672,171,768,181,864,192C960,203,1056,213,1152,192C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>
      </svg>
    </div>
  );
};

export default Web3Background;
