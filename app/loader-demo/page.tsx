"use client";
import { useState } from "react";
import BeautifulLoader from "../../components/Loader";

export default function LoaderDemoPage() {
  const [currentDemo, setCurrentDemo] = useState<"modern" | "pulse" | "dots" | "minimal" | "waves" | "orbit" | "morphing" | "particles" | "quantum" | "galaxy">("galaxy");

  const demos = [
    { type: "galaxy" as const, label: "Galaxy", description: "Cosmic spiral animation" },
    { type: "quantum" as const, label: "Quantum", description: "Sci-fi quantum effects" },
    { type: "particles" as const, label: "Particles", description: "Floating energy particles" },
    { type: "morphing" as const, label: "Morphing", description: "Shape-shifting animation" },
    { type: "orbit" as const, label: "Orbit", description: "Planetary orbit system" },
    { type: "waves" as const, label: "Waves", description: "Audio wave effect" },
    { type: "pulse" as const, label: "Pulse", description: "Clean pulse animation" },
    { type: "modern" as const, label: "Modern", description: "Professional spinner" },
    { type: "dots" as const, label: "Dots", description: "Simple bouncing dots" },
    { type: "minimal" as const, label: "Minimal", description: "Ultra simple inline" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Control Panel */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loader Showcase</h1>
          <div className="flex flex-wrap gap-2">
            {demos.map((demo) => (
              <button
                key={demo.type}
                onClick={() => setCurrentDemo(demo.type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentDemo === demo.type
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="text-sm font-semibold">{demo.label}</div>
                <div className="text-xs opacity-80">{demo.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Area */}
      <div className="relative">
        {currentDemo === "galaxy" && (
          <BeautifulLoader 
            message="Exploring the Universe"
            subMessage="Loading cosmic data from distant stars..."
            type="galaxy"
          />
        )}
        
        {currentDemo === "quantum" && (
          <BeautifulLoader 
            message="Quantum Processing"
            subMessage="Entangling data across dimensions..."
            type="quantum"
          />
        )}
        
        {currentDemo === "particles" && (
          <BeautifulLoader 
            message="Energy Synchronization"
            subMessage="Harmonizing particle frequencies..."
            type="particles"
          />
        )}
        
        {currentDemo === "morphing" && (
          <BeautifulLoader 
            message="Shape Evolution"
            subMessage="Transforming data structures..."
            type="morphing"
          />
        )}
        
        {currentDemo === "orbit" && (
          <BeautifulLoader 
            message="System Initialization"
            subMessage="Calculating orbital parameters..."
            type="orbit"
          />
        )}
        
        {currentDemo === "waves" && (
          <BeautifulLoader 
            message="Audio Processing"
            subMessage="Analyzing frequency patterns..."
            type="waves"
          />
        )}

        {currentDemo === "pulse" && (
          <BeautifulLoader 
            message="Loading Club Information"
            subMessage="Getting the latest updates for you..."
            type="pulse"
          />
        )}
        
        {currentDemo === "modern" && (
          <BeautifulLoader 
            message="Welcome to ClubSync"
            subMessage="Preparing your personalized experience"
            type="modern"
          />
        )}
        
        {currentDemo === "dots" && (
          <div className="p-12 bg-white">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Dots Loader Examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Loading Members</h3>
                  <BeautifulLoader 
                    message="Loading members"
                    subMessage="Fetching team information..."
                    type="dots"
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Loading Events</h3>
                  <BeautifulLoader 
                    message="Loading events"
                    subMessage="Getting upcoming activities..."
                    type="dots"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentDemo === "waves" && (
          <div className="p-12 bg-gradient-to-br from-orange-50 to-red-50">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Wave Animation</h2>
              <BeautifulLoader 
                message="Synchronizing Data"
                subMessage="Processing information in real-time..."
                type="waves"
              />
            </div>
          </div>
        )}
        
        {currentDemo === "minimal" && (
          <div className="p-12 bg-white">
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Minimal Loader Examples</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Form Submission</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Saving your changes...</span>
                    <BeautifulLoader message="Saving" type="minimal" />
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Data Refresh</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Refreshing club data...</span>
                    <BeautifulLoader message="Refreshing" type="minimal" />
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Searching clubs...</span>
                    <BeautifulLoader message="Searching" type="minimal" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Preview */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h3 className="text-lg font-bold mb-4">Usage Example</h3>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm">
{`<BeautifulLoader 
  message="${demos.find(d => d.type === currentDemo)?.label}"
  subMessage="${demos.find(d => d.type === currentDemo)?.description}"
  type="${currentDemo}"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
