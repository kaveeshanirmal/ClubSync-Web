"use client";
import { Zap, Users, Award, QrCode, Trophy, Star, Globe } from "lucide-react";

const team = [
  { name: "Pratheepan Niroshan", role: "Full Stack Developer", icon: <Zap className="w-7 h-7 text-orange-500" /> },
  { name: "Silva B.S.D.", role: "UI/UX Designer", icon: <Star className="w-7 h-7 text-yellow-500" /> },
  { name: "Razeen M.R.M.", role: "Mobile Engineer", icon: <QrCode className="w-7 h-7 text-red-500" /> },
  { name: "Vas M.Y.H.", role: "Backend Engineer", icon: <Award className="w-7 h-7 text-amber-500" /> },
  { name: "Perera D.K.N.", role: "Cloud & DevOps", icon: <Globe className="w-7 h-7 text-blue-500" /> },
  { name: "Piyathilaka M.A.S.R.", role: "QA & Community", icon: <Users className="w-7 h-7 text-green-500" /> },
];

const values = [
  {
    icon: <Users className="w-8 h-8 text-orange-500 mb-2" />, title: "Collaboration",
    desc: "We foster teamwork and open communication to achieve shared goals."
  },
  {
    icon: <Award className="w-8 h-8 text-red-500 mb-2" />, title: "Recognition",
    desc: "We celebrate every contribution and empower members to grow."
  },
  {
    icon: <QrCode className="w-8 h-8 text-amber-500 mb-2" />, title: "Innovation",
    desc: "We leverage technology to deliver seamless, impactful solutions."
  },

];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 text-gray-900 overflow-hidden relative">
      {/* Floating shapes for subtle background accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-orange-300 rotate-45 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }} />
        <div className="absolute top-40 right-20 w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-2 h-6 bg-orange-200 animate-bounce" style={{ animationDelay: "2s", animationDuration: "4s" }} />
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-orange-300 rotate-45 animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-20 flex flex-col gap-24">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text mb-2 drop-shadow-lg">Empowering Clubs. Inspiring Communities.</h1>
          <p className="text-lg md:text-xl max-w-2xl text-gray-700 font-medium">
            ClubSync is a unified platform for managing clubs, events, and volunteers—designed to streamline operations, enhance engagement, and recognize achievement.
          </p>
        </section>
        {/* Our Story */}
        <section className="flex flex-col md:flex-row gap-10 items-center justify-between mb-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3 text-orange-500">Our Story</h2>
            <p className="text-gray-700 text-lg">
              ClubSync was founded by a team of passionate technologists and club leaders who recognized the need for a modern, digital solution to club management. Our vision is to empower every club and volunteer with tools that are intuitive, reliable, and rewarding.
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="w-28 h-28 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-xl">
              <Trophy className="w-14 h-14 text-white" />
            </div>
          </div>
        </section>
        {/* Core Values */}
        <section className="flex flex-col items-center text-center gap-8 mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-2">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {values.map((v) => (
              <div key={v.title} className="bg-white/90 rounded-2xl shadow-md p-8 flex flex-col items-center gap-2 border-t-4 border-orange-200 hover:border-orange-400 transition-all duration-300">
                {v.icon}
                <div className="font-semibold text-lg text-gray-800 mb-1">{v.title}</div>
                <div className="text-gray-600 text-sm">{v.desc}</div>
              </div>
            ))}
          </div>
        </section>
        {/* Team Section */}
        <section className="flex flex-col items-center text-center gap-8 mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-2">Meet the Team</h2>
          <p className="text-gray-700 max-w-2xl mb-4">Our diverse team brings together expertise in software engineering, design, and community building. We are united by a commitment to excellence and innovation.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
            {team.map((member) => (
              <div key={member.name} className="bg-white/95 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div>{member.icon}</div>
                <div className="font-bold text-base text-orange-700 mt-2">{member.name}</div>
                <div className="text-sm text-gray-500">{member.role}</div>
              </div>
            ))}
          </div>
        </section>
        {/* Call to Action */}
        <section className="flex flex-col items-center text-center gap-4 mt-8">
          <h2 className="text-xl font-bold text-orange-500">Ready to Join the Future of Club Management?</h2>
          <a href="/register" className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105">Register Now</a>
        </section>
        <footer className="text-xs text-gray-500 mt-12 text-center">
          &copy; {new Date().getFullYear()} ClubSync. All rights reserved.
        </footer>
      </main>
    </div>
  );
} 