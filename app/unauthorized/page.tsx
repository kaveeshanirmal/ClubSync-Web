"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  ArrowLeft,
  Home,
  AlertTriangle,
  UserX,
  ChevronRight,
  Clock,
} from "lucide-react";

export default function UnauthorizedPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [router]);

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_25%,rgba(68,68,68,.1)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.1)_75%)] bg-[length:20px_20px] opacity-30"></div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-20 text-red-200 animate-float">
        <Shield className="w-8 h-8" />
      </div>
      <div className="absolute top-40 right-20 text-orange-200 animate-float-delayed">
        <Lock className="w-6 h-6" />
      </div>

      {/* Main Container */}
      <div
        className={`max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-700 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-8 text-center relative">
          <div className="absolute top-4 right-4 bg-white/20 rounded-full p-2">
            <Clock className="w-5 h-5" />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <h1 className="text-6xl font-black mb-2">403</h1>
          <p className="text-xl font-semibold opacity-90">Access Denied</p>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              You don&apos;t have permission to access this page
            </h2>
            <p className="text-gray-600 leading-relaxed">
              This area requires special authorization. Please contact your
              administrator if you believe you should have access to this
              resource.
            </p>
          </div>

          {/* Permission Requirements */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800">
                Access Requirements
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                "Valid authentication",
                "Appropriate role permissions",
                "Active account status",
                "Admin authorization",
              ].map((requirement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                  <span className="text-gray-600">{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auto Redirect Notice */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">
                  Auto-redirecting to homepage in
                </p>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  {countdown}s
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={goBack}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>

            <Link href="/" className="flex-1">
              <button className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
            </Link>

            <Link href="/login" className="flex-1">
              <button className="w-full border-2 border-orange-300 text-orange-700 px-6 py-3 rounded-xl font-medium hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Login</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-180deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: -2s;
        }
      `}</style>
    </div>
  );
}
