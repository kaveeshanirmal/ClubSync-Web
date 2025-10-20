"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface BeautifulLoaderProps {
  message?: string;
  subMessage?: string;
  type?: "modern" | "pulse" | "dots" | "minimal" | "waves" | "orbit" | "morphing" | "particles" | "quantum" | "galaxy";
}

export default function BeautifulLoader({ 
  message = "Loading...", 
  subMessage = "Please wait a moment",
  type = "modern" 
}: BeautifulLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  if (type === "minimal") {
    return (
      <div className="flex items-center justify-center space-x-3">
        <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
        <span className="text-gray-600 font-medium text-sm">{message}</span>
      </div>
    );
  }

  if (type === "dots") {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="flex space-x-1 mb-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          ))}
        </div>
        <p className="text-gray-600 text-sm font-medium">{message}</p>
        {subMessage && (
          <p className="text-gray-400 text-xs mt-1">{subMessage}</p>
        )}
      </div>
    );
  }

  if (type === "pulse") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-orange-200 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{message}</h3>
            <p className="text-gray-500 text-sm">{subMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "waves") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex space-x-1 mb-6">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                style={{
                  height: `${20 + Math.sin((Date.now() / 200) + index) * 10}px`,
                  animation: `waveAnimation 1.5s ease-in-out ${index * 0.1}s infinite`,
                }}
              ></div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-medium">{message}</p>
            <p className="text-gray-500 text-sm mt-1">{subMessage}</p>
          </div>
        </div>
        <style jsx>{`
          @keyframes waveAnimation {
            0%, 100% { height: 20px; opacity: 0.4; }
            50% { height: 40px; opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (type === "orbit") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-8">
            {/* Central core */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            
            {/* Orbiting elements */}
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="absolute inset-0 animate-spin"
                style={{
                  animationDelay: `${index * 0.7}s`,
                  animationDuration: `${2 + index * 0.5}s`,
                }}
              >
                <div
                  className="absolute w-3 h-3 bg-gradient-to-r from-pink-400 to-red-400 rounded-full shadow-lg"
                  style={{
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                ></div>
              </div>
            ))}
            
            {/* Outer rings */}
            <div className="absolute inset-2 border border-purple-200 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-6 border border-indigo-200 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{message}</h3>
            <p className="text-gray-500 text-sm">{subMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "morphing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-8 w-20 h-20">
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg shadow-2xl"
                 style={{ 
                   animation: 'morphShape 2s ease-in-out infinite',
                 }}
            ></div>
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-red-400 to-orange-500 rounded-full opacity-60"
                 style={{ 
                   animation: 'morphShape2 2s ease-in-out infinite reverse',
                 }}
            ></div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{message}</h3>
            <p className="text-gray-500 text-sm">{subMessage}</p>
            <div className="mt-4 flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes morphShape {
            0%, 100% { 
              border-radius: 20%; 
              transform: rotate(0deg) scale(1); 
            }
            25% { 
              border-radius: 50%; 
              transform: rotate(90deg) scale(0.8); 
            }
            50% { 
              border-radius: 30%; 
              transform: rotate(180deg) scale(1.1); 
            }
            75% { 
              border-radius: 40%; 
              transform: rotate(270deg) scale(0.9); 
            }
          }
          @keyframes morphShape2 {
            0%, 100% { 
              border-radius: 50%; 
              transform: rotate(0deg) scale(0.6); 
              opacity: 0.6;
            }
            50% { 
              border-radius: 20%; 
              transform: rotate(180deg) scale(0.8); 
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    );
  }

  if (type === "particles") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 pt-16 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center relative">
          <div className="relative mb-8">
            {/* Central energy core */}
            <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse shadow-2xl"></div>
            
            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `
                    translate(-50%, -50%) 
                    rotate(${i * 30}deg) 
                    translateX(${40 + (i % 3) * 20}px)
                  `,
                  animation: `particleFloat 3s ease-in-out ${i * 0.2}s infinite, particleGlow 2s ease-in-out ${i * 0.1}s infinite alternate`,
                }}
              ></div>
            ))}
            
            {/* Energy rings */}
            <div className="absolute inset-0 border-2 border-violet-300 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-4 border border-fuchsia-300 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="text-center z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{message}</h3>
            <p className="text-gray-500 text-sm">{subMessage}</p>
          </div>
        </div>
        <style jsx>{`
          @keyframes particleFloat {
            0%, 100% { 
              transform: translate(-50%, -50%) rotate(0deg) translateX(40px) scale(1);
              opacity: 0.8;
            }
            50% { 
              transform: translate(-50%, -50%) rotate(180deg) translateX(80px) scale(1.5);
              opacity: 1;
            }
          }
          @keyframes particleGlow {
            0% { box-shadow: 0 0 5px rgba(139, 92, 246, 0.5); }
            100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(236, 72, 153, 0.3); }
          }
        `}</style>
      </div>
    );
  }

  if (type === "quantum") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 pt-16 flex items-center justify-center relative overflow-hidden">
        {/* Background quantum field */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `quantumFlicker ${1 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
              }}
            ></div>
          ))}
        </div>
        
        <div className="flex flex-col items-center justify-center relative z-10">
          <div className="relative mb-8">
            {/* Quantum cube */}
            <div className="w-20 h-20 relative">
              <div 
                className="absolute inset-0 border-2 border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
                style={{
                  transform: 'rotateX(45deg) rotateY(45deg)',
                  animation: 'quantumRotate 4s linear infinite',
                }}
              ></div>
              <div 
                className="absolute inset-2 border border-purple-400 bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                style={{
                  transform: 'rotateX(-45deg) rotateY(-45deg)',
                  animation: 'quantumRotate 3s linear infinite reverse',
                }}
              ></div>
              <div 
                className="absolute inset-4 border border-pink-400 bg-gradient-to-br from-pink-500/20 to-cyan-500/20"
                style={{
                  transform: 'rotateX(90deg) rotateY(0deg)',
                  animation: 'quantumPulse 2s ease-in-out infinite',
                }}
              ></div>
            </div>
            
            {/* Energy lines */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                  animation: `energyPulse 2s ease-in-out ${i * 0.5}s infinite`,
                }}
              ></div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-1">{message}</h3>
            <p className="text-cyan-200 text-sm">{subMessage}</p>
            <div className="mt-4 text-xs text-cyan-300 font-mono">
              QUANTUM_STATE: {Math.floor(progress)}%
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes quantumRotate {
            from { transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg); }
            to { transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg); }
          }
          @keyframes quantumPulse {
            0%, 100% { 
              transform: rotateX(90deg) rotateY(0deg) scale(1);
              opacity: 0.8;
            }
            50% { 
              transform: rotateX(90deg) rotateY(180deg) scale(1.2);
              opacity: 1;
            }
          }
          @keyframes quantumFlicker {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.8; }
          }
          @keyframes energyPulse {
            0%, 100% { 
              opacity: 0.3; 
              transform: translate(-50%, -50%) rotate(var(--rotation)) scaleX(1);
            }
            50% { 
              opacity: 1; 
              transform: translate(-50%, -50%) rotate(var(--rotation)) scaleX(1.5);
            }
          }
        `}</style>
      </div>
    );
  }

  if (type === "galaxy") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-16 flex items-center justify-center relative overflow-hidden">
        {/* Stars background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
              }}
            ></div>
          ))}
        </div>
        
        <div className="flex flex-col items-center justify-center relative z-10">
          <div className="relative mb-8">
            {/* Galaxy spiral */}
            <div className="w-32 h-32 relative">
              {/* Central black hole */}
              <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-black rounded-full border-2 border-white shadow-2xl transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
              
              {/* Spiral arms */}
              {[0, 1, 2].map((arm) => (
                <div key={arm} className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: `linear-gradient(45deg, 
                          ${['#8B5CF6', '#EC4899', '#F59E0B'][arm]}, 
                          ${['#A78BFA', '#F472B6', '#FBBF24'][arm]}
                        )`,
                        top: '50%',
                        left: '50%',
                        transform: `
                          translate(-50%, -50%) 
                          rotate(${arm * 120 + i * 15}deg) 
                          translateX(${20 + i * 8}px)
                        `,
                        animation: `galaxyRotate ${6 + arm}s linear infinite, stellarGlow 2s ease-in-out ${i * 0.2}s infinite alternate`,
                        boxShadow: `0 0 10px ${['#8B5CF6', '#EC4899', '#F59E0B'][arm]}`,
                      }}
                    ></div>
                  ))}
                </div>
              ))}
              
              {/* Accretion disk */}
              <div 
                className="absolute inset-8 border-2 border-orange-400 rounded-full opacity-60"
                style={{ animation: 'galaxyRotate 4s linear infinite' }}
              ></div>
              <div 
                className="absolute inset-12 border border-yellow-400 rounded-full opacity-40"
                style={{ animation: 'galaxyRotate 3s linear infinite reverse' }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-1">{message}</h3>
            <p className="text-purple-200 text-sm">{subMessage}</p>
            <div className="mt-4 flex justify-center space-x-2">
              {['🌟', '⭐', '✨'].map((star, i) => (
                <span
                  key={i}
                  className="text-lg opacity-60"
                  style={{
                    animation: `twinkle 1.5s ease-in-out ${i * 0.5}s infinite`,
                  }}
                >
                  {star}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes galaxyRotate {
            from { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--distance)); }
            to { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--distance)); }
          }
          @keyframes stellarGlow {
            0% { 
              transform: translate(-50%, -50%) rotate(var(--rotation)) translateX(var(--distance)) scale(0.8);
              opacity: 0.6;
            }
            100% { 
              transform: translate(-50%, -50%) rotate(var(--rotation)) translateX(var(--distance)) scale(1.2);
              opacity: 1;
            }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    );
  }

  // Modern type - clean and professional
  return (
    <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        {/* Clean spinner */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
          <p className="text-gray-500">{subMessage}</p>
          
          {/* Progress indicator */}
          <div className="w-full bg-gray-100 rounded-full h-1 mt-6">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-1 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
