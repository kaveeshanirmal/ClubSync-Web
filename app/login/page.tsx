"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  Users,
  Shield,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Handle different error types
        switch (result.error) {
          case "CredentialsSignin":
            setError("Invalid email or password. Please try again.");
            break;
          default:
            setError("Something went wrong. Please try again.");
        }
      } else if (result?.ok) {
        // Get the updated session to check for profile completion
        const session = await getSession();
        if (session?.user?.needsProfileCompletion) {
          // router.push("/profile/complete");
          router.push("/welcome");
        } else if (session?.user?.role === "clubAdmin") {
          router.push("/club-admin");
        } else if (session?.user?.role === "systemAdmin") {
          router.push("/admin");
        } else {
          router.push("/welcome");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4 py-4 relative overflow-hidden">
      {/* Back to home button in top left */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 text-gray-600 hover:text-orange-500 transition-colors duration-300 flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm hover:shadow-md"
      >
        <span>← Back to home</span>
      </Link>

      {/* ... existing background elements ... */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full animate-pulse opacity-30" />
        <div className="absolute top-1/4 right-20 w-8 h-8 bg-red-300 rotate-45 animate-bounce opacity-40" />
        <div className="absolute bottom-1/4 left-20 w-12 h-12 bg-orange-300 rounded-full animate-pulse opacity-30" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-red-200 rotate-45 animate-bounce opacity-40" />
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center h-full">
        {/* ... existing left side content ... */}
        <div className="hidden lg:block relative">
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 mb-8 group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <span className="text-4xl font-bold text-black group-hover:text-orange-500 transition-colors duration-300">
                ClubSync
              </span>
            </Link>

            <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
              Welcome Back to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                ClubSync
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Connect with your community, manage events, and track your
              volunteer journey all in one place.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <Users className="w-5 h-5" />,
                  text: "Connect with 100+ active clubs",
                },
                {
                  icon: <Shield className="w-5 h-5" />,
                  text: "Secure digital certificates",
                },
                {
                  icon: <Smartphone className="w-5 h-5" />,
                  text: "QR code check-ins",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-gray-700"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-100 to-red-100 rounded-full opacity-20 animate-pulse" />
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 lg:p-6 relative overflow-hidden w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 opacity-50" />

            <div className="relative z-10">
              {/* ... existing header content ... */}
              <div className="lg:hidden text-center mb-6">
                <Link
                  href="/"
                  className="inline-flex items-center space-x-3 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-black group-hover:text-orange-500 transition-colors duration-300">
                    ClubSync
                  </span>
                </Link>
              </div>

              <div className="text-center mb-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-black mb-2">
                  Sign In
                </h2>
                <p className="text-gray-600 text-sm">
                  Access your ClubSync Dashboard
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* ... existing form fields ... */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded transition-colors duration-200"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>

                {/* ... rest of existing form content ... */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      or continue with
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-xl font-medium hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Don&#39;t have an account?
                    </span>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="w-full border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-xl font-medium hover:border-orange-500 hover:text-orange-500 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
                >
                  Create new account
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
