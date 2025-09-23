import express from 'express';
import UserProtectRoute from '../Middlewares/User.middleware.js';
import { chat, getChats} from '../Controllers/User.controller.js';
import { uploadImage } from '../Controllers/Image.controller.js';
import { uploadAudio } from '../Controllers/Audio.controller.js';

const router = express.Router();

// Auth routes go here
router.post("/chat", UserProtectRoute, chat);
router.get("/getchats", UserProtectRoute, getChats);
router.post("/upload", UserProtectRoute, uploadImage);
router.post("/audio", UserProtectRoute, uploadAudio);

export default router;
