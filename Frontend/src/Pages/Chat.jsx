import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaImage, FaPlay, FaTrash } from "react-icons/fa";
import useStore from "../Store/Store";
import AudioRecorder from "../Components/AudioRecorder";
import Navbar from "../Components/Navbar";

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [audioBlob, setAudioBlob] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);
	const fileInputRef = useRef(null);
	const { isDarkMode } = useStore();

	// Fetch chats on component mount
	useEffect(() => {
		const fetchChats = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/user/getchats`,
					{
						credentials: "include",
					}
				);
				const data = await response.json();
				if (data.chats) {
					setMessages(data.chats);
				}
			} catch (error) {
				console.error("Error fetching chats:", error);
			}
		};

		fetchChats();
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = async (content, type = "text") => {
		if (!content) return;

		setIsLoading(true);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/user/chat`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ message: content }),
				}
			);

			const data = await response.json();
			if (data.newMessage && data.newRes) {
				setMessages((prev) => [...prev, data.newMessage, data.newRes]);
			} else {
				throw new Error("Failed to send message");
			}
		} catch (error) {
			console.error("Error sending message:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleTextSubmit = async (e) => {
		e.preventDefault();
		if (inputText.trim()) {
			await handleSendMessage(inputText.trim());
			setInputText("");
		}
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				alert("Image size should be less than 5MB");
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
				handleSendMessage(reader.result, "image");
				setImagePreview(null);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleAudioStop = (blob) => {
		setAudioBlob(blob);
	};

	const handleAudioUpload = async () => {
		if (audioBlob) {
			const reader = new FileReader();
			reader.onloadend = () => {
				handleSendMessage(reader.result, "audio");
				setAudioBlob(null);
			};
			reader.readAsDataURL(audioBlob);
		}
	};

	const MessageBubble = ({ message }) => (
		<div
			className={`flex ${
				message.sender === "user" ? "justify-end" : "justify-start"
			} mb-4`}
		>
			<div
				className={`max-w-[70%] rounded-lg p-3 ${
					message.sender === "user"
						? "bg-green-500 text-white rounded-tr-none"
						: isDarkMode
						? "bg-gray-700 text-white rounded-tl-none"
						: "bg-gray-200 text-gray-800 rounded-tl-none"
				}`}
			>
				<p>{message.message}</p>
				<span
					className={`text-xs ${
						message.sender === "user"
							? "text-white/70"
							: "text-gray-500"
					} block mt-1`}
				>
					{new Date(message.createdAt).toLocaleTimeString()}
				</span>
			</div>
		</div>
	);

	return (
		<div
			className={`flex flex-col h-screen ${
				isDarkMode
					? "bg-gray-900 text-white"
					: "bg-gray-50 text-gray-900"
			}`}
		>
			<Navbar />
			{/* Chat Header */}
			<div
				className={`p-4 ${
					isDarkMode ? "bg-gray-800" : "bg-white"
				} shadow-md mt-16`}
			>
				<h1 className="text-xl font-bold">Krishi SETU AI Assistant</h1>
				<p
					className={`text-sm ${
						isDarkMode ? "text-gray-400" : "text-gray-600"
					}`}
				>
					Ask me anything about agriculture
				</p>
			</div>

			{/* Messages Container */}
			<div className="flex-1 overflow-y-auto p-4">
				{messages.map((message) => (
					<MessageBubble key={message.id} message={message} />
				))}
				{isLoading && (
					<div className="flex justify-start mb-4">
						<div
							className={`rounded-lg p-4 ${
								isDarkMode ? "bg-gray-700" : "bg-gray-200"
							}`}
						>
							<div className="flex space-x-2">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
								<div
									className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
									style={{ animationDelay: "0.2s" }}
								></div>
								<div
									className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
									style={{ animationDelay: "0.4s" }}
								></div>
							</div>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div
				className={`p-4 ${
					isDarkMode ? "bg-gray-800" : "bg-white"
				} border-t ${
					isDarkMode ? "border-gray-700" : "border-gray-200"
				}`}
			>
				{imagePreview && (
					<div className="mb-2 relative">
						<img
							src={imagePreview}
							alt="Preview"
							className="h-20 rounded"
						/>
						<button
							onClick={() => setImagePreview(null)}
							className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
						>
							<FaTrash size={12} />
						</button>
					</div>
				)}
				{audioBlob && (
					<div className="mb-2 flex items-center gap-2">
						<audio controls>
							<source
								src={URL.createObjectURL(audioBlob)}
								type="audio/wav"
							/>
						</audio>
						<button
							onClick={handleAudioUpload}
							className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
						>
							<FaPaperPlane size={14} />
						</button>
						<button
							onClick={() => setAudioBlob(null)}
							className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
						>
							<FaTrash size={14} />
						</button>
					</div>
				)}
				<div className="flex items-end gap-2">
					<form
						onSubmit={handleTextSubmit}
						className="flex-1 flex items-end gap-2"
					>
						<input
							type="text"
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							placeholder="Type your message..."
							className={`flex-1 p-2 rounded-lg border ${
								isDarkMode
									? "bg-gray-700 border-gray-600 text-white"
									: "bg-white border-gray-300 text-gray-900"
							} focus:outline-none focus:ring-2 focus:ring-green-500`}
						/>
						<button
							type="submit"
							disabled={!inputText.trim()}
							className={`p-2 rounded-lg ${
								inputText.trim()
									? "bg-green-500 hover:bg-green-600"
									: "bg-gray-300 cursor-not-allowed"
							} text-white transition-colors`}
						>
							<FaPaperPlane size={16} />
						</button>
					</form>

					<div className="flex items-center gap-2">
						<AudioRecorder onAudioStop={handleAudioStop} />

						<button
							onClick={() => fileInputRef.current?.click()}
							className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
						>
							<FaImage size={16} />
						</button>
					</div>

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
						className="hidden"
					/>
				</div>
			</div>
		</div>
	);
};

export default Chat;
