import { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";
import useStore from "../Store/Store";

export const Alert = ({ type, title, message, onClose, duration = 3000 }) => {
	const [isVisible, setIsVisible] = useState(true);
	const { isDarkMode } = useStore();

	useEffect(() => {
		if (duration) {
			const timer = setTimeout(() => {
				setIsVisible(false);
				if (onClose) onClose();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	if (!isVisible) return null;

	const alertStyles = {
		success: {
			bg: isDarkMode ? "bg-green-800" : "bg-green-50",
			border: "border-green-400",
			text: isDarkMode ? "text-green-100" : "text-green-800",
			icon: <FaCheckCircle className="w-5 h-5 text-green-400" />,
		},
		error: {
			bg: isDarkMode ? "bg-red-800" : "bg-red-50",
			border: "border-red-400",
			text: isDarkMode ? "text-red-100" : "text-red-800",
			icon: <FaExclamationCircle className="w-5 h-5 text-red-400" />,
		},
	}[type];

	return (
		<div className="fixed top-16 left-0 right-0 sm:left-auto z-50 animate-slide-in px-4 sm:px-0">
			<div
				className={`${alertStyles.bg} ${alertStyles.border} border-l-4 p-4 rounded-md shadow-xl w-full sm:w-[420px] mx-auto sm:mx-4`}
				role="alert"
			>
				<div className="flex items-start">
					<div className="flex-shrink-0">{alertStyles.icon}</div>
					<div className="ml-3 flex-1">
						<p className={`font-medium ${alertStyles.text}`}>
							{title}
						</p>
						{message && (
							<p className={`mt-1 text-sm ${alertStyles.text}`}>
								{message}
							</p>
						)}
					</div>
					<div className="ml-4 flex-shrink-0 flex">
						<button
							className={`inline-flex ${alertStyles.text} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-400`}
							onClick={() => {
								setIsVisible(false);
								if (onClose) onClose();
							}}
						>
							<FaTimes className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

// Wrapper components for convenience
export const SuccessAlert = (props) => <Alert type="success" {...props} />;
export const ErrorAlert = (props) => <Alert type="error" {...props} />;
