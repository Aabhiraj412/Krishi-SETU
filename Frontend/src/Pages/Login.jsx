import { useState } from "react";
import { FaSeedling, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import useStore from "../Store/Store";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		// Phone validation
		if (!formData.phone) {
			newErrors.phone = "Phone number is required";
		} else if (!/^[0-9]{10}$/.test(formData.phone)) {
			newErrors.phone = "Please enter a valid 10-digit phone number";
		}

		// Password validation
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
		<div>
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
			<div
				className={`min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 ${
					isDarkMode ? "bg-gray-900" : "bg-gray-50"
				}`}
			>
				<div
					className={`max-w-md w-full space-y-8 ${
						isDarkMode ? "bg-gray-800" : "bg-white"
					} p-8 rounded-2xl shadow-xl transition-all duration-300`}
				>
					{/* Logo and Title */}
					<div className="flex flex-col items-center">
						<div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
							<FaSeedling className="text-3xl text-green-500" />
						</div>
						<h2
							className={`mt-6 text-3xl font-extrabold ${
								isDarkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Welcome Back
						</h2>
						<p
							className={`mt-2 text-sm ${
								isDarkMode ? "text-gray-400" : "text-gray-600"
							}`}
						>
							Sign in to continue to Krishi SETU
						</p>
					</div>

					{/* Login Form */}
					<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
						{/* Phone Number Field */}
						<div>
							<label
								htmlFor="phone"
								className={`block text-sm font-medium ${
									isDarkMode
										? "text-gray-300"
										: "text-gray-700"
								}`}
							>
								Phone Number
							</label>
							<div className="mt-1 relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FaPhone
										className={`h-5 w-5 ${
											isDarkMode
												? "text-gray-500"
												: "text-gray-400"
										}`}
									/>
								</div>
								<input
									id="phone"
									name="phone"
									type="tel"
									required
									value={formData.phone}
									onChange={handleChange}
									className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
										errors.phone
											? "border-red-500"
											: isDarkMode
											? "border-gray-600"
											: "border-gray-300"
									} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
										isDarkMode
											? "bg-gray-700 text-white"
											: "bg-white text-gray-900"
									}`}
									placeholder="Enter your phone number"
								/>
							</div>
							{errors.phone && (
								<p className="mt-2 text-sm text-red-500">
									{errors.phone}
								</p>
							)}
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className={`block text-sm font-medium ${
									isDarkMode
										? "text-gray-300"
										: "text-gray-700"
								}`}
							>
								Password
							</label>
							<div className="mt-1 relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FaLock
										className={`h-5 w-5 ${
											isDarkMode
												? "text-gray-500"
												: "text-gray-400"
										}`}
									/>
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									value={formData.password}
									onChange={handleChange}
									className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
										errors.password
											? "border-red-500"
											: isDarkMode
											? "border-gray-600"
											: "border-gray-300"
									} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
										isDarkMode
											? "bg-gray-700 text-white"
											: "bg-white text-gray-900"
									}`}
									placeholder="Enter your password"
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									{showPassword ? (
										<FaEyeSlash
											className={`h-5 w-5 ${
												isDarkMode
													? "text-gray-500"
													: "text-gray-400"
											}`}
										/>
									) : (
										<FaEye
											className={`h-5 w-5 ${
												isDarkMode
													? "text-gray-500"
													: "text-gray-400"
											}`}
										/>
									)}
								</button>
							</div>
							{errors.password && (
								<p className="mt-2 text-sm text-red-500">
									{errors.password}
								</p>
							)}
						</div>

						{/* Remember me & Forgot password */}
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
								/>
								<label
									htmlFor="remember-me"
									className={`ml-2 block text-sm ${
										isDarkMode
											? "text-gray-300"
											: "text-gray-700"
									}`}
								>
									Remember me
								</label>
							</div>

							<div>
								<a
									href="#"
									className="text-sm text-green-500 hover:text-green-400"
								>
									Forgot your password?
								</a>
							</div>
						</div>

						{/* Submit Button */}
						<div>
							<button
								type="submit"
								disabled={isLoading}
								className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
									isLoading
										? "opacity-75 cursor-not-allowed"
										: ""
								}`}
							>
								{isLoading ? (
									<svg
										className="animate-spin h-5 w-5 text-white"
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
									"Sign in"
								)}
							</button>
						</div>
					</form>

					{/* Sign up link */}
					<div className="mt-6 text-center">
						<p
							className={`text-sm ${
								isDarkMode ? "text-gray-400" : "text-gray-600"
							}`}
						>
							Don't have an account?{" "}
							<a
								href="/signin"
								className="font-medium text-green-500 hover:text-green-400"
							>
								Sign up now
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
