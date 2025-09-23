import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaStop, FaTrash } from "react-icons/fa";

const AudioRecorder = ({ onAudioStop }) => {
	const [isRecording, setIsRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);
	const mediaRecorderRef = useRef(null);
	const chunksRef = useRef([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			mediaRecorderRef.current = new MediaRecorder(stream);
			chunksRef.current = [];

			mediaRecorderRef.current.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunksRef.current.push(e.data);
				}
			};

			mediaRecorderRef.current.onstop = () => {
				const audioBlob = new Blob(chunksRef.current, {
					type: "audio/wav",
				});
				setAudioBlob(audioBlob);
				if (onAudioStop) {
					onAudioStop(audioBlob);
				}
				// Stop all tracks to release the microphone
				stream.getTracks().forEach((track) => track.stop());
			};

			mediaRecorderRef.current.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Error accessing microphone:", error);
			alert(
				"Error accessing microphone. Please ensure you have given permission to use the microphone."
			);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const cancelRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			setAudioBlob(null);
			if (onAudioStop) {
				onAudioStop(null);
			}
		}
	};

	// Cleanup function
	useEffect(() => {
		return () => {
			if (mediaRecorderRef.current && isRecording) {
				mediaRecorderRef.current.stop();
			}
		};
	}, [isRecording]);

	return (
		<div className="flex items-center gap-2">
			{!isRecording ? (
				<button
					onClick={startRecording}
					className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
					title="Start Recording"
				>
					<FaMicrophone size={32} />
				</button>
			) : (
				<>
					<button
						onClick={stopRecording}
						className="p-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors"
						title="Stop Recording"
					>
						<FaStop size={32} />
					</button>
					{/* <button
						onClick={cancelRecording}
						className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
						title="Cancel Recording"
					>
						<FaTrash size={16} />
					</button> */}
				</>
			)}
		</div>
	);
};

export default AudioRecorder;
