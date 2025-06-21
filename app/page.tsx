"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Award,
  QrCode,
  Vote,
  Trophy,
  Smartphone,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Menu,
  X,
  ChevronUp,
} from "lucide-react";

export default function ClubSyncLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [hoveredStat, setHoveredStat] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Event Management",
      desc: "Create, manage, and track events with AI-powered insights",
      color: "from-orange-400 to-red-500",
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "QR Code Check-ins",
      desc: "Instant attendance tracking via mobile QR scanning",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Digital Certificates",
      desc: "Auto-generated certificates stored in personal wallets",
      color: "from-red-500 to-orange-600",
    },
    {
      icon: <Vote className="w-6 h-6" />,
      title: "Secure Voting",
      desc: "Transparent elections for club office bearers",
      color: "from-orange-600 to-amber-500",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Points & Rewards",
      desc: "Points & Rewards to recognize volunteer contributions",
      color: "from-amber-500 to-orange-400",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Building",
      desc: "Connect clubs, volunteers, and communities seamlessly",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const stats = [
    {
      number: "500+",
      label: "Active Clubs",
      icon: <Users className="w-8 h-8" />,
    },
    { number: "10K+", label: "Volunteers", icon: <Star className="w-8 h-8" /> },
    {
      number: "2K+",
      label: "Events Created",
      icon: <Calendar className="w-8 h-8" />,
    },
    {
      number: "50K+",
      label: "Certificates Issued",
      icon: <Award className="w-8 h-8" />,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-orange-300 rotate-45 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-20 w-3 h-3 bg-orange-400 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-2 h-6 bg-orange-200 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-4 h-4 bg-orange-300 rotate-45 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          scrollY > 50
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200 transform"
            : "bg-white transform"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-black group-hover:text-orange-500 transition-colors duration-300">
                <Link href="/">ClubSync</Link>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {["Home", "About", "Contact"].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-orange-500 transition-all duration-300 font-medium relative group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg">
                Get Started
              </button>
            </div>

            <button
              className="md:hidden transform transition-transform duration-200 hover:scale-110"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ${
              mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col space-y-4 pt-4 pb-4 border-t border-gray-200">
              {["Features", "Demo", "Community"].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-orange-500 transition-all duration-300 font-medium transform hover:translate-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    transform: mobileMenuOpen
                      ? "translateX(0)"
                      : "translateX(-20px)",
                  }}
                >
                  {item}
                </a>
              ))}
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium w-fit transform hover:scale-105">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 text-black leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Sync Up.
              </span>{" "}
              Show Up.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Stand Out.
              </span>{" "}
            </h1>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Bringing clubs and volunteers together on a single platform
              designed for{" "}
              <span className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-300">
                growth
              </span>
              ,{" "}
              <span className="text-red-500 font-semibold hover:text-red-600 transition-colors duration-300">
                engagement
              </span>
              , and{" "}
              <span className="text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-300">
                meaningful experiences
              </span>
              .
            </p>
          </div>

          <div
            className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center mb-16"
            style={{ animationDelay: "0.6s" }}
          >
            <button className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2">
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-orange-500 hover:text-orange-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Watch Demo</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-110"
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 ${
                    hoveredStat === index
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white scale-110"
                      : "bg-gray-100 text-orange-500"
                  }`}
                >
                  {stat.icon}
                </div>
                <div
                  className={`text-3xl md:text-4xl font-bold mb-2 transition-all duration-300 ${
                    hoveredStat === index
                      ? "text-orange-600 scale-110"
                      : "text-orange-500"
                  }`}
                >
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-1/4 left-10 w-20 h-20 bg-orange-100 rounded-full animate-pulse opacity-30" />
        <div
          className="absolute bottom-1/4 right-10 w-32 h-32 bg-red-100 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "1s" }}
        />
      </section>

      <section
        id="features"
        className="py-20 px-6 bg-gray-50 relative"
        data-animate
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.features
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black">
              Powerful Features for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Modern Clubs
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built for the digital age with cutting-edge technology to
              streamline club management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                  isVisible.features
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform translate-y-10"
                }`}
                style={{
                  transitionDelay: `${index * 0.1}s`,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-black group-hover:text-orange-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ padding: "2px" }}
                >
                  <div className="w-full h-full bg-white rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="py-20 px-6 relative" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible.demo
                  ? "opacity-100 transform translate-x-0"
                  : "opacity-0 transform -translate-x-10"
              }`}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black">
                See ClubSync in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Action
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Experience the seamless flow from event creation to certificate
                distribution, all powered by innovative QR technology and smart
                automation.
              </p>
              <div className="space-y-4">
                {[
                  "Create events with custom templates",
                  "QR code generation for instant check-ins",
                  "Real-time attendance tracking",
                  "Automated certificate generation",
                  "Digital wallet integration",
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 transform transition-all duration-500 hover:translate-x-2 ${
                      isVisible.demo
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-5"
                    }`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle
                      className="w-6 h-6 text-orange-500 animate-bounce"
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        animationDuration: "2s",
                      }}
                    />
                    <span className="text-gray-700 hover:text-orange-600 transition-colors duration-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`relative transition-all duration-1000 ${
                isVisible.demo
                  ? "opacity-100 transform translate-x-0"
                  : "opacity-0 transform translate-x-10"
              }`}
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center space-x-4 animate-slide-in">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">
                        Mobile-First Experience
                      </h4>
                      <p className="text-sm text-gray-600">
                        Scan QR codes instantly
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200 relative overflow-hidden group/qr">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 opacity-0 group-hover/qr:opacity-100 transition-opacity duration-500" />
                    <QrCode className="w-20 h-20 mx-auto mb-4 text-orange-500 animate-pulse relative z-10" />
                    <p className="text-sm text-gray-600 relative z-10">
                      Event Check-in QR Code
                    </p>

                    <div className="absolute inset-0 border-2 border-orange-500 rounded-xl opacity-0 group-hover/qr:opacity-100 animate-ping" />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Attendance:
                      <span className="font-bold text-orange-500 animate-pulse">
                        {" "}
                        156
                      </span>
                      /200
                    </span>
                    <span className="text-orange-500 text-sm font-medium bg-orange-100 px-2 py-1 rounded-full animate-bounce">
                      ✓ Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="community" className="py-20 px-6 bg-gray-50" data-animate>
        <div className="max-w-7xl mx-auto text-center">
          <div
            className={`mb-16 transition-all duration-1000 ${
              isVisible.community
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black">
              Join the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Revolution
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Be part of a growing community transforming how clubs and
              volunteers connect, collaborate, and celebrate achievements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Reach",
                desc: "Clubs worldwide trust ClubSync",
                color: "from-orange-400 to-red-500",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure & Reliable",
                desc: "Enterprise-grade security",
                color: "from-orange-500 to-yellow-500",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Highly Rated",
                desc: "4.9/5 stars from users",
                color: "from-red-500 to-orange-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer ${
                  isVisible.community
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black group-hover:text-orange-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <button
            className={`bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              isVisible.community
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
            style={{ transitionDelay: "0.8s" }}
          >
            Get Started Today
          </button>
        </div>
      </section>

      {scrollY > 500 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-30 animate-bounce"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      <footer className="py-16 px-6 border-t border-gray-200 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 to-red-900/10" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center space-x-3 mb-4 md:mb-0 group">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                ClubSync
              </span>
            </div>
            <div className="flex space-x-8 text-sm text-gray-400">
              <a
                href="#"
                className="hover:text-orange-400 transition-colors duration-300 transform hover:scale-110"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-orange-400 transition-colors duration-300 transform hover:scale-110"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-orange-400 transition-colors duration-300 transform hover:scale-110"
              >
                Support
              </a>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm">
            © 2025 ClubSync. Empowering communities worldwide.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
