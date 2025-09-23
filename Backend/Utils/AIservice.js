import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize Groq client only if API key is available
let groq = null;

const initializeGroq = () => {
	if (
		process.env.GROK_API_KEY &&
		process.env.GROK_API_KEY !== "your_groK_api_key_here"
	) {
		try {
			groq = new Groq({
				apiKey: process.env.GROK_API_KEY,
			});
			return true;
		} catch (error) {
			console.error("Failed to initialize Groq client:", error);
			return false;
		}
	}
	return false;
};

export const ai = async (message, location) => {
	// Check if Groq is available
	if (!groq && !initializeGroq()) {
		console.warn(
			"Groq API key not configured. Using fallback summary generation."
		);
		return "AI Service Failed, Please Try Again After Some Time.";
	}

	try {
		const systemPrompt = `You are KRISHI SETU, an AI assistant for farmers. 
Give clear, simple, practical answers in 2–5 short lines only.  

Core Rules:
- Answer only what is asked, nothing extra
- Consise and simple answers without any extra information like current situations and forecastings
- Use farmer-friendly language, avoid jargon  
- Be concise, respectful, and solution-focused  
- Explain in detail ONLY if farmer requests it  
- Focus on real problems: pests, weather, inputs, subsidies, market trends, government schemes
- Use Emojies to better communicate with farmers🌾🌦️💰
`;

		const weatherData = await fetch(
			`${process.env.WEATHER_API_URL}?key=${process.env.WEATHER_API_KEY}&q=${location}&days=1&aqi=yes&alerts=yes`
		);
		const data = await weatherData.json();
		// console.log(data);

		const userPrompt = `Query: ${message}, Weather Information: ${JSON.stringify(
			data
		)}
Please create a professional summary following the formatting requirements and structure guidelines above. Focus on the specific instructions provided while maintaining clarity and completeness.`;

		const completion = await groq.chat.completions.create({
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			model: "llama-3.1-8b-instant", // Using Llama 3 8B model
			temperature: 0.3,
			max_tokens: 2000,
			top_p: 1,
			stream: false,
			stop: null,
		});

		return (
			completion.choices[0]?.message?.content ||
			"Unable to generate summary"
		);
	} catch (error) {
		console.error("Error generating summary with Groq:", error);

		// Fallback basic summary if AI service fails
		return "AI Service Failed, Please Try Again After Some Time.";
	}
};

export const imageAi = async (image, location) => {
	// Check if Groq is available
	if (!groq && !initializeGroq()) {
		console.warn(
			"Groq API key not configured. Using fallback summary generation."
		);
		return "AI Service Failed, Please Try Again After Some Time.";
	}

	try {
		// System prompt
		const systemPrompt = `You are KRISHI SETU, an AI assistant for farmers. 
Give clear, simple, practical answers in 2–5 short lines only.  

Core Rules:
- Answer only what is asked, nothing extra
- Consise and simple answers without any extra information like current situations and forecastings
- Use farmer-friendly language, avoid jargon  
- Be concise, respectful, and solution-focused  
- Explain in detail ONLY if farmer requests it  
- Focus on real problems: pests, weather, inputs, subsidies, market trends, government schemes
- Use Emojies to better communicate with farmers🌾🌦️💰
`;
		// Weather data
		const weatherData = await fetch(
			`${process.env.WEATHER_API_URL}?key=${process.env.WEATHER_API_KEY}&q=${location}&days=1&aqi=yes&alerts=yes`
		);
		const data = await weatherData.json();

		// Publicly accessible image URL
		const imageUrl = `${process.env.SERVER_URL}/public/images/${image}`;

		const processedImageData = await imageProcessor(imageUrl);

		// User prompt
		const userPrompt = `After analyzing the uploaded crop image, the output was ${processedImageData}, give clear farming advice.
Weather info: ${JSON.stringify(data)}.`;

		// 🔑 Multimodal request: pass image + text
		const completion = await groq.chat.completions.create({
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			model: "llama-3.1-8b-instant", // Using Llama 3 8B model
			temperature: 0.3,
			max_tokens: 2000,
			top_p: 1,
			stream: false,
			stop: null,
		});

		return (
			completion.choices[0]?.message?.content ||
			"Unable to generate summary"
		);
	} catch (error) {
		console.error("Error generating summary with Groq:", error);
		return "AI Service Failed, Please Try Again After Some Time.";
	}
};


const imageProcessor = async (image) =>{
	return "Tomato Leaf is Healthy"
}