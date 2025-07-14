"use client";
import React from "react";
import Image from "next/image";
import { Zap, Users, Award, QrCode, Trophy, Star, Globe } from "lucide-react";

const team = [
	{
		name: "Pratheepan Niroshan",
		role: "Full Stack Developer",
		icon: <Zap className="w-7 h-7 text-orange-500" />,
		image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
	},
	{
		name: "Silva B.S.D.",
		role: "UI/UX Designer",
		icon: <Star className="w-7 h-7 text-yellow-500" />,
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
	},
	{
		name: "Razeen M.R.M.",
		role: "Mobile Engineer",
		icon: <QrCode className="w-7 h-7 text-red-500" />,
		image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
	},
	{
		name: "Vas M.Y.H.",
		role: "Backend Engineer",
		icon: <Award className="w-7 h-7 text-amber-500" />,
		image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
	},
	{
		name: "Perera D.K.N.",
		role: "Cloud & DevOps",
		icon: <Globe className="w-7 h-7 text-blue-500" />,
		image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
	},
	{
		name: "Piyathilaka M.A.S.R.",
		role: "QA & Community",
		icon: <Users className="w-7 h-7 text-green-500" />,
		image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
	},
];

const values = [
	{
		icon: <Users className="w-8 h-8 text-orange-500 mb-2" />,
		title: "Collaboration",
		desc: "We foster teamwork and open communication to achieve shared goals.",
	},
	{
		icon: <Award className="w-8 h-8 text-red-500 mb-2" />,
		title: "Recognition",
		desc: "We celebrate every contribution and empower members to grow.",
	},
	{
		icon: <QrCode className="w-8 h-8 text-amber-500 mb-2" />,
		title: "Innovation",
		desc: "We leverage technology to deliver seamless, impactful solutions.",
	},
];

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 text-black overflow-hidden relative">
			{/* Enhanced background with more visual interest */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				{/* Dynamic gradient overlays */}
				<div
					className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-100/50 via-pink-50/30 to-transparent rounded-full blur-3xl animate-pulse"
					style={{ animationDuration: "4s" }}
				></div>
				<div
					className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-red-100/40 via-orange-50/30 to-transparent rounded-full blur-2xl animate-pulse"
					style={{ animationDuration: "6s", animationDelay: "1s" }}
				></div>
				<div
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-50/20 to-red-50/20 rounded-full blur-3xl animate-pulse"
					style={{ animationDuration: "8s", animationDelay: "2s" }}
				></div>

				{/* Floating geometric elements */}
				<div
					className="absolute top-20 right-20 w-32 h-32 border-2 border-orange-200/60 rounded-3xl rotate-12 animate-bounce"
					style={{ animationDelay: "0s", animationDuration: "6s" }}
				></div>
				<div
					className="absolute top-40 left-10 w-24 h-24 border border-red-200/50 rounded-full animate-pulse"
					style={{ animationDelay: "1s", animationDuration: "4s" }}
				></div>
				<div
					className="absolute bottom-32 right-32 w-20 h-20 border border-orange-300/40 rounded-2xl rotate-45 animate-bounce"
					style={{ animationDelay: "2s", animationDuration: "5s" }}
				></div>
				<div
					className="absolute bottom-20 left-20 w-28 h-28 border-2 border-red-200/50 rounded-xl -rotate-12 animate-pulse"
					style={{ animationDelay: "3s", animationDuration: "7s" }}
				></div>

				{/* Floating particles */}
				<div
					className="absolute top-1/4 left-1/4 w-3 h-3 bg-orange-300/60 rounded-full animate-ping"
					style={{ animationDelay: "0s", animationDuration: "3s" }}
				></div>
				<div
					className="absolute top-3/4 right-1/4 w-2 h-2 bg-red-300/60 rounded-full animate-ping"
					style={{ animationDelay: "1.5s", animationDuration: "4s" }}
				></div>
				<div
					className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-orange-400/50 rounded-full animate-ping"
					style={{ animationDelay: "3s", animationDuration: "2.5s" }}
				></div>
				<div
					className="absolute bottom-1/3 right-1/6 w-2.5 h-2.5 bg-red-400/50 rounded-full animate-ping"
					style={{ animationDelay: "4s", animationDuration: "3.5s" }}
				></div>

				{/* Subtle grid pattern */}
				<div
					className="absolute inset-0 opacity-[0.015]"
					style={{
						backgroundImage: `
              radial-gradient(circle at 25% 25%, orange 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, red 1px, transparent 1px)
            `,
						backgroundSize: "60px 60px",
					}}
				></div>
			</div>

			<main className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col gap-24">
				{/* Hero Section */}
				<section className="text-center mb-16 pt-12 relative">
					{/* Hero background decoration */}
					<div className="absolute inset-0 flex items-center justify-center opacity-10">
						<div
							className="w-96 h-96 border-2 border-orange-300 rounded-full animate-spin"
							style={{ animationDuration: "20s" }}
						></div>
					</div>

					<div className="relative z-10">
						<div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl mx-auto transform hover:scale-105 transition-all duration-300 relative">
							<Zap className="w-12 h-12 text-white" />
							<div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-30 animate-pulse"></div>
						</div>

						<h1 className="text-4xl md:text-7xl font-bold mb-6 text-black leading-tight relative">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 animate-gradient bg-300% bg-pos-0">
								Empowering Clubs.
							</span>{" "}
							<br />
							<span className="relative">
								Inspiring Communities.
								<div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-30"></div>
							</span>
						</h1>

						<div className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed relative">
							ClubSync is a unified platform for managing clubs, events, and
							volunteers—designed to streamline operations, enhance engagement, and
							recognize achievement.
							<div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-orange-300 opacity-50"></div>
							<div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-red-300 opacity-50"></div>
						</div>
					</div>
				</section>
				{/* Our Story */}
				<section className="grid md:grid-cols-2 gap-12 items-center mb-16">
					<div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
						<h2 className="text-3xl font-bold mb-6 text-black flex items-center gap-3">
							<Trophy className="w-8 h-8 text-orange-500" />
							Our Story
						</h2>
						<p className="text-gray-600 text-lg leading-relaxed">
							ClubSync was founded by a team of passionate technologists and club
							leaders who recognized the need for a modern, digital solution to club
							management. Our vision is to empower every club and volunteer with
							tools that are intuitive, reliable, and rewarding.
						</p>
					</div>
					<div className="flex justify-center">
						<div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
							<Trophy className="w-16 h-16 text-white" />
						</div>
					</div>
				</section>
				{/* Core Values */}
				<section className="text-center mb-13 relative">
					{/* Section background decoration */}
					<div className="absolute inset-0 flex items-center justify-center opacity-5">
						<div className="w-full h-full bg-gradient-to-r from-orange-100 via-transparent to-red-100 rounded-3xl"></div>
					</div>

					<div className="relative z-10">
						<h2 className="text-5xl font-bold text-black mb-4 relative">
							Our Core Values
							<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
						</h2>
						<p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
							These values guide everything we do and shape how we build products
							and serve our community.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{values.map((v, index) => (
								<div
									key={v.title}
									className="group bg-gradient-to-br from-white via-white to-orange-50/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-orange-200 relative overflow-hidden"
								>
									{/* Card background decoration */}
									<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-100/30 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
									<div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-red-100/30 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

									<div className="relative z-10">
										<div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-all duration-300 shadow-lg mx-auto relative">
											{React.cloneElement(v.icon, {
												className: "w-8 h-8 text-white",
											})}
											<div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
										</div>
										<h3 className="text-xl font-bold text-black mb-3 group-hover:text-orange-600 transition-colors duration-300">
											{v.title}
										</h3>
										<p className="text-gray-600 leading-relaxed">{v.desc}</p>
									</div>

									{/* Animated corner accents */}
									<div
										className="absolute top-4 left-4 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 transform group-hover:scale-150"
										style={{ animationDelay: `${index * 0.1}s` }}
									></div>
									<div
										className="absolute bottom-4 right-4 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 transform group-hover:scale-150"
										style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
									></div>
								</div>
							))}
						</div>
					</div>
				</section>
				{/* Team Section */}
				<section className="text-center mb-10">
					<h2 className="text-5xl font-bold text-black mb-8">Meet the Team</h2>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
						Our diverse team brings together expertise in software engineering,
						design, and community building. We are united by a commitment to
						excellence and innovation.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
						{team.map((member) => (
							<div
								key={member.name}
								className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-orange-200"
							>
								{/* Profile Image */}
								<div className="mb-6 mx-auto w-20 h-20">
									<Image
										src={member.image}
										alt={member.name}
										width={80}
										height={80}
										className="w-20 h-20 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-all duration-300"
									/>
								</div>
								<h3 className="text-xl font-bold text-black mb-2">
									{member.name}
								</h3>
								<p className="text-gray-600 font-medium">{member.role}</p>
							</div>
						))}
					</div>
				</section>
				{/* Call to Action */}
				<section className="text-center">
					<div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-10 text-white shadow-2xl">
						<h2 className="text-3xl font-bold mb-4">
							Ready to Join the Future of Club Management?
						</h2>
						<p className="text-orange-100 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
							Start your journey with ClubSync today and transform how your
							organization manages clubs, events, and volunteers.
						</p>
						<a
							href="/register"
							className="inline-block bg-white text-orange-500 font-semibold py-4 px-8 rounded-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
						>
							Register Now
						</a>
					</div>
				</section>

				<footer className="text-center text-gray-500 mt-16 pt-8 border-t border-gray-200">
					<p>&copy; {new Date().getFullYear()} ClubSync. All rights reserved.</p>
				</footer>
			</main>

			{/* Custom Animations */}
			<style jsx>{`
				@keyframes gradient {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}
				.animate-gradient {
					animation: gradient 4s ease infinite;
				}
				.bg-300\\% {
					background-size: 300% 300%;
				}
			`}</style>
		</div>
	);
}