import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	User,
	Phone,
	MapPin,
	Calendar,
	MessageCircle,
	LogOut,
	Thermometer,
	Wind,
	Droplets,
	Cloud,
	AlertTriangle,
	Eye,
	Gauge,
	CloudRain,
	Sun,
	Moon,
	CloudSnow,
	Leaf,
	Clock,
	History,
	BarChart3,
} from "lucide-react";
import useStore from "../Store/Store";
import Navbar from "../Components/Navbar";
import { SuccessAlert, ErrorAlert } from "../Components/Alert";

const Profile = () => {
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState(null);
	const [weather, setWeather] = useState(null);
	const [weatherLoading, setWeatherLoading] = useState(false);
	const { data, isDarkMode, setData } = useStore();
	const navigate = useNavigate();

	// Fetch weather data
	useEffect(() => {
		const fetchWeather = async () => {
			if (!data?.location) return;
			setWeatherLoading(true);
			try {
				const res = await fetch(
					`${import.meta.env.VITE_WEATHER_API_URL}?key=${
						import.meta.env.VITE_WEATHER_API_KEY
					}&q=${data.location}&days=1&aqi=yes&alerts=yes`
				);
				const weatherData = await res.json();
				setWeather(weatherData);
				console.log(weatherData);
			} catch (error) {
				console.error("Error fetching weather:", error);
				setAlert({
					type: "error",
					title: "Error",
					message: "Failed to fetch weather data",
				});
			} finally {
				setWeatherLoading(false);
			}
		};

		fetchWeather();
	}, [data?.location]);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/auth/user/profile`,
					{
						credentials: "include",
					}
				);
				const profileData = await response.json();
				if (profileData._id) {
					setData(profileData);
				}
			} catch (error) {
				console.error("Error fetching profile:", error);
				setAlert({
					type: "error",
					title: "Error",
					message: "Failed to fetch profile data",
				});
			}
		};

		fetchProfile();
	}, [setData]);

	const handleLogout = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/user/logout`,
				{
					method: "POST",
					credentials: "include",
				}
			);
			const result = await response.json();
			if (result.message === "User logged out successfully") {
				setAlert({
					type: "success",
					title: "Success",
					message: "Logged out successfully",
				});
				setData(null);
				setTimeout(() => {
					navigate("/login");
				}, 1500);
			} else {
				throw new Error(result.message || "Logout failed");
			}
		} catch (error) {
			console.error("Logout error:", error);
			setAlert({
				type: "error",
				title: "Error",
				message: error.message || "Failed to logout",
			});
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const formatDateTime = (dateString) => {
		return new Date(dateString).toLocaleString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getAQIStatus = (index) => {
		if (index <= 1)
			return {
				text: "Good",
				color: "text-green-600",
				bg: "bg-green-100",
			};
		if (index <= 2)
			return {
				text: "Moderate",
				color: "text-yellow-600",
				bg: "bg-yellow-100",
			};
		if (index <= 3)
			return {
				text: "Unhealthy for Sensitive",
				color: "text-orange-600",
				bg: "bg-orange-100",
			};
		if (index <= 4)
			return {
				text: "Unhealthy",
				color: "text-red-600",
				bg: "bg-red-100",
			};
		return {
			text: "Very Unhealthy",
			color: "text-purple-600",
			bg: "bg-purple-100",
		};
	};

	if (!data) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen pt-8 px-4 sm:px-6 lg:px-8 ${
				isDarkMode ? "bg-gray-900" : "bg-gray-50"
			}`}
		>
			<Navbar />
			{/* Profile Header */}
			<div
				className={`max-w-6xl mx-auto ${
					isDarkMode ? "bg-gray-800" : "bg-white"
				} shadow-xl rounded-2xl overflow-hidden mb-6`}
			>
				<div className="px-6 py-8">
					<div className="flex items-center justify-center mb-6">
						<div
							className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold ${
								isDarkMode
									? "bg-gray-700 text-white"
									: "bg-gradient-to-br from-green-500 to-green-400 text-white shadow-lg shadow-green-500/25"
							}`}
						>
							{data.name.charAt(0).toUpperCase()}
						</div>
					</div>
					<h1
						className={`text-3xl font-bold text-center mb-2 ${
							isDarkMode ? "text-white" : "text-gray-900"
						}`}
					>
						{data.name}
					</h1>
					<div className={`flex justify-center mt-4`}>
						<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
							<div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
							{data.accountStatus || "Active"}
						</span>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - User Information */}
				<div className="lg:col-span-1 space-y-6">
					{/* Basic Info */}
					<div
						className={`${
							isDarkMode ? "bg-gray-800" : "bg-white"
						} shadow-xl rounded-2xl p-6`}
					>
						<h2
							className={`text-xl font-semibold mb-6 flex items-center ${
								isDarkMode ? "text-gray-200" : "text-gray-800"
							}`}
						>
							<User className="w-5 h-5 mr-2 text-green-500" />
							Personal Information
						</h2>
						<div
							className={`space-y-6 ${
								isDarkMode ? "text-gray-300" : "text-gray-600"
							}`}
						>
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
									<User className="w-5 h-5 text-green-600" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-500">
										Full Name
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-white"
												: "text-gray-900"
										}`}
									>
										{data.name}
									</p>
								</div>
							</div>

							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
									<Phone className="w-5 h-5 text-blue-600" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-500">
										Phone Number
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-white"
												: "text-gray-900"
										}`}
									>
										{data.phone}
									</p>
								</div>
							</div>

							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
									<MapPin className="w-5 h-5 text-green-600" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-500">
										Location
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-white"
												: "text-gray-900"
										}`}
									>
										{data.location}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Account Stats */}
					<div
						className={`${
							isDarkMode ? "bg-gray-800" : "bg-white"
						} shadow-xl rounded-2xl p-6`}
					>
						<h2
							className={`text-xl font-semibold mb-6 flex items-center ${
								isDarkMode ? "text-gray-200" : "text-gray-800"
							}`}
						>
							<BarChart3 className="w-5 h-5 mr-2 text-green-500" />
							Account Statistics
						</h2>
						<div
							className={`space-y-6 ${
								isDarkMode ? "text-gray-300" : "text-gray-600"
							}`}
						>
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
									<Calendar className="w-5 h-5 text-blue-600" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-500">
										Member Since
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-white"
												: "text-gray-900"
										}`}
									>
										{formatDate(data.createdAt)}
									</p>
								</div>
							</div>

							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
									<MessageCircle className="w-5 h-5 text-green-600" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-500">
										Total Chats
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-white"
												: "text-gray-900"
										}`}
									>
										{data.chats?.length || 0}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						<button
							onClick={() => navigate("/chat")}
							className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white bg-gradient-to-r from-green-500 to-green-400 rounded-xl hover:from-green-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:-translate-y-0.5"
						>
							<MessageCircle className="w-5 h-5" />
							<span className="font-semibold">Go to Chat</span>
						</button>
						<button
							onClick={handleLogout}
							disabled={loading}
							// className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white bg-gradient-to-r from-red-600 to-red-500 rounded-xl hover:from-gray-700 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"

							className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white 
             bg-gradient-to-r from-red-500 via-red-600 to-red-700 
             rounded-xl hover:from-red-600 hover:via-red-700 hover:to-red-800 
             transition-all duration-300 shadow-lg hover:shadow-xl 
             transform hover:-translate-y-0.5 
             disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							<LogOut className="w-5 h-5" />
							<span className="font-semibold">
								{loading ? "Logging out..." : "Logout"}
							</span>
						</button>
					</div>
				</div>

				{/* Right Column - Weather Information */}
				<div className="lg:col-span-2 space-y-6">
					{/* Weather Alerts */}
					{weather?.alerts?.alert?.length > 0 && (
						<div
							className={`mt-6 p-4 rounded-lg border-l-4 ${
								isDarkMode
									? "bg-gray-700 border-red-500"
									: "bg-red-50 border-red-600"
							} shadow-sm`}
						>
							<div className="flex items-start">
								<AlertTriangle className="w-6 h-6 text-red-500 mr-3 mt-1" />
								<div>
									<h3
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-red-400"
												: "text-red-700"
										}`}
									>
										Weather Alerts
									</h3>
									<ul className="mt-2 space-y-2">
										{weather.alerts.alert.map(
											(alert, index) => (
												<li key={index}>
													<p
														className={`text-sm ${
															isDarkMode
																? "text-gray-300"
																: "text-gray-800"
														}`}
													>
														<strong>
															{alert.headline}:
														</strong>{" "}
														{alert.desc}
													</p>
													<p
														className={`text-xs mt-1 ${
															isDarkMode
																? "text-gray-400"
																: "text-gray-600"
														}`}
													>
														Effective:{" "}
														{alert.effective} |
														Ends: {alert.expires}
													</p>
												</li>
											)
										)}
									</ul>
								</div>
							</div>
						</div>
					)}

					{/* Current Weather */}
					{weatherLoading ? (
						<div
							className={`${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} shadow-xl rounded-2xl p-6`}
						>
							<div className="flex items-center justify-center py-12">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
								<span className="ml-3 text-gray-600">
									Loading weather data...
								</span>
							</div>
						</div>
					) : weather ? (
						<div
							className={`${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} shadow-xl rounded-2xl p-6`}
						>
							<div className="flex items-center justify-between mb-6">
								<h2
									className={`text-xl font-semibold flex items-center ${
										isDarkMode
											? "text-gray-200"
											: "text-gray-800"
									}`}
								>
									<Cloud className="w-5 h-5 mr-2 text-blue-500" />
									Current Weather - {weather.location.name}
								</h2>
								<div className="flex items-center text-sm text-gray-500">
									<MapPin className="w-4 h-4 mr-1" />
									{weather.location.lat.toFixed(2)},{" "}
									{weather.location.lon.toFixed(2)}
								</div>
							</div>

							{/* Main Weather Display */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
								<div
									className={`text-center p-6 rounded-xl ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gradient-to-br from-green-50 to-green-100"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-green-200"
									}`}
								>
									<Thermometer className="w-8 h-8 mx-auto mb-3 text-green-500" />
									<p
										className={`text-3xl font-bold mb-1 ${
											isDarkMode
												? "text-white"
												: "text-gray-900"
										}`}
									>
										{weather.current.temp_c}°C
									</p>
									<p
										className={`text-sm ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										}`}
									>
										Feels like {weather.current.feelslike_c}
										°C
									</p>
								</div>

								<div
									className={`text-center p-6 rounded-xl ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gradient-to-br from-blue-50 to-blue-100"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-blue-200"
									}`}
								>
									<Cloud className="w-8 h-8 mx-auto mb-3 text-blue-500" />
									<p
										className={`text-lg font-semibold mb-1 ${
											isDarkMode
												? "text-white"
												: "text-gray-900"
										}`}
									>
										{weather.current.condition.text}
									</p>
									<p
										className={`text-sm ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										}`}
									>
										Cloud: {weather.current.cloud}%
									</p>
								</div>

								<div
									className={`text-center p-6 rounded-xl ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gradient-to-br from-blue-50 to-blue-100"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-blue-200"
									}`}
								>
									<Droplets className="w-8 h-8 mx-auto mb-3 text-blue-500" />
									<p
										className={`text-2xl font-bold mb-1 ${
											isDarkMode
												? "text-white"
												: "text-gray-900"
										}`}
									>
										{weather.current.humidity}%
									</p>
									<p
										className={`text-sm ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										}`}
									>
										Humidity
									</p>
								</div>

								<div
									className={`text-center p-6 rounded-xl ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gradient-to-br from-green-50 to-green-100"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-green-200"
									}`}
								>
									<Wind className="w-8 h-8 mx-auto mb-3 text-green-500" />
									<p
										className={`text-2xl font-bold mb-1 ${
											isDarkMode
												? "text-white"
												: "text-gray-900"
										}`}
									>
										{weather.current.wind_kph}
									</p>
									<p
										className={`text-sm ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										}`}
									>
										km/h {weather.current.wind_dir}
									</p>
								</div>
							</div>

							{/* Detailed Weather Info */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<div className="flex items-center">
										<Gauge className="w-5 h-5 text-blue-500 mr-3" />
										<div>
											<p
												className={`text-sm ${
													isDarkMode
														? "text-gray-400"
														: "text-gray-600"
												}`}
											>
												Pressure
											</p>
											<p
												className={`font-semibold ${
													isDarkMode
														? "text-gray-200"
														: "text-gray-900"
												}`}
											>
												{weather.current.pressure_mb} mb
											</p>
										</div>
									</div>
								</div>

								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<div className="flex items-center">
										<Eye className="w-5 h-5 text-green-500 mr-3" />
										<div>
											<p
												className={`text-sm ${
													isDarkMode
														? "text-gray-400"
														: "text-gray-600"
												}`}
											>
												Visibility
											</p>
											<p
												className={`font-semibold ${
													isDarkMode
														? "text-gray-200"
														: "text-gray-900"
												}`}
											>
												{weather.current.vis_km} km
											</p>
										</div>
									</div>
								</div>

								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<div className="flex items-center">
										<Sun className="w-5 h-5 text-yellow-500 mr-3" />
										<div>
											<p
												className={`text-sm ${
													isDarkMode
														? "text-gray-400"
														: "text-gray-600"
												}`}
											>
												UV Index
											</p>
											<p
												className={`font-semibold ${
													isDarkMode
														? "text-gray-200"
														: "text-gray-900"
												}`}
											>
												{weather.current.uv}
											</p>
										</div>
									</div>
								</div>

								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<div className="flex items-center">
										<Droplets className="w-5 h-5 text-blue-500 mr-3" />
										<div>
											<p
												className={`text-sm ${
													isDarkMode
														? "text-gray-400"
														: "text-gray-600"
												}`}
											>
												Dew Point
											</p>
											<p
												className={`font-semibold ${
													isDarkMode
														? "text-gray-200"
														: "text-gray-900"
												}`}
											>
												{weather.current.dewpoint_c}°C
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Sun & Moon Info */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-yellow-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-yellow-200"
									}`}
								>
									<div className="flex items-center">
										<Sun className="w-6 h-6 text-yellow-500 mr-3" />
										<div>
											<p
												className={`text-sm ${
													isDarkMode
														? "text-gray-400"
														: "text-gray-600"
												}`}
											>
												Sunrise
											</p>
											<p
												className={`font-semibold ${
													isDarkMode
														? "text-gray-200"
														: "text-gray-900"
												}`}
											>
												{
													weather.forecast
														.forecastday[0].astro
														.sunrise
												}
											</p>
										</div>
									</div>
								</div>

								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-orange-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-orange-200"
									}`}
								>
									<div className="flex items-center">
										<Sun className="w-6 h-6 text-orange-500 mr-3" />
										<div>
											<p
												className={`text-sm ${
													isDarkMode
														? "text-gray-400"
														: "text-gray-600"
												}`}
											>
												Sunset
											</p>
											<p
												className={`font-semibold ${
													isDarkMode
														? "text-gray-200"
														: "text-gray-900"
												}`}
											>
												{
													weather.forecast
														.forecastday[0].astro
														.sunset
												}
											</p>
										</div>
									</div>
								</div>

								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-blue-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-blue-200"
									}`}
								>
									<div className="flex items-center">
										<Moon className="w-6 h-6 text-blue-400 mr-3" />
										<div>
											<p
												className={`text-sm ${
													isDarkMode
														? "text-gray-400"
														: "text-gray-600"
												}`}
											>
												Moonrise
											</p>
											<p
												className={`font-semibold ${
													isDarkMode
														? "text-gray-200"
														: "text-gray-900"
												}`}
											>
												{
													weather.forecast
														.forecastday[0].astro
														.moonrise
												}
											</p>
										</div>
									</div>
								</div>

								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-indigo-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-indigo-200"
									}`}
								>
									<div className="flex items-center">
										<Moon className="w-5 h-5 text-indigo-400 mr-3" />
										<div>
											<p
												className={`text-sm ${
													isDarkMode
														? "text-gray-400"
														: "text-gray-600"
												}`}
											>
												Moon Phase
											</p>
											<p
												className={`font-semibold text-xs ${
													isDarkMode
														? "text-gray-200"
														: "text-gray-900"
												}`}
											>
												{
													weather.forecast
														.forecastday[0].astro
														.moon_phase
												}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : null}

					{/* Air Quality */}
					{weather?.current?.air_quality && (
						<div
							className={`${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} shadow-xl rounded-2xl p-6`}
						>
							<h2
								className={`text-xl font-semibold mb-4 flex items-center ${
									isDarkMode
										? "text-gray-200"
										: "text-gray-800"
								}`}
							>
								<Leaf className="w-5 h-5 mr-2 text-green-500" />
								Air Quality Index
							</h2>

							<div className="mb-6">
								{(() => {
									const aqi = getAQIStatus(
										weather.current.air_quality[
											"us-epa-index"
										]
									);
									return (
										<div
											className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${aqi.color} ${aqi.bg}`}
										>
											<div className="w-3 h-3 bg-current rounded-full mr-2 opacity-75"></div>
											{aqi.text} (Index:{" "}
											{
												weather.current.air_quality[
													"us-epa-index"
												]
											}
											)
										</div>
									);
								})()}
							</div>

							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<p
										className={`text-sm font-medium ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										} mb-1`}
									>
										PM2.5
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-gray-200"
												: "text-gray-900"
										}`}
									>
										{weather.current.air_quality.pm2_5.toFixed(
											1
										)}
									</p>
									<p
										className={`text-xs ${
											isDarkMode
												? "text-gray-500"
												: "text-gray-500"
										}`}
									>
										μg/m³
									</p>
								</div>
								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<p
										className={`text-sm font-medium ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										} mb-1`}
									>
										PM10
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-gray-200"
												: "text-gray-900"
										}`}
									>
										{weather.current.air_quality.pm10.toFixed(
											1
										)}
									</p>
									<p
										className={`text-xs ${
											isDarkMode
												? "text-gray-500"
												: "text-gray-500"
										}`}
									>
										μg/m³
									</p>
								</div>
								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<p
										className={`text-sm font-medium ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										} mb-1`}
									>
										Ozone
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-gray-200"
												: "text-gray-900"
										}`}
									>
										{weather.current.air_quality.o3.toFixed(
											1
										)}
									</p>
									<p
										className={`text-xs ${
											isDarkMode
												? "text-gray-500"
												: "text-gray-500"
										}`}
									>
										μg/m³
									</p>
								</div>
								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<p
										className={`text-sm font-medium ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										} mb-1`}
									>
										NO2
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-gray-200"
												: "text-gray-900"
										}`}
									>
										{weather.current.air_quality.no2.toFixed(
											1
										)}
									</p>
									<p
										className={`text-xs ${
											isDarkMode
												? "text-gray-500"
												: "text-gray-500"
										}`}
									>
										μg/m³
									</p>
								</div>
								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<p
										className={`text-sm font-medium ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										} mb-1`}
									>
										SO2
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-gray-200"
												: "text-gray-900"
										}`}
									>
										{weather.current.air_quality.so2.toFixed(
											1
										)}
									</p>
									<p
										className={`text-xs ${
											isDarkMode
												? "text-gray-500"
												: "text-gray-500"
										}`}
									>
										μg/m³
									</p>
								</div>
								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<p
										className={`text-sm font-medium ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										} mb-1`}
									>
										CO
									</p>
									<p
										className={`text-lg font-semibold ${
											isDarkMode
												? "text-gray-200"
												: "text-gray-900"
										}`}
									>
										{weather.current.air_quality.co.toFixed(
											1
										)}
									</p>
									<p
										className={`text-xs ${
											isDarkMode
												? "text-gray-500"
												: "text-gray-500"
										}`}
									>
										μg/m³
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Today's Forecast */}
					{weather?.forecast ? (
						<div
							className={`${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} shadow-xl rounded-2xl p-6`}
						>
							<h2
								className={`text-xl font-semibold mb-4 flex items-center ${
									isDarkMode
										? "text-gray-200"
										: "text-gray-800"
								}`}
							>
								<Calendar className="w-5 h-5 mr-2 text-blue-500" />
								Today's Forecast
							</h2>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div
									className={`p-4 rounded-lg text-center ${
										isDarkMode ? "bg-gray-700" : "bg-red-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-red-200"
									}`}
								>
									<Thermometer className="w-6 h-6 mx-auto mb-2 text-red-500" />
									<p
										className={`text-sm ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										} mb-1`}
									>
										High
									</p>
									<p
										className={`text-xl font-bold ${
											isDarkMode
												? "text-gray-200"
												: "text-gray-900"
										}`}
									>
										{
											weather.forecast.forecastday[0].day
												.maxtemp_c
										}
										°C
									</p>
								</div>

								<div
									className={`p-4 rounded-lg text-center ${
										isDarkMode
											? "bg-gray-700"
											: "bg-blue-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-blue-200"
									}`}
								>
									<CloudSnow className="w-6 h-6 mx-auto mb-2 text-blue-500" />
									<p
										className={`text-sm ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										} mb-1`}
									>
										Low
									</p>
									<p
										className={`text-xl font-bold ${
											isDarkMode
												? "text-gray-200"
												: "text-gray-900"
										}`}
									>
										{
											weather.forecast.forecastday[0].day
												.mintemp_c
										}
										°C
									</p>
								</div>

								<div
									className={`p-4 rounded-lg text-center ${
										isDarkMode
											? "bg-gray-700"
											: "bg-blue-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-blue-200"
									}`}
								>
									<CloudRain className="w-6 h-6 mx-auto mb-2 text-blue-600" />
									<p
										className={`text-sm ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										} mb-1`}
									>
										Rain Chance
									</p>
									<p
										className={`text-xl font-bold ${
											isDarkMode
												? "text-gray-200"
												: "text-gray-900"
										}`}
									>
										{
											weather.forecast.forecastday[0].day
												.daily_chance_of_rain
										}
										%
									</p>
								</div>

								<div
									className={`p-4 rounded-lg text-center ${
										isDarkMode
											? "bg-gray-700"
											: "bg-yellow-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-yellow-200"
									}`}
								>
									<Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
									<p
										className={`text-sm ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-600"
										} mb-1`}
									>
										UV Index
									</p>
									<p
										className={`text-xl font-bold ${
											isDarkMode
												? "text-gray-200"
												: "text-gray-900"
										}`}
									>
										{weather.forecast.forecastday[0].day.uv}
									</p>
								</div>
							</div>

							{/* Additional forecast details */}
							<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<Wind className="w-5 h-5 text-gray-500 mr-2" />
											<span
												className={`text-sm font-medium ${
													isDarkMode
														? "text-gray-300"
														: "text-gray-700"
												}`}
											>
												Max Wind Speed
											</span>
										</div>
										<span
											className={`font-semibold ${
												isDarkMode
													? "text-gray-200"
													: "text-gray-900"
											}`}
										>
											{
												weather.forecast.forecastday[0]
													.day.maxwind_kph
											}{" "}
											km/h
										</span>
									</div>
								</div>

								<div
									className={`p-4 rounded-lg ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									} border ${
										isDarkMode
											? "border-gray-600"
											: "border-gray-200"
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<Droplets className="w-5 h-5 text-blue-500 mr-2" />
											<span
												className={`text-sm font-medium ${
													isDarkMode
														? "text-gray-300"
														: "text-gray-700"
												}`}
											>
												Avg Humidity
											</span>
										</div>
										<span
											className={`font-semibold ${
												isDarkMode
													? "text-gray-200"
													: "text-gray-900"
											}`}
										>
											{
												weather.forecast.forecastday[0]
													.day.avghumidity
											}
											%
										</span>
									</div>
								</div>
							</div>
						</div>
					) : data?.location ? (
						<div
							className={`${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} shadow-xl rounded-2xl p-6`}
						>
							<div className="text-center py-12">
								<Cloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
								<p className="text-gray-600">
									Weather data unavailable for {data.location}
								</p>
								<p className="text-sm text-gray-500 mt-2">
									Please check your location or try again
									later
								</p>
							</div>
						</div>
					) : (
						<div
							className={`${
								isDarkMode ? "bg-gray-800" : "bg-white"
							} shadow-xl rounded-2xl p-6`}
						>
							<div className="text-center py-12">
								<MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
								<p className="text-gray-600">No location set</p>
								<p className="text-sm text-gray-500 mt-2">
									Please update your profile with your
									location to see weather information
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Profile;
