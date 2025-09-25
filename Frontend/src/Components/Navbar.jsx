import { useState, useRef, useEffect } from "react";
import { FaSun, FaMoon, FaGlobe, FaSeedling, FaUser, FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useStore from "../Store/Store";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const nav = useNavigate();
  const { isDarkMode, toggleDarkMode, data } = useStore();
  const { lang, setLang, t } = useLanguage();

  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileRef = useRef();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "ml", name: "മലയാളം" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => nav("/")}>
              <FaSeedling className="text-green-500 text-2xl" />
              <span className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>Krishi SETU</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FaGlobe className="h-5 w-5" />
                <span className="text-sm font-medium">{languages.find((l) => l.code === lang)?.name || "English"}</span>
              </button>

              {languageMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${isDarkMode ? "bg-gray-700 ring-1 ring-black ring-opacity-5" : "bg-white ring-1 ring-black ring-opacity-5"}`}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLanguageMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"
                      } ${lang === l.code ? "font-semibold" : ""}`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? "hover:bg-gray-700 text-yellow-400" : "hover:bg-gray-100 text-gray-600"}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>

            {/* Profile Section */}
            {data ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    {data.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${isDarkMode ? "bg-gray-700" : "bg-white"} ring-1 ring-black ring-opacity-5`}>
                    <button
                      onClick={() => {
                        nav("/profile");
                        setProfileMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm ${isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      <FaUser className="mr-3" />
                      {t("profile")}
                    </button>
                    <button
                      onClick={() => {
                        nav("/chat");
                        setProfileMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm ${isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      <FaComments className="mr-3" />
                      {t("chat")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => nav("/login")}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                >
                  {t("login")}
                </button>
                <button
                  onClick={() => nav("/signin")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {t("signup")}
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
