const fetchWeatherData = async (city) => {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_WEATHER_API_URL}?key=${
				import.meta.env.VITE_WEATHER_API_KEY
			}&q=${encodeURIComponent(city)}&aqi=no`
		);

		if (!response.ok) {
			throw new Error("Weather data fetch failed");
		}

		const data = await response.json();
		return {
			temperature: data.current.temp_c,
			condition: data.current.condition.text,
			humidity: data.current.humidity,
			windSpeed: data.current.wind_kph,
			icon: data.current.condition.icon,
			feelsLike: data.current.feelslike_c,
			lastUpdated: data.current.last_updated,
		};
	} catch (error) {
		console.error("Error fetching weather data:", error);
		throw error;
	}
};

export { fetchWeatherData };
