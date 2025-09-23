import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaImage, FaTrash } from "react-icons/fa";
import useStore from "../Store/Store";
import AudioRecorder from "../Components/AudioRecorder";
import Navbar from "../Components/Navbar";
import MessageBubble from "../Components/MessageBubble";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { isDarkMode } = useStore();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/getchats`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (data.chats) setMessages(data.chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content, type = "text") => {
    if (!content) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: content, type }),
      });
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result);
        const success = await handleSendMessage(reader.result, "image");
        if (success) setImagePreview(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioStop = (blob) => setAudioBlob(blob);

  const handleAudioUpload = async () => {
    if (!audioBlob) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const audioData = reader.result;
      const success = await handleSendMessage(audioData, "audio");
      if (success) setAudioBlob(null);
    };
    reader.readAsDataURL(audioBlob);
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
        <header
          className={`sticky top-16 z-20 p-6 border-b backdrop-blur-md bg-opacity-80 shadow-lg ${
            isDarkMode
              ? "border-gray-600 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
              : "border-green-300 bg-gradient-to-r from-green-200 via-green-100 to-green-200"
          }`}
        >
          <h1 className="text-3xl font-extrabold tracking-wide select-none text-gradient-green">
            Krishi SETU AI Assistant
          </h1>
          <p className={`mt-1 text-sm select-none ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
            Ask me anything about agriculture
          </p>
        </header>

        {/* Main chat area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-transparent max-w-full">
          {messages.length === 0 && !isLoading && (
            <p className={`text-center mt-20 select-none ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
              Start the conversation by typing a message below.
            </p>
          )}

          {messages.map((message, index) => (
            <MessageBubble key={message.id ?? `msg-${index}`} message={message} isDarkMode={isDarkMode} className="max-w-full" />
          ))}

          {isLoading && (
            <div className={`flex items-center space-x-3 max-w-xs rounded-xl p-3 ${isDarkMode ? "bg-green-900" : "bg-green-100"} shadow-lg`}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
              <span className="ml-2 text-green-500 font-semibold text-sm select-none">AI is typing...</span>
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
          {/* Image preview */}
          {imagePreview && (
            <div className="relative max-w-xs mx-auto rounded-3xl overflow-hidden shadow-2xl ring-2 ring-green-500/60">
              <img src={imagePreview} alt="Preview" className="w-full object-contain select-none" draggable={false} />
              <button
                onClick={() => setImagePreview(null)}
                aria-label="Remove image preview"
                className="absolute top-4 right-4 p-2 bg-red-700 hover:bg-red-800 rounded-full text-white shadow-lg transition"
              >
                <FaTrash size={18} />
              </button>
            </div>
          )}

          {/* Audio preview */}
          {audioBlob && (
            <div className="flex items-center justify-center gap-5 max-w-xs mx-auto">
              <audio controls className="rounded-3xl w-full shadow-inner ring-2 ring-green-500/70" src={URL.createObjectURL(audioBlob)} />
              <button onClick={handleAudioUpload} aria-label="Send audio message" className="p-4 bg-green-600 hover:bg-green-700 rounded-3xl text-white shadow-lg transition">
                <FaPaperPlane size={20} />
              </button>
              <button onClick={() => setAudioBlob(null)} aria-label="Discard audio message" className="p-4 bg-red-700 hover:bg-red-800 rounded-3xl text-white shadow-lg transition">
                <FaTrash size={20} />
              </button>
            </div>
          )}

          {/* Input & controls */}
          <div className="flex items-center gap-5">
            <form onSubmit={handleTextSubmit} className="flex flex-1 gap-5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className={`flex-1 rounded-3xl border-2 px-6 py-4 text-lg placeholder-green-400 focus:outline-none focus:ring-4 focus:ring-green-500 transition shadow-lg max-w-full ${
                  isDarkMode ? "bg-green-900 border-green-700 text-green-100" : "bg-green-50 border-green-300 text-green-900"
                }`}
                autoComplete="off"
                spellCheck={false}
                aria-label="Message input"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                aria-label="Send message"
                className={`flex items-center justify-center rounded-3xl px-7 py-4 text-white text-lg font-semibold transition shadow-xl ${
                  inputText.trim()
                    ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 cursor-pointer"
                    : "bg-green-300 cursor-not-allowed"
                }`}
              >
                <FaPaperPlane size={22} />
              </button>
            </form>

            <AudioRecorder onAudioStop={handleAudioStop} />

            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload image"
              className="p-4 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition"
            >
              <FaImage size={22} />
            </button>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
          pointer-events: none;
          animation: useit1-bg-flow 25s ease-in-out infinite;
          z-index: 0;
        }

        .useit1-login-bg::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
          animation: useit1-pattern-drift 30s linear infinite;
          z-index: 0;
        }

        @keyframes useit1-bg-flow { /* keep your flow animation */ }
        @keyframes useit1-pattern-drift { from { transform: translateX(0) translateY(0); } to { transform: translateX(-60px) translateY(-60px); } }
      `}</style>
    </div>
  );
};

export default Chat;
