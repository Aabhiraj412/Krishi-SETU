import { useState } from "react";
import {
	FaSun,
	FaMoon,
	FaGlobe,
	FaSeedling,
	FaUser,
	FaComments,
} from "react-icons/fa";
import useStore from "../Store/Store";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	const nav = useNavigate();
	const { isDarkMode, toggleDarkMode, lang, setLang, data } = useStore();
	const [language, setLanguage] = useState(lang);
	const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

	const languages = [
		{ code: "en", name: "English" },
		{ code: "hi", name: "हिंदी" },
		{ code: "ml", name: "മലയാളം" },

	];

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 ${
				isDarkMode ? "bg-gray-800" : "bg-white"
			} shadow-md transition-colors duration-200`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						{/* Logo */}
						<div
							className="flex items-center space-x-2"
							onClick={() => nav("/")}
							style={{ cursor: "pointer" }}
						>
							{/* <img
                src="/krishi-setu-logo.png"
                alt="Krishi SETU"
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              /> */}

							<FaSeedling className="text-green-500 text-2xl" />
							<span
								className={`font-bold text-lg ${
									isDarkMode ? "text-white" : "text-gray-900"
								}`}
							>
								Krishi SETU
							</span>
						</div>
					</div>

					{/* Right side controls */}
					<div className="flex items-center space-x-4">
						{/* Language Selector */}
						<div className="relative">
							<button
								onClick={() =>
									setIsLangMenuOpen(!isLangMenuOpen)
								}
								className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
									isDarkMode
										? "hover:bg-gray-700 text-gray-300"
										: "hover:bg-gray-100 text-gray-700"
								}`}
							>
								<FaGlobe className="h-5 w-5" />
								<span className="text-sm font-medium">
									{languages.find(
										(lang) => lang.code === language
									)?.name || "English"}
								</span>
							</button>

							{/* Language Dropdown */}
							{isLangMenuOpen && (
								<div
									className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
										isDarkMode
											? "bg-gray-700 ring-1 ring-black ring-opacity-5"
											: "bg-white ring-1 ring-black ring-opacity-5"
									}`}
								>
									{languages.map((lang) => (
										<button
											key={lang.code}
											onClick={() => {
												setLanguage(lang.code);
												setLang(lang.code);
												setIsLangMenuOpen(false);
											}}
											className={`block w-full text-left px-4 py-2 text-sm ${
												isDarkMode
													? "text-gray-300 hover:bg-gray-600"
													: "text-gray-700 hover:bg-gray-100"
											} ${
												language === lang.code
													? "font-semibold"
													: ""
											}`}
										>
											{lang.name}
										</button>
									))}
								</div>
							)}
						</div>

						{/* Theme Toggle */}
						<button
							onClick={toggleDarkMode}
							className={`p-2 rounded-lg transition-colors duration-200 ${
								isDarkMode
									? "hover:bg-gray-700 text-yellow-400"
									: "hover:bg-gray-100 text-gray-600"
							}`}
							aria-label="Toggle theme"
						>
							{isDarkMode ? (
								<FaSun className="h-5 w-5" />
							) : (
								<FaMoon className="h-5 w-5" />
							)}
						</button>

						{/* Profile Section */}
						{data ? (
							<div className="relative group">
								<button
									className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
										isDarkMode
											? "hover:bg-gray-700 text-gray-300"
											: "hover:bg-gray-100 text-gray-700"
									}`}
								>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center ${
											isDarkMode
												? "bg-gray-700"
												: "bg-gray-200"
										}`}
									>
										{data.name?.charAt(0).toUpperCase()}
									</div>
								</button>

								<div
									className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 invisible group-hover:visible ${
										isDarkMode ? "bg-gray-700" : "bg-white"
									} ring-1 ring-black ring-opacity-5`}
								>
									<button
										onClick={() => nav("/profile")}
										className={`flex items-center w-full px-4 py-2 text-sm ${
											isDarkMode
												? "text-gray-300 hover:bg-gray-600"
												: "text-gray-700 hover:bg-gray-100"
										}`}
									>
										<FaUser className="mr-3" />
										Profile
									</button>
									<button
										onClick={() => nav("/chat")}
										className={`flex items-center w-full px-4 py-2 text-sm ${
											isDarkMode
												? "text-gray-300 hover:bg-gray-600"
												: "text-gray-700 hover:bg-gray-100"
										}`}
									>
										<FaComments className="mr-3" />
										Chat
									</button>
								</div>
							</div>
						) : (
							<div className="flex items-center space-x-2">
								<button
									onClick={() => nav("/login")}
									className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
								>
									Login
								</button>
								<button
									onClick={() => nav("/signin")}
									className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
										isDarkMode
											? "border-gray-600 text-gray-300 hover:bg-gray-700"
											: "border-gray-300 text-gray-700 hover:bg-gray-100"
									}`}
								>
									Sign up
								</button>
							</div>
						)}
            
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
