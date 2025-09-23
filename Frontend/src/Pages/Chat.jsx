import { useState, useRef, useEffect } from "react";
import { Send, Image, Trash2, X, Upload } from "lucide-react";
import useStore from "../Store/Store";
import AudioRecorder from "../Components/AudioRecorder";
import Navbar from "../Components/Navbar";
import MessageBubble from "../Components/MessageBubble";

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [audioBlob, setAudioBlob] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [imageMessage, setImageMessage] = useState(""); // NEW: Text to accompany image
	const [uploadingImage, setUploadingImage] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0); // NEW: Upload progress
	const [isLoading, setIsLoading] = useState(false);
	const [isMessageLoading, setMessagesLoading] = useState(false);
	const messagesEndRef = useRef(null);
	const fileInputRef = useRef(null);
	const { isDarkMode } = useStore();

	useEffect(() => {
		const fetchChats = async () => {
			setMessagesLoading(true);
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/user/getchats`,
					{ credentials: "include" }
				);
				const data = await response.json();
				if (data.chats) setMessages(data.chats);
			} catch (error) {
				console.error("Error fetching chats:", error);
			} finally {
				setMessagesLoading(false);
			}
		};
		fetchChats();
	}, []);

	useEffect(() => {
		if (messagesEndRef.current) {
			// Wait until DOM updates
			requestAnimationFrame(() => {
				messagesEndRef.current.scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
			});
		}
	}, [messages]);


	const handleSendMessage = async (
		content,
		type = "text",
		additionalData = {}
	) => {
		if (!content) return;
		setIsLoading(true);
		try {
			const requestBody = {
				message: content,
				type,
				...additionalData, // This can include imageMessage for image types
			};

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/user/chat`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify(requestBody),
				}
			);
			const data = await response.json();
			if (data.newMessage && data.newRes) {
				setMessages((prev) => [...prev, data.newMessage, data.newRes]);
				return true;
			} else throw new Error("Failed to send message");
		} catch (error) {
			console.error("Error sending message:", error);
			alert("Failed to send message. Please try again.");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const handleTextSubmit = async (e) => {
		e.preventDefault();
		if (inputText.trim()) {
			await handleSendMessage(inputText.trim(), "text");
			setInputText("");
		}
	};

	const handleImageSelect = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			alert("Image size should be less than 5MB");
			return;
		}

		// Store file and show preview
		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));

		// Clear any previous error states
		setUploadProgress(0);
	};

	const handleImageUploadWithText = async () => {
		if (!imageFile) return;

		const formData = new FormData();
		formData.append("image", imageFile);
		if (imageMessage.trim()) {
			formData.append("message", imageMessage.trim());
		}

		try {
			setUploadingImage(true);
			setUploadProgress(30);

			// Upload image to backend
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/api/user/upload`,
				{
					method: "POST",
					body: formData,
					credentials: "include",
				}
			);

			setUploadProgress(70);

			if (!res.ok) throw new Error("Image upload failed");
			const data = await res.json();

			setUploadProgress(90);

			// Backend now returns both messages, so add them directly
			if (data.newMessage && data.newRes) {
				setMessages((prev) => [...prev, data.newMessage, data.newRes]);
				setImagePreview(null);
				setImageFile(null);
				setImageMessage("");
				setUploadProgress(100);

				// Reset after brief delay
				setTimeout(() => setUploadProgress(0), 1000);
			} else {
				throw new Error("Invalid response from server");
			}
		} catch (err) {
			console.error("Upload error:", err);
			alert("Image upload failed. Please try again.");
		} finally {
			setUploadingImage(false);
		}
	};

	const clearImagePreview = () => {
		setImagePreview(null);
		setImageFile(null);
		setImageMessage("");
		setUploadProgress(0);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleAudioStop = (blob) => setAudioBlob(blob);

	const handleAudioUpload = async () => {
		if (!audioBlob) return;


		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("audio", audioBlob, "recording.wav"); // give file a name

			setAudioBlob(null); // clear after upload
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/api/user/audio`,
				{
					method: "POST",
					body: formData,
					credentials: "include",
				}
			);

			if (!res.ok) throw new Error("Audio upload failed");
			const data = await res.json();

			// backend should return saved message + AI response
			if (data.newMessage && data.newRes) {
				setMessages((prev) => [...prev, data.newMessage, data.newRes]);
			}
		} catch (err) {
			console.error("Audio upload error:", err);
			alert("Audio upload failed. Please try again.");
		}
		finally{
			setIsLoading(false);
		}
	};

	return (
		<div
			className={`flex flex-col h-screen transition-colors duration-700 overflow-x-hidden ${
				isDarkMode ? "text-gray-100" : "text-gray-900"
			}`}
		>
			<div className="useit1-login-bg flex flex-col h-full">
				<Navbar />

				{/* Header */}
				{/* <header
					className={`sticky top-16 z-20 p-6 border-b backdrop-blur-md bg-opacity-80 shadow-lg ${
						isDarkMode
							? "border-gray-600 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
							: "border-green-300 bg-gradient-to-r from-green-200 via-green-100 to-green-200"
					}`}
				>
					<h1 className="text-3xl font-extrabold tracking-wide select-none text-gradient-green">
						Krishi SETU AI Assistant
					</h1>
					<p
						className={`mt-1 text-sm select-none ${
							isDarkMode ? "text-green-400" : "text-green-700"
						}`}
					>
						Ask me anything about agriculture
					</p>
				</header> */}

				{isMessageLoading && (
					<div
						className={`sticky h-screen top-30 z-20 p-4 backdrop-blur-md bg-opacity-80 shadow-lg flex items-center justify-center`}
					>
						<div
							className={`flex items-center space-x-3 max-w-xs rounded-xl p-3 shadow-lg ${
								isDarkMode ? "bg-green-900" : "bg-green-100"
							}`}
						>
							<span className="ml-2 text-green-500 font-semibold text-sm select-none">
								Loading messages...
							</span>
							{[0, 1, 2].map((i) => (
								<div
									key={i}
									className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
									style={{ animationDelay: `${i * 0.2}s` }}
								/>
							))}
						</div>
					</div>
				)}

				{/* Main chat area */}
				<main className="mt-15 flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-transparent max-w-full">
					{messages.length === 0 && !isLoading && (
						<p
							className={`text-center mt-20 select-none ${
								isDarkMode ? "text-green-400" : "text-green-700"
							}`}
						>
							Start the conversation by typing a message below.
						</p>
					)}

					{messages.map((message, index) => (
						<MessageBubble
							key={message.id ?? `msg-${index}`}
							message={message}
							isDarkMode={isDarkMode}
							className="max-w-full"
						/>
					))}

					{isLoading && (
						<div
							className={`flex items-center space-x-3 max-w-xs rounded-xl p-3 ${
								isDarkMode ? "bg-green-900" : "bg-green-100"
							} shadow-lg`}
						>
							{[0, 1, 2].map((i) => (
								<div
									key={i}
									className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
									style={{ animationDelay: `${i * 0.2}s` }}
								/>
							))}
							<span className="ml-2 text-green-500 font-semibold text-sm select-none">
								AI is typing...
							</span>
						</div>
					)}

					<div ref={messagesEndRef} />
				</main>

				{/* Footer */}
				<footer
					className={`sticky bottom-0 z-30 p-6 border-t flex flex-col gap-5 backdrop-blur-md bg-opacity-90 shadow-2xl ${
						isDarkMode
							? "bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-green-700"
							: "bg-gradient-to-r from-green-100 via-green-50 to-green-100 border-green-300"
					}`}
				>
					{/* Enhanced Image preview with text input */}
					{imagePreview && (
						<div
							className={`relative max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl ring-2 ring-green-500/60 
    ${isDarkMode ? "bg-gray-800" : "bg-white"} p-4`}
						>
							<div className="relative mb-4">
								<img
									src={imagePreview}
									alt="Preview"
									className="w-full h-48 object-cover rounded-2xl select-none"
									draggable={false}
								/>
								<button
									onClick={clearImagePreview}
									disabled={uploadingImage}
									className="absolute top-2 right-2 p-2 bg-red-700 hover:bg-red-800 disabled:opacity-50 
          rounded-full text-white shadow-lg transition"
								>
									<X size={16} />
								</button>

								{uploadingImage && uploadProgress > 0 && (
									<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-b-2xl">
										<div
											className="bg-green-500 text-xs text-center text-white py-1 transition-all duration-300 rounded-b-2xl"
											style={{
												width: `${uploadProgress}%`,
											}}
										>
											{uploadProgress}%
										</div>
									</div>
								)}
							</div>

							<textarea
								value={imageMessage}
								onChange={(e) =>
									setImageMessage(e.target.value)
								}
								placeholder="Add a message with your image (optional)..."
								className={`w-full p-3 rounded-2xl border-2 resize-none focus:outline-none focus:ring-2 
        focus:ring-green-500 transition mb-4 ${
			isDarkMode
				? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
				: "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
		}`}
								rows={3}
								disabled={uploadingImage}
							/>

							<div className="flex justify-end gap-3">
								<button
									onClick={handleImageUploadWithText}
									disabled={uploadingImage}
									className={`p-3 rounded-full text-white shadow-lg transition ${
										uploadingImage
											? "bg-gray-400 cursor-not-allowed"
											: "bg-green-600 hover:bg-green-700"
									}`}
								>
									<Send size={20} />
								</button>
							</div>
						</div>
					)}

					{/* Audio preview */}
					{audioBlob && (
						<div className="flex flex-col w-full max-w-xs mx-auto items-center gap-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow">
							<audio
								controls
								autoPlay
								className="rounded-lg w-full shadow-inner ring-2 ring-green-500/70"
								src={URL.createObjectURL(audioBlob)}
							/>
							<div className="flex gap-3">
								<button
									onClick={handleAudioUpload}
									className="p-3 bg-green-600 hover:bg-green-700 rounded-full text-white shadow-lg transition"
								>
									<Send size={20} />
								</button>
								<button
									onClick={() => setAudioBlob(null)}
									className="p-3 bg-red-700 hover:bg-red-800 rounded-full text-white shadow-lg transition"
								>
									<Trash2 size={20} />
								</button>
							</div>
						</div>
					)}

					{/* Input & controls */}
					<div className="flex items-center gap-5">
						<div className="flex flex-1 gap-5">
							<input
								type="text"
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" &&
									!e.shiftKey &&
									handleTextSubmit(e)
								}
								placeholder="Type your message..."
								className={`flex-1 w-1/2 rounded-3xl border-2 px-6 py-4 text-lg placeholder-green-400 focus:outline-none focus:ring-4 focus:ring-green-500 transition shadow-lg max-w-full ${
									isDarkMode
										? "bg-green-900 border-green-700 text-green-100"
										: "bg-green-50 border-green-300 text-green-900"
								}`}
								autoComplete="off"
								spellCheck={false}
								aria-label="Message input"
							/>
							<button
								type="button"
								onClick={handleTextSubmit}
								disabled={!inputText.trim()}
								aria-label="Send message"
								className={`flex items-center justify-center rounded-3xl px-7 py-4 text-white text-lg font-semibold transition shadow-xl ${
									inputText.trim()
										? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 cursor-pointer"
										: "bg-green-300 cursor-not-allowed"
								}`}
							>
								<Send size={16} />
							</button>
						</div>
						
						<AudioRecorder onAudioStop={handleAudioStop} />

						<button
							onClick={() => fileInputRef.current?.click()}
							aria-label="Upload image"
							className="p-4 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition"
						>
							<Image size={24} />
						</button>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageSelect}
							className="hidden"
						/>
					</div>
				</footer>
			</div>

			<style jsx>{`
				.useit1-login-bg {
					background: ${isDarkMode
						? `linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%)`
						: `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #ecfdf5 70%, #f0fdf4 100%)`};
					position: relative;
					min-height: 100vh;
					overflow: hidden;
					max-width: 100vw;
				}

				.useit1-login-bg::before,
				.useit1-login-bg::after {
					max-width: 100vw;
				}

				.useit1-login-bg::before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: radial-gradient(
							circle at 20% 20%,
							rgba(34, 197, 94, 0.15) 0%,
							transparent 50%
						),
						radial-gradient(
							circle at 80% 30%,
							rgba(59, 130, 246, 0.1) 0%,
							transparent 50%
						),
						radial-gradient(
							circle at 40% 70%,
							rgba(16, 185, 129, 0.12) 0%,
							transparent 50%
						),
						radial-gradient(
							circle at 90% 80%,
							rgba(34, 197, 94, 0.08) 0%,
							transparent 50%
						);
					pointer-events: none;
					animation: useit1-bg-flow 25s ease-in-out infinite;
					z-index: 0;
				}

				.useit1-login-bg::after {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
					pointer-events: none;
					animation: useit1-pattern-drift 30s linear infinite;
					z-index: 0;
				}

				@keyframes useit1-bg-flow {
					0%,
					100% {
						transform: translateX(0) translateY(0) rotate(0deg);
						opacity: 1;
					}
					33% {
						transform: translateX(-10px) translateY(-20px)
							rotate(1deg);
						opacity: 0.8;
					}
					66% {
						transform: translateX(15px) translateY(-10px)
							rotate(-0.5deg);
						opacity: 0.9;
					}
				}

				@keyframes useit1-pattern-drift {
					from {
						transform: translateX(0) translateY(0);
					}
					to {
						transform: translateX(-60px) translateY(-60px);
					}
				}
			`}</style>
		</div>
	);
};

export default Chat;
