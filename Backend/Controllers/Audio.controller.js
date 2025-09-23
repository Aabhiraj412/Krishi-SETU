import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Chats from "../Schemas/Chats.model.js";
import { ai } from "../Utils/AIservice.js";
import { audioToText } from "../Utils/AudioService.js";

// Ensure public/images folder exists
const uploadDir = path.join(process.cwd(), "public/audio");

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname).toLowerCase();
		const uniqueName = `${uuidv4()}${ext}`;
		cb(null, uniqueName);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: (req, file, cb) => {
		// const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/ogg"];
		const allowedTypes = [
			"audio/mpeg",
			"audio/wav",
			"audio/mp3",
			"audio/ogg",
			"audio/x-wav",
			"audio/wave",
			"audio/x-pn-wav",
		];

		if (!allowedTypes.includes(file.mimetype)) {
			return cb(new Error("Only audio files are allowed"), false);
		}
		cb(null, true);
	},
}).single("audio"); // 🔑 frontend must send form-data key = "audio"

export const uploadAudio = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		upload(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				console.error(`Multer Error: ${err.message}`);
				return res
					.status(400)
					.json({ message: `Multer Error: ${err.message}` });
			} else if (err) {
				console.error(`Error: ${err.message}`);
				return res
					.status(400)
					.json({ message: `File upload error: ${err.message}` });
			}

			if (!req.file) {
				return res.status(400).json({ message: "File is required" });
			}

			const audioFilePath = path.join(uploadDir, req.file.filename);

			if (!fs.existsSync(audioFilePath)) {
				return res
					.status(400)
					.json({ message: "Uploaded audio file not found" });
			}
			
			// Build relative path (to serve via Express.static later)
			const audioPath = `/audio/${req.file.filename}`;

			const textToProcess = await audioToText(`./public${audioPath}`);
			if (!textToProcess) {
				return res
					.status(500)
					.json({ message: "Audio transcription failed" });
			}

			console.log("Transcribed text:", textToProcess);

			const message = req.body.message || textToProcess;

			// Save user’s chat message with image path
			const newMessage = await Chats.create({
				sender: "user",
				message: message,
				audio: audioPath,
				contentType: req.file.mimetype,
			});
			user.chats.push(newMessage._id);
			await user.save();

			// Call AI service with the processed text
			const resp = await ai(textToProcess, user.location);
			if (!resp) {
				return res.status(400).json({ message: "AI Server Failed" });
			}

			const newRes = await Chats.create({
				sender: "ai",
				message: resp,
			});

			user.chats.push(newRes._id);
			await user.save();

			return res.status(200).json({
				message: "Image uploaded successfully",
				newMessage,
				newRes,
			});
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};
