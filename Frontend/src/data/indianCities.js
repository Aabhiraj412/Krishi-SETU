import { State, City } from "country-state-city";

// Get all states of India and filter out any without cities
const indianCities = State.getStatesOfCountry("IN")
	.map((state) => {
		const cities = City.getCitiesOfState("IN", state.isoCode) || [];
		// Only include states that have cities
		if (cities.length === 0) return null;

		// Create a Map to store unique cities using coordinates as part of the key
		const uniqueCities = new Map();

		cities.forEach((city) => {
			if (city.name && city.name.trim() !== "") {
				const key = `${city.name}-${city.latitude}-${city.longitude}`;
				if (!uniqueCities.has(key)) {
					uniqueCities.set(key, {
						name: city.name,
						id: `${state.isoCode}-${city.name
							.replace(/[^A-Z0-9]/gi, "")
							.toUpperCase()}-${city.latitude}-${
							city.longitude
						}`.replace(/\./g, "_"),
						latitude: city.latitude,
						longitude: city.longitude,
					});
				}
			}
		});

		return {
			state: state.name,
			stateCode: state.isoCode,
			cities: Array.from(uniqueCities.values()),
		};
	})
	.filter(Boolean) // Remove null entries (states without cities)
	.sort((a, b) => a.state.localeCompare(b.state)); // Sort states alphabetically

export { indianCities };
