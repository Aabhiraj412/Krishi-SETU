import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
	FaSeedling,
	FaLock,
	FaPhone,
	FaUser,
	FaMapMarkerAlt,
	FaEye,
	FaEyeSlash,
	FaThermometerHalf,
	FaWind,
	FaTint,
} from "react-icons/fa";
import Navbar from "../Components/Navbar";
import useStore from "../Store/Store";
import { ErrorAlert, SuccessAlert }  from "../Components/Alert";
import { Link, useNavigate } from "react-router-dom";
import { indianCities } from "../data/indianCities";
import { fetchWeatherData } from "../services/weatherService";

const Signin = () => {
	useEffect(() => {
		console.log("Available cities:", indianCities);
	}, []);
    
    const nav = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		location: "",
		locationData: null, // Will store coordinates and weather data
		password: "",
		confirm_password: "",
	});
	const [searchTerm, setSearchTerm] = useState("");
	const [alert, setAlert] = useState(null);
	const [isLoadingLocation, setIsLoadingLocation] = useState(false);
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { isDarkMode, setData } = useStore();
	const { t } = useLanguage();

	const handleChange = async (e) => {
		const { name, value } = e.target;

		// Handle location selection specially
		if (name === "location" && value) {
			const [cityName, stateName] = value.split(", ");
			setIsLoadingLocation(true);
			try {
				// Find the selected city data
				const stateData = indianCities.find(
					(state) => state.state === stateName
				);
				const cityData = stateData?.cities.find(
					(city) => city.name === cityName
				);

				if (!cityData) {
					throw new Error("City not found in database");
				}

				const weatherData = await fetchWeatherData(cityName);
				setFormData((prev) => ({
					...prev,
					location: value,
					locationData: {
						city: cityName,
						state: stateName,
						coordinates: {
							latitude: cityData.latitude,
							longitude: cityData.longitude,
						},
						weather: weatherData,
					},
				}));
			} catch (error) {
				console.error("Error fetching data:", error);
				setErrors((prev) => ({
					...prev,
					location: "Error fetching weather data. Please try again.",
				}));
				setFormData((prev) => ({
					...prev,
					location: value,
					locationData: null,
				}));
			} finally {
				setIsLoadingLocation(false);
			}
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}

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

		// Name validation
		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		} else if (formData.name.trim().length < 3) {
			newErrors.name = "Name must be at least 3 characters";
		}

		// Phone validation
		if (!formData.phone) {
			newErrors.phone = "Phone number is required";
		} else if (!/^[0-9]{10}$/.test(formData.phone)) {
			newErrors.phone = "Please enter a valid 10-digit phone number";
		}

		// Location validation
		if (!formData.location.trim()) {
			newErrors.location = "Location is required";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		// Confirm password validation
		if (!formData.confirm_password) {
			newErrors.confirm_password = "Please confirm your password";
		} else if (formData.password !== formData.confirm_password) {
			newErrors.confirm_password = "Passwords do not match";
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
				`${import.meta.env.VITE_API_URL}/api/auth/user/register`,
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
			if (res.newUser) {
				setData(res.newUser);
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

	const inputClasses = (fieldName) => `
    appearance-none block w-full pl-10 pr-3 py-2 border 
    ${
		errors[fieldName]
			? "border-red-500"
			: isDarkMode
			? "border-gray-600"
			: "border-gray-300"
	}
    rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
    ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}
  `;

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
						{t("createAccount")} 
						</h2>
						<p
							className={`mt-2 text-sm ${
								isDarkMode ? "text-gray-400" : "text-gray-600"
							}`}
						>
							{t("joinKrishiToday")} 
						</p>
					</div>

					{/* Signup Form */}
					<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
						{/* Name Field */}
						<div>
							<label
								htmlFor="name"
								className={`block text-sm font-medium ${
									isDarkMode
										? "text-gray-300"
										: "text-gray-700"
								}`}
							>
							{t("fullName")}	
							</label>
							<div className="mt-1 relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FaUser
										className={`h-5 w-5 ${
											isDarkMode
												? "text-gray-500"
												: "text-gray-400"
										}`}
									/>
								</div>
								<input
									id="name"
									name="name"
									type="text"
									required
									value={formData.name}
									onChange={handleChange}
									className={inputClasses("name")}
									placeholder="Enter your full name"
								/>
							</div>
							{errors.name && (
								<p className="mt-2 text-sm text-red-500">
									{errors.name}
								</p>
							)}
						</div>

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
							{t("phoneNumber")}
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
									className={inputClasses("phone")}
									placeholder="Enter your phone number"
								/>
							</div>
							{errors.phone && (
								<p className="mt-2 text-sm text-red-500">
									{errors.phone}
								</p>
							)}
						</div>

						{/* Location Field */}
						<div>
							<label
								htmlFor="location"
								className={`block text-sm font-medium ${
									isDarkMode
										? "text-gray-300"
										: "text-gray-700"
								}`}
							>
							{t("location")}
							</label>
							<div className="mt-1">
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaMapMarkerAlt
											className={`h-5 w-5 ${
												isDarkMode
													? "text-gray-500"
													: "text-gray-400"
											}`}
										/>
									</div>
									<input
										type="text"
										id="location"
										name="location"
										required
										placeholder="Type to search for your city..."
										value={formData.location}
										onChange={(e) => {
											const value = e.target.value;
											setFormData((prev) => ({
												...prev,
												location: value,
												locationData: null,
											}));
											requestAnimationFrame(() => {
												setSearchTerm(value);
											});
										}}
										className={`${inputClasses(
											"location"
										)}`}
										autoComplete="off"
									/>
									{formData.location && (
										<button
											type="button"
											className="absolute inset-y-0 right-0 pr-3 flex items-center"
											onClick={() => {
												setFormData((prev) => ({
													...prev,
													location: "",
													locationData: null,
												}));
												setSearchTerm("");
											}}
										>
											<svg
												className={`h-4 w-4 ${
													isDarkMode
														? "text-gray-500"
														: "text-gray-400"
												}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</button>
									)}
								</div>

								{searchTerm && (
									<div
										className={`absolute z-10 w-full mt-1 overflow-hidden rounded-md shadow-lg ${
											isDarkMode
												? "bg-gray-700"
												: "bg-white"
										}`}
									>
										<div className="max-h-60 overflow-y-auto">
											{indianCities
												.map((state) => {
													const searchLower =
														searchTerm
															.toLowerCase()
															.trim();
													const matchedCities =
														state.cities.filter(
															(city) =>
																city.name
																	.toLowerCase()
																	.includes(
																		searchLower
																	) ||
																state.state
																	.toLowerCase()
																	.includes(
																		searchLower
																	)
														);

													return matchedCities.length >
														0 ? (
														<div
															key={
																state.stateCode
															}
														>
															<div
																className={`px-3 py-1 text-sm font-semibold ${
																	isDarkMode
																		? "text-gray-300 bg-gray-600"
																		: "text-gray-600 bg-gray-100"
																}`}
															>
																{state.state}
															</div>
															{matchedCities.map(
																(city) => (
																	<div
																		key={
																			city.id
																		}
																		className={`px-4 py-2 cursor-pointer ${
																			isDarkMode
																				? "hover:bg-gray-600 text-gray-200"
																				: "hover:bg-gray-100 text-gray-900"
																		}`}
																		onClick={async () => {
																			const locationValue = `${city.name}, ${state.state}`;
																			setSearchTerm(
																				""
																			);
																			const event =
																				{
																					target: {
																						name: "location",
																						value: locationValue,
																					},
																				};
																			await handleChange(
																				event
																			);
																		}}
																	>
																		<div className="flex items-center">
																			<span className="flex-grow">
																				{
																					city.name
																				}
																			</span>
																			<span
																				className={`text-sm ${
																					isDarkMode
																						? "text-gray-400"
																						: "text-gray-500"
																				}`}
																			>
																				{
																					state.state
																				}
																			</span>
																		</div>
																	</div>
																)
															)}
														</div>
													) : null;
												})
												.filter(Boolean)}
										</div>
									</div>
								)}
							</div>
							{isLoadingLocation && (
								<div className="mt-2 text-sm text-gray-500">
									<div className="flex items-center space-x-2">
										<svg
											className="animate-spin h-4 w-4"
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
										<span>Fetching location data...</span>
									</div>
								</div>
							)}
							{formData.locationData && !isLoadingLocation && (
								<div
									className={`mt-4 p-4 rounded-xl ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-100"
									} shadow-sm transition-all duration-200`}
								>
									<div className="flex items-center mb-3">
										{formData.locationData.weather.icon && (
											<img
												src={
													formData.locationData
														.weather.icon
												}
												alt="Weather Icon"
												className="w-12 h-12 mr-3"
											/>
										)}
										<div>
											<h3
												className={`text-lg font-semibold ${
													isDarkMode
														? "text-white"
														: "text-gray-800"
												}`}
											>
												{
													formData.locationData
														.weather.condition
												}
											</h3>
											<p
												className={`text-sm ${
													isDarkMode
														? "text-gray-400"
														: "text-gray-600"
												}`}
											>
												{formData.locationData.city},{" "}
												{formData.locationData.state}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div
											className={`p-3 rounded-lg ${
												isDarkMode
													? "bg-gray-600"
													: "bg-white"
											}`}
										>
											<div className="flex items-center">
												<FaThermometerHalf className="text-red-500 mr-2" />
												<div>
													<p
														className={`text-sm ${
															isDarkMode
																? "text-gray-400"
																: "text-gray-600"
														}`}
													>
														Temperature
													</p>
													<p
														className={`text-lg font-semibold ${
															isDarkMode
																? "text-white"
																: "text-gray-800"
														}`}
													>
														{
															formData
																.locationData
																.weather
																.temperature
														}
														°C
													</p>
													<p
														className={`text-xs ${
															isDarkMode
																? "text-gray-500"
																: "text-gray-400"
														}`}
													>
														Feels like{" "}
														{
															formData
																.locationData
																.weather
																.feelsLike
														}
														°C
													</p>
												</div>
											</div>
										</div>

										<div
											className={`p-3 rounded-lg ${
												isDarkMode
													? "bg-gray-600"
													: "bg-white"
											}`}
										>
											<div className="flex items-center">
												<FaTint className="text-blue-500 mr-2" />
												<div>
													<p
														className={`text-sm ${
															isDarkMode
																? "text-gray-400"
																: "text-gray-600"
														}`}
													>
														Humidity
													</p>
													<p
														className={`text-lg font-semibold ${
															isDarkMode
																? "text-white"
																: "text-gray-800"
														}`}
													>
														{
															formData
																.locationData
																.weather
																.humidity
														}
														%
													</p>
												</div>
											</div>
										</div>

										<div
											className={`p-3 rounded-lg ${
												isDarkMode
													? "bg-gray-600"
													: "bg-white"
											}`}
										>
											<div className="flex items-center">
												<FaWind className="text-green-500 mr-2" />
												<div>
													<p
														className={`text-sm ${
															isDarkMode
																? "text-gray-400"
																: "text-gray-600"
														}`}
													>
														Wind Speed
													</p>
													<p
														className={`text-lg font-semibold ${
															isDarkMode
																? "text-white"
																: "text-gray-800"
														}`}
													>
														{
															formData
																.locationData
																.weather
																.windSpeed
														}{" "}
														km/h
													</p>
												</div>
											</div>
										</div>

										<div
											className={`p-3 rounded-lg ${
												isDarkMode
													? "bg-gray-600"
													: "bg-white"
											}`}
										>
											<div>
												<p
													className={`text-sm ${
														isDarkMode
															? "text-gray-400"
															: "text-gray-600"
													}`}
												>
													Last Updated
												</p>
												<p
													className={`text-sm font-medium ${
														isDarkMode
															? "text-gray-300"
															: "text-gray-700"
													}`}
												>
													{
														formData.locationData
															.weather.lastUpdated
													}
												</p>
											</div>
										</div>
									</div>
								</div>
							)}
							{errors.location && (
								<p className="mt-2 text-sm text-red-500">
									{errors.location}
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
							{t("password")}	
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
									className={inputClasses("password")}
									placeholder="Create a password"
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

						{/* Confirm Password Field */}
						<div>
							<label
								htmlFor="confirm_password"
								className={`block text-sm font-medium ${
									isDarkMode
										? "text-gray-300"
										: "text-gray-700"
								}`}
							>
							{t("confirmPassword")}							</label>
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
									id="confirm_password"
									name="confirm_password"
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									required
									value={formData.confirm_password}
									onChange={handleChange}
									className={inputClasses("confirm_password")}
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword
										)
									}
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									{showConfirmPassword ? (
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
							{errors.confirm_password && (
								<p className="mt-2 text-sm text-red-500">
									{errors.confirm_password}
								</p>
							)}
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
									"Create Account"
								)}
							</button>
						</div>
					</form>

					{/* Login link */}
					<div className="mt-6 text-center">
						<p
							className={`text-sm ${
								isDarkMode ? "text-gray-400" : "text-gray-600"
							}`}
						>
						{t("alreadyHaveAccount")}{" "}
							<Link
								to="/login"
								className="font-medium text-green-500 hover:text-green-400"
							>
							{t("signInToContinue")}							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signin;
