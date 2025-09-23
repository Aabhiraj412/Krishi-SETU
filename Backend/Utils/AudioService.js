import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vosk from "vosk";
import ffmpeg from "fluent-ffmpeg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Model folder (adjust if needed)
const modelPath = path.join(__dirname, "../model");

export const audioToText = async (filePath) => {
	return new Promise((resolve, reject) => {
		try {
			vosk.setLogLevel(0);

			if (!fs.existsSync(modelPath)) {
				return reject(
					new Error(
						`Vosk model not found. Please download and unzip a model into: ${modelPath}`
					)
				);
			}

			const model = new vosk.Model(modelPath);
			const rec = new vosk.Recognizer({
				model: model,
				sampleRate: 16000,
			});

			const ffmpegProcess = ffmpeg(filePath)
				.audioFrequency(16000)
				.format("s16le")
				.audioChannels(1)
				.on("error", (err) => {
					rec.free();
					reject(err);
				})
				.pipe();

			ffmpegProcess.on("data", (chunk) => {
				rec.acceptWaveform(chunk);
			});

			ffmpegProcess.on("end", () => {
				try {
					const result = rec.finalResult();
					rec.free();
					resolve(result.text);
				} catch (err) {
					reject(err);
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};
