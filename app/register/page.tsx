"use client"
import { useState } from "react";
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
    User,
    Phone,
} from "lucide-react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            console.log('Registration attempt:', formData);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full animate-pulse opacity-30" />
                <div className="absolute top-1/4 right-20 w-8 h-8 bg-red-300 rotate-45 animate-bounce opacity-40" />
                <div className="absolute bottom-1/4 left-20 w-12 h-12 bg-orange-300 rounded-full animate-pulse opacity-30" />
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-red-200 rotate-45 animate-bounce opacity-40" />
            </div>

            <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Brand and features */}
                <div className="hidden lg:block relative">
                    <div className="relative z-10">
                        <div className="inline-flex items-center space-x-3 mb-8 group cursor-pointer">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-4xl font-bold text-black group-hover:text-orange-500 transition-colors duration-300">
                ClubSync
              </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
                            Join the{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                ClubSync
              </span>
                            {" "}Community
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Start your journey with us! Create your account to access exclusive club features, events, and volunteer opportunities.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: <Users className="w-5 h-5" />, text: "Connect with 100+ active clubs" },
                                { icon: <Shield className="w-5 h-5" />, text: "Secure digital certificates" },
                                { icon: <Smartphone className="w-5 h-5" />, text: "QR code check-ins" },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 text-gray-700">
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

                {/* Right side - Registration form */}
                <div className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 opacity-50" />

                        <div className="relative z-10">
                            <div className="lg:hidden text-center mb-8">
                                <div className="inline-flex items-center space-x-3 group cursor-pointer">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-2xl font-bold text-black group-hover:text-orange-500 transition-colors duration-300">
                    ClubSync
                  </span>
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-black mb-2">Create Account</h2>
                                <p className="text-gray-600">Join ClubSync and start your journey</p>
                            </div>

                            <div onSubmit={handleSubmit} className="space-y-6">
                                {/* Name fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone field */}
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="+1 (555) 123-4567"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password field */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                                            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="Create a strong password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password field */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="Confirm your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start mb-6">
                                    <input
                                        type="checkbox"
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded transition-colors duration-200 mt-1"
                                    />
                                    <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-600">
                                        I agree to the{" "}
                                        <span className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer">
                      Terms of Service
                    </span>
                                        {" "}and{" "}
                                        <span className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer">
                      Privacy Policy
                    </span>
                                    </label>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isLoading || !formData.agreeToTerms}
                                    className="group w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Creating account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                                    </div>
                                </div>

                                <div
                                    className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:border-orange-500 hover:text-orange-500 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center cursor-pointer"
                                >
                                    Sign in to existing account
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <div
                            className="text-gray-600 hover:text-orange-500 transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                        >
                            <span>← Back to home</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}