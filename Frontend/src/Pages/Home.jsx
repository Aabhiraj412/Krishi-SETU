import React from "react";
import { Link } from "react-router-dom";
import {
	FaSun,
	FaMoon,
	FaTractor,
	FaSeedling,
	FaLeaf,
	FaRobot,
	FaLanguage,
	FaMicrophone,
	FaDatabase,
	FaCloud,
	FaBrain,
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BsChatDotsFill } from "react-icons/bs";
import useStore from "../Store/Store";
import Navbar from "../Components/Navbar";

const Home = () => {
	const { isDarkMode, toggleDarkMode } = useStore();
	const [selectedLanguage, setSelectedLanguage] = React.useState("en");
	const selectRef = React.useRef(null);

	const languages = [
		{ code: "en", name: "English" },
		{ code: "hi", name: "हिंदी" },
		{ code: "ml", name: "മലയാളം" },

	];

	const features = [
		{ icon: FaLanguage, text: "Multi-Language Support" },
		{ icon: FaMicrophone, text: "Voice Queries" },
		{ icon: FaBrain, text: "AI-Powered Solutions" },
		{ icon: IoLocationSharp, text: "Location-Aware" },
	];

	return (
		<div
			className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
				isDarkMode
					? "bg-gray-900 text-white"
					: "bg-gray-50 text-gray-900"
			}`}
		>
			{/* Decorative Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<FaLeaf
					className={`absolute top-20 left-10 transform rotate-45 ${
						isDarkMode
							? "text-green-200 opacity-20"
							: "text-green-400 opacity-10"
					}`}
					size={80}
				/>
				<FaRobot
					className={`absolute bottom-20 right-10 ${
						isDarkMode
							? "text-blue-200 opacity-20"
							: "text-blue-400 opacity-10"
					}`}
					size={60}
				/>
				<FaCloud
					className={`absolute top-40 right-20 ${
						isDarkMode
							? "text-gray-200 opacity-20"
							: "text-gray-400 opacity-10"
					}`}
					size={70}
				/>
				<div
					className={`absolute -top-32 -left-32 w-64 h-64 rounded-full ${
						isDarkMode
							? "bg-green-500 opacity-5"
							: "bg-green-400 opacity-5"
					}`}
				></div>
				<div
					className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full ${
						isDarkMode
							? "bg-green-500 opacity-5"
							: "bg-green-400 opacity-5"
					}`}
				></div>
			</div>

			{/* Navigation Bar */}
			<Navbar />
			{/* Hero Section */}
			<div className="container mt-12 mx-auto px-4 py-12 relative z-10">
				<div className="text-center mb-12 transform transition-all duration-500">
					<div className="flex items-center justify-center gap-4 mb-6">
						<div className="relative">
							<div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
							<FaBrain className="text-green-500 text-5xl relative" />
						</div>
						<h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-transparent bg-clip-text">
							Krishi SETU
						</h1>
					</div>
					<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
						Your AI-Powered Digital Agriculture Assistant
					</p>
					<div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
						{features.map((feature, index) => (
							<div
								key={index}
								className="p-4 rounded-xl bg-opacity-10 backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300"
							>
								<feature.icon className="text-3xl text-green-500 mx-auto mb-2" />
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									{feature.text}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Mission Statement */}
				<div className="text-center mb-12">
					<p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
						Bridging the gap between farmers and expert knowledge
						through advanced AI technology, providing instant,
						reliable agricultural advice in your local language.
					</p>
				</div>

				{/* Cards Section */}
				<div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-12">
					{/* Farmer Portal Card */}
					<div
						className={`p-8 rounded-3xl shadow-lg transition-all duration-500 transform hover:-translate-y-2 ${
							isDarkMode
								? "bg-gray-800/90 backdrop-blur-sm hover:shadow-green-200/20"
								: "bg-white backdrop-blur-sm hover:shadow-green-500/10"
						}`}
					>
						<div className="text-center">
							<div className="relative inline-block">
								<div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
								<FaTractor className="relative text-5xl text-green-500 mx-auto mb-6" />
							</div>
							<h3 className="text-2xl md:text-3xl font-bold text-green-500 mb-4">
								Farmer Portal
							</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-8">
								Access personalized agricultural advice and
								support
							</p>
							<div className="flex flex-col gap-4">
								<Link
									to="/login"
									className={`py-4 px-8 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
										isDarkMode
											? "bg-gray-700 hover:bg-gray-600 text-white"
											: "bg-gray-100 hover:bg-gray-200 text-gray-900"
									}`}
								>
									Login
								</Link>
								<Link
									to="/signin"
									className="py-4 px-8 rounded-xl font-medium bg-gradient-to-r from-green-500 to-green-400 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
								>
									Sign Up
								</Link>
							</div>
						</div>
					</div>

					{/* AI Features Card */}
					<div
						className={`p-8 rounded-3xl shadow-lg transition-all duration-500 transform hover:-translate-y-2 ${
							isDarkMode
								? "bg-gray-800/90 backdrop-blur-sm hover:shadow-green-200/20"
								: "bg-white backdrop-blur-sm hover:shadow-green-500/10"
						}`}
					>
						<div className="text-center">
							<div className="relative inline-block">
								<div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
								<BsChatDotsFill className="relative text-5xl text-blue-500 mx-auto mb-6" />
							</div>
							<h3 className="text-2xl md:text-3xl font-bold text-blue-500 mb-4">
								AI Assistance
							</h3>
							<div className="space-y-4">
								<div className="p-3 rounded-lg bg-opacity-10 backdrop-blur-sm">
									<FaLanguage className="text-2xl text-blue-500 mx-auto mb-2" />
									<p className="text-sm">
										Ask questions in your local language
									</p>
								</div>
								<div className="p-3 rounded-lg bg-opacity-10 backdrop-blur-sm">
									<FaDatabase className="text-2xl text-blue-500 mx-auto mb-2" />
									<p className="text-sm">
										Access expert agricultural knowledge
									</p>
								</div>
								<div className="p-3 rounded-lg bg-opacity-10 backdrop-blur-sm">
									<IoLocationSharp className="text-2xl text-blue-500 mx-auto mb-2" />
									<p className="text-sm">
										Location-based recommendations
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Home;
