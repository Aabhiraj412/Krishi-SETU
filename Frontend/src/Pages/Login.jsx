import { useState } from "react";
import { FaSeedling, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import useStore from "../Store/Store";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { SuccessAlert, ErrorAlert } from "../Components/Alert";

const Login = () => {
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });
    const [alert, setAlert] = useState(null);
    const nav = useNavigate();
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { isDarkMode, setData } = useStore();
    const { t } = useLanguage();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const data = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/user/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                    credentials: "include",
                }
            );
            const res = await data.json();
            if (res._id) {
                setData(res);
                setAlert({
                    type: "success",
                    title: "Success!",
                    message: "Login successful. Redirecting...",
                });
                setTimeout(() => {
                    nav("/profile");
                }, 1500);
            } else {
                setAlert({
                    type: "error",
                    title: "Login Failed",
                    message:
                        res.message || "Invalid credentials. Please try again.",
                });
                setFormData({ ...formData, password: "" });
            }
        } catch (error) {
            console.error("Login error:", error);
            setAlert({
                type: "error",
                title: "Error",
                message:
                    "An unexpected error occurred. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* UseIt1 Theme CSS - Matching Chat Theme */}
            <style>
                {`
                /* UseIt1 Glass Effects - Advanced */
                .useit1-login-glass {
                    background: ${isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.25)'};
                    border: 2px solid rgba(34, 197, 94, 0.3);
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.6), 
                        0 0 0 1px rgba(34, 197, 94, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .useit1-login-glass::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.15), transparent);
                    transition: left 1s ease;
                }

                .useit1-login-glass:hover {
                    border: 2px solid rgba(34, 197, 94, 0.6);
                    box-shadow: 
                        0 35px 70px -12px rgba(34, 197, 94, 0.4), 
                        0 0 0 1px rgba(34, 197, 94, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    transform: translateY(-8px);
                }

                .useit1-login-glass:hover::before {
                    left: 100%;
                }

                /* UseIt1 Input Advanced Styling */
                .useit1-input {
                    background: ${isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'};
                    border: 2px solid rgba(34, 197, 94, 0.2);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 
                        0 4px 15px rgba(34, 197, 94, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    position: relative;
                }

                .useit1-input::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.3), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .useit1-input:focus {
                    background: ${isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.95)'};
                    border: 2px solid #22c55e;
                    box-shadow: 
                        0 0 0 4px rgba(34, 197, 94, 0.15), 
                        0 8px 25px rgba(34, 197, 94, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    transform: scale(1.02);
                    outline: none;
                }

                .useit1-input:focus::before {
                    opacity: 1;
                }

                .useit1-input.error {
                    border: 2px solid #ef4444;
                    box-shadow: 
                        0 0 0 4px rgba(239, 68, 68, 0.15),
                        0 4px 15px rgba(239, 68, 68, 0.2);
                    animation: useit1-shake 0.6s ease-in-out;
                }

                @keyframes useit1-shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
                    20%, 40%, 60%, 80% { transform: translateX(8px); }
                }

                /* UseIt1 Button Advanced Animations */
                .useit1-btn-primary {
                    background: linear-gradient(135deg, #22c55e, #34d399, #10b981);
                    background-size: 200% 200%;
                    animation: useit1-gradient-flow 4s ease infinite;
                    box-shadow: 
                        0 10px 30px rgba(34, 197, 94, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: none;
                    position: relative;
                    overflow: hidden;
                }

                .useit1-btn-primary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    transition: left 0.6s ease;
                }

                .useit1-btn-primary::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    padding: 2px;
                    background: linear-gradient(135deg, #22c55e, #34d399, #10b981);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .useit1-btn-primary:hover:not(:disabled) {
                    background: linear-gradient(135deg, #16a34a, #22c55e, #059669);
                    transform: translateY(-4px);
                    box-shadow: 
                        0 20px 40px rgba(34, 197, 94, 0.6),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3);
                }

                .useit1-btn-primary:hover:not(:disabled)::before {
                    left: 100%;
                }

                .useit1-btn-primary:hover:not(:disabled)::after {
                    opacity: 1;
                }

                .useit1-btn-primary:active {
                    transform: translateY(-2px);
                }

                .useit1-btn-primary:disabled {
                    background: linear-gradient(135deg, #9ca3af, #d1d5db);
                    box-shadow: 0 4px 15px rgba(156, 163, 175, 0.3);
                    cursor: not-allowed;
                    animation: none;
                }

                @keyframes useit1-gradient-flow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                /* UseIt1 Logo Advanced Animation */
                .useit1-logo {
                    background: ${isDarkMode 
                        ? 'linear-gradient(135deg, rgba(34,197,94,0.4), rgba(16,185,129,0.4))' 
                        : 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.15))'};
                    border: 3px solid rgba(34, 197, 94, 0.5);
                    box-shadow: 
                        0 15px 35px rgba(34, 197, 94, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    animation: useit1-logo-float 3s ease-in-out infinite;
                    position: relative;
                    overflow: hidden;
                }

                .useit1-logo::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: conic-gradient(
                        from 0deg,
                        transparent,
                        rgba(34, 197, 94, 0.3),
                        transparent,
                        rgba(34, 197, 94, 0.3),
                        transparent
                    );
                    animation: useit1-logo-spin 4s linear infinite;
                }

                @keyframes useit1-logo-float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-10px) scale(1.05); }
                }

                @keyframes useit1-logo-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* UseIt1 Background Advanced */
                .useit1-login-bg {
                    background: ${isDarkMode 
                        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%)' 
                        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #ecfdf5 70%, #f0fdf4 100%)'};
                    position: relative;
                    min-height: 100vh;
                    overflow: hidden;
                }

                .useit1-login-bg::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 70%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                        radial-gradient(circle at 90% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
                    pointer-events: none;
                    animation: useit1-bg-flow 25s ease-in-out infinite;
                }

                .useit1-login-bg::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                    pointer-events: none;
                    animation: useit1-pattern-drift 30s linear infinite;
                }

                @keyframes useit1-bg-flow {
                    0%, 100% { 
                        background: 
                            radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 40% 70%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                            radial-gradient(circle at 90% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
                    }
                    25% { 
                        background: 
                            radial-gradient(circle at 80% 10%, rgba(34, 197, 94, 0.12) 0%, transparent 50%),
                            radial-gradient(circle at 30% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 10% 60%, rgba(34, 197, 94, 0.15) 0%, transparent 50%);
                    }
                    50% { 
                        background: 
                            radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 20% 40%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
                            radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 40% 90%, rgba(34, 197, 94, 0.15) 0%, transparent 50%);
                    }
                    75% { 
                        background: 
                            radial-gradient(circle at 10% 30%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
                    }
                }

                @keyframes useit1-pattern-drift {
                    from { transform: translateX(0) translateY(0); }
                    to { transform: translateX(-60px) translateY(-60px); }
                }

                /* UseIt1 Form Animation */
                .useit1-form-container {
                    animation: useit1-form-slide 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes useit1-form-slide {
                    from {
                        opacity: 0;
                        transform: translateY(60px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* UseIt1 Input Icons */
                .useit1-input-icon {
                    color: #22c55e;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.3));
                }

                .useit1-input:focus ~ .useit1-input-icon,
                .useit1-input-icon.focused {
                    color: #16a34a;
                    transform: scale(1.15);
                    filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.5));
                }

                /* UseIt1 Links Advanced */
                .useit1-link {
                    color: #22c55e;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    display: inline-block;
                }

                .useit1-link::before {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(to right, #22c55e, #34d399);
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }

                .useit1-link::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(34, 197, 94, 0.1);
                    border-radius: 4px;
                    opacity: 0;
                    transform: scale(0.8);
                    transition: all 0.3s ease;
                    z-index: -1;
                }

                .useit1-link:hover {
                    color: #16a34a;
                    transform: translateY(-1px);
                }

                .useit1-link:hover::before {
                    width: 100%;
                }

                .useit1-link:hover::after {
                    opacity: 1;
                    transform: scale(1.1);
                }

                /* UseIt1 Checkbox Advanced */
                .useit1-checkbox {
                    accent-color: #22c55e;
                    transform: scale(1.2);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    filter: drop-shadow(0 2px 4px rgba(34, 197, 94, 0.2));
                }

                .useit1-checkbox:hover {
                    transform: scale(1.35);
                    filter: drop-shadow(0 4px 8px rgba(34, 197, 94, 0.4));
                }

                .useit1-checkbox:checked {
                    filter: drop-shadow(0 4px 8px rgba(34, 197, 94, 0.6));
                }

                /* UseIt1 Loading Spinner Advanced */
                .useit1-spinner {
                    animation: useit1-spin 1.2s linear infinite;
                    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
                }

                @keyframes useit1-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* UseIt1 Error States */
                .useit1-error {
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    animation: useit1-error-fade 0.3s ease;
                }

                @keyframes useit1-error-fade {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>

            <div className="useit1-login-bg">
                <Navbar />

               

                {alert &&
                    (alert.type === "success" ? (
                        <SuccessAlert
                            title={alert.title}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    ) : (
                        <ErrorAlert
                            title={alert.title}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    ))}

                <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="useit1-login-glass useit1-form-container max-w-md w-full p-10 rounded-3xl">
                        {/* Logo and Title */}
                        <div className="flex flex-col items-center">
                            <div className="useit1-logo flex items-center justify-center w-24 h-24 rounded-full relative">
                                <FaSeedling 
                                    className="text-5xl text-green-500 relative z-10" 
                                    style={{ filter: 'drop-shadow(0 4px 8px rgba(34, 197, 94, 0.3))' }}
                                />
                            </div>
                            <h2 className="mt-8 text-4xl font-extrabold text-center"
                                style={{
                                    color: isDarkMode ? 'white' : '#111827',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                             {t("welcomeBack")} {/* use the key from your language JSON */}
                            </h2>
                            <p className="mt-3 text-lg text-center"
                                style={{
                                    color: isDarkMode ? '#d1d5db' : '#6b7280',
                                    opacity: 0.9
                                }}>
                                {t("signInToContinue")} {/* use the    key from your language JSON */}
                            </p>
                        </div>

                        {/* Login Form */}
                        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
                            {/* Phone Number Field */}
                            <div>
                                <label htmlFor="phone" className="block text-base font-semibold mb-3"
                                    style={{
                                        color: isDarkMode ? '#e5e7eb' : '#374151'
                                    }}>
                                   {t("phoneNumber")} 
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaPhone
                                         className="h-6 w-6 useit1-input-icon" 
                                        />
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`useit1-input ${errors.phone ? 'error' : ''} block w-full pl-12 pr-4 py-4 rounded-xl text-lg`}
                                        style={{
                                            color: isDarkMode ? 'white' : '#111827',
                                        }}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="useit1-error">{errors.phone}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-base font-semibold mb-3"
                                    style={{
                                        color: isDarkMode ? '#e5e7eb' : '#374151'
                                    }}>
                                    {t("password")}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="h-6 w-6 useit1-input-icon" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`useit1-input ${errors.password ? 'error' : ''} block w-full pl-12 pr-12 py-4 rounded-xl text-lg`}
                                        style={{
                                            color: isDarkMode ? 'white' : '#111827',
                                        }}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-6 w-6 useit1-input-icon" />
                                        ) : (
                                            <FaEye className="h-6 w-6 useit1-input-icon" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="useit1-error">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="useit1-checkbox h-5 w-5 rounded cursor-pointer"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-3 text-base cursor-pointer"
                                        style={{
                                            color: isDarkMode ? '#e5e7eb' : '#374151',
                                        }}
                                    >
                                       {t("rememberMe")}
                                    </label>
                                </div>
                                <div>
                                    <a href="#" className="useit1-link text-base font-medium">
                                      {t("forgotPassword")}  
                                    </a>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="useit1-btn-primary w-full flex justify-center py-4 px-4 rounded-xl text-white font-bold text-lg"
                                >
                                    {isLoading ? (
                                        <svg
                                            className="useit1-spinner h-7 w-7 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        t("signIn")
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Sign up link */}
                        <div className="mt-8 text-center">
                            <p className="text-base"
                                style={{
                                    color: isDarkMode ? '#d1d5db' : '#6b7280'
                                }}>
                                Don't have an account?{" "}
                                <a href="/signin" className="useit1-link font-semibold">
                                   {t("signUpNow")}                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
