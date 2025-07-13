"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Smartphone,
  Monitor,
  QrCode,
  Download,
  ArrowRight,
  Settings,
  CheckCircle,
  Zap,
  Shield,
  UserCheck,
  CreditCard,
  MessageSquare,
  Calendar,
  FileText,
  Mail,
  UserPlus,
  BarChart3,
  Crown,
  ArrowLeft,
} from "lucide-react";

export default function UserOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { data: session, status } = useSession();

  const clubAdminFeatures = [
    { icon: <Shield className="w-5 h-5" />, text: "Login & Authentication" },
    { icon: <UserCheck className="w-5 h-5" />, text: "Approve Members" },
    { icon: <CreditCard className="w-5 h-5" />, text: "Approve Payments" },
    { icon: <MessageSquare className="w-5 h-5" />, text: "Manage Interviews" },
    { icon: <Crown className="w-5 h-5" />, text: "Approve Office Bearer List" },
    { icon: <Calendar className="w-5 h-5" />, text: "Manage Events" },
    { icon: <FileText className="w-5 h-5" />, text: "Manage Meeting Minutes" },
    {
      icon: <Mail className="w-5 h-5" />,
      text: "View Service Letter Requests",
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      text: "Approve Board Candidates",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      text: "View Volunteer Feedback",
    },
  ];

  const RoleSelection = () => (
    <div className="text-center space-y-8">
      <div
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          Choose Your Role
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Select how you'd like to participate in ClubSync
        </p>
      </div>

      <div
        className={`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Volunteer Card */}
        <div
          className={`group bg-white p-8 rounded-2xl shadow-xl border-2 transition-all duration-500 transform cursor-pointer ${
            hoveredCard === "volunteer"
              ? "border-orange-500 shadow-2xl scale-105 bg-gradient-to-br from-orange-50 to-red-50"
              : "border-gray-200 hover:border-orange-300"
          }`}
          onMouseEnter={() => setHoveredCard("volunteer")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => {
            setSelectedRole("volunteer");
            setCurrentStep(1);
          }}
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-orange-600 transition-colors duration-300">
              Continue as Volunteer
            </h3>
            <p className="text-gray-600 mb-6">
              Join events, track your participation, and earn certificates
              through our mobile app
            </p>
            <div className="space-y-3 text-left">
              {[
                "Access mobile app",
                "Scan QR codes at events",
                "Track participation",
                "Earn digital certificates",
                "Receive notifications",
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Club Admin Card */}
        <div
          className={`group bg-white p-8 rounded-2xl shadow-xl border-2 transition-all duration-500 transform cursor-pointer ${
            hoveredCard === "admin"
              ? "border-orange-500 shadow-2xl scale-105 bg-gradient-to-br from-orange-50 to-red-50"
              : "border-gray-200 hover:border-orange-300"
          }`}
          onMouseEnter={() => setHoveredCard("admin")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => {
            setSelectedRole("admin");
            setCurrentStep(1);
          }}
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
              <Monitor className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-orange-600 transition-colors duration-300">
              Become Club Admin
            </h3>
            <p className="text-gray-600 mb-6">
              Manage your club, approve members, organize events, and oversee
              all club operations
            </p>
            <div className="grid grid-cols-2 gap-2 text-left">
              {clubAdminFeatures.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {feature.icon}
                  <span className="text-xs text-gray-600">{feature.text}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">+ 4 more features</p>
          </div>
        </div>
      </div>
    </div>
  );

  const VolunteerOnboarding = () => (
    <div className="text-center space-y-8">
      <div
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Smartphone className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          Download ClubSync Mobile App
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Get the mobile app for the best volunteer experience
        </p>
      </div>

      <div
        className={`transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 max-w-md mx-auto relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h3 className="text-xl font-semibold mb-6 text-black">
              Scan QR Code to Download
            </h3>

            <div className="bg-gray-50 rounded-xl p-8 mb-6 relative group/qr">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 opacity-0 group-hover/qr:opacity-100 transition-opacity duration-500 rounded-xl" />
              <QrCode className="w-32 h-32 mx-auto text-orange-500 animate-pulse relative z-10" />
              <div className="absolute inset-0 border-2 border-orange-500 rounded-xl opacity-0 group-hover/qr:opacity-100 animate-ping" />
            </div>

            <div className="space-y-3 text-left">
              {[
                "Instant event check-ins",
                "Digital certificate wallet",
                "Real-time notifications",
                "Points & rewards tracking",
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-700">
                <strong>Note:</strong> The mobile app provides the best
                experience for volunteers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`space-y-4 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="space-y-4">
          <button className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 mx-auto">
            <Download className="w-5 h-5" />
            <span>Download from App Store</span>
          </button>
          <button className="group bg-gray-800 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 mx-auto">
            <Download className="w-5 h-5" />
            <span>Download from Play Store</span>
          </button>
        </div>

        <button
          onClick={() => setCurrentStep(0)}
          className="text-orange-600 hover:text-orange-700 flex items-center space-x-2 mx-auto mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to role selection</span>
        </button>
      </div>
    </div>
  );

  const AdminOnboarding = () => (
    <div className="text-center space-y-8">
      <div
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Monitor className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          You're now a Club Admin
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Ready to manage your club operations
        </p>
      </div>

      <div
        className={`transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-black">
            Your Admin Capabilities
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {clubAdminFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors duration-200"
              >
                <div className="text-orange-500">{feature.icon}</div>
                <span className="text-gray-700 text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-orange-700">
              <strong>Important:</strong> As a club admin, you have full access
              to manage all aspects of your club. Use these powers responsibly
              to create a great experience for all volunteers.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`space-y-4 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <button onClick={() => router.push("/club-admin")}
        className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 mx-auto">
          <Settings className="w-5 h-5" />
          <span>Go to Admin Dashboard</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        <button
          onClick={() => setCurrentStep(0)}
          className="text-orange-600 hover:text-orange-700 flex items-center space-x-2 mx-auto mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to role selection</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (currentStep === 0) {
      return <RoleSelection />;
    } else if (selectedRole === "volunteer") {
      return <VolunteerOnboarding />;
    } else if (selectedRole === "admin") {
      return <AdminOnboarding />;
    }
    return <RoleSelection />;
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden relative">
      {/* Background Animation Elements */}
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

      <div className="pt-20 pb-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center justify-center space-x-3 mb-6 group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <span className="text-4xl font-bold text-black group-hover:text-orange-600 transition-colors duration-300">
                ClubSync
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
              Welcome,{" "}
              <span className="text-orange-600">
                {session?.user?.firstName}
              </span>
              !
            </h1>
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span>Setting up your account</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className={`mb-12 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center justify-center space-x-4 max-w-md mx-auto">
              {[0, 1].map((index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${
                      index <= currentStep
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white scale-110"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 1 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-500 ${
                        index < currentStep
                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="relative">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
