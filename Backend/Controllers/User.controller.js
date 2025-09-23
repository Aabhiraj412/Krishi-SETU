import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Chats from "../Schemas/Chats.model.js";
import { ai, imageAi } from "../Utils/AIservice.js";

export const chat = async (req, res) => {
	try {
		const user = req.user;
		const { message } = req.body;

		if (!message)
			return res.status(400).json({ message: "Message is required" });

		const newMessage = await Chats.create({
			sender: "user",
			message: message,
		});

		// Ensure user.chats is always an array
		if (!Array.isArray(user.chats)) {
			user.chats = [];
		}

		user.chats.push(newMessage._id);
		await user.save();

		const resp = await ai(message, user.location);
		if (!resp) {
			return res.status(400).json({ message: "AI Server Failed" });
		}

		const newRes = await Chats.create({
			sender: "ai",
			message: resp,
		});

		user.chats.push(newRes._id);
		await user.save();

		return res
			.status(200)
			.json({ message: "Message Sent", newMessage, newRes });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getChats = async (req, res) => {
	try {
		const user = req.user;
		if (!user || !Array.isArray(user.chats)) {
			return res.status(404).json({ message: "No chats found" });
		}
		// Fetch all chat documents by their IDs
		const chats = await Promise.all(
			user.chats.map((id) => Chats.findById(id))
		);
		return res.status(200).json({ chats });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Ensure public/images folder exists
const uploadDir = path.join(process.cwd(), "public/images");
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
		if (file.mimetype !== "image/png") {
			return cb(new Error("Only PNG files are allowed"), false);
		}
		cb(null, true);
	},
}).single("image"); // 🔑 frontend must send form-data key = "image"

export const uploadImage = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		upload(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				console.error(`Multer Error: ${err.message}`);
				return res.status(400).json({ message: `Multer Error: ${err.message}` });
			} else if (err) {
				console.error(`Error: ${err.message}`);
				return res.status(400).json({ message: `File upload error: ${err.message}` });
			}

			if (!req.file) {
				return res.status(400).json({ message: "File is required" });
			}

			// Build relative path (to serve via Express.static later)
			const imagePath = `/images/${req.file.filename}`;

			// Save user’s chat message with image path
			const newMessage = await Chats.create({
				sender: "user",
				message: `Image Uploaded Successfully`,
				image: imagePath,
				contentType: req.file.mimetype,
			});
			user.chats.push(newMessage._id);
			await user.save();

			// AI response
			const resp = await imageAi(`${imagePath}`, user.location);
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