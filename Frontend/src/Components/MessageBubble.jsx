import React from "react";

const parseMarkdown = (text) => {
	if (!text) return "";

	let html = text
		// Headers
		.replace(
			/^### (.*$)/gim,
			'<h3 class="text-lg font-bold mb-0 mt-2">$1</h3>'
		)
		.replace(
			/^## (.*$)/gim,
			'<h2 class="text-xl font-bold mb-0 mt-2">$1</h2>'
		)
		.replace(
			/^# (.*$)/gim,
			'<h1 class="text-2xl font-bold mb-0 mt-2">$1</h1>'
		)

		// Bold and Italic
		.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
		.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.*?)\*/g, "<em>$1</em>")

		// Code blocks
		.replace(
			/```([\s\S]*?)```/g,
			'<pre class="bg-gray-800 text-green-400 p-2 rounded my-0.5 overflow-x-auto text-sm"><code>$1</code></pre>'
		)
		.replace(
			/`(.*?)`/g,
			'<code class="bg-gray-600 text-white px-1 py-0.5 rounded text-xs">$1</code>'
		)

		// Links
		.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>'
		)

		// Convert double line breaks to paragraphs
		.replace(/\n\n/g, '</p><p class="mb-0">')
		// Convert single line breaks to <br>
		.replace(/\n/g, "<br>");

	// Wrap content in paragraph tags
	html = `<p class="mb-1">${html}</p>`;

	// Lists
	const lines = html.split("<br>");
	let inList = false;
	const processedLines = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const isListItem = /^[\s]*[-*+]\s/.test(line);

		if (isListItem) {
			if (!inList) {
				processedLines.push(
					'<ul class="list-disc list-inside my-0.5 space-y-0">'
				);
				inList = true;
			}
			processedLines.push(
				`<li class="leading-tight">${line.replace(
					/^[\s]*[-*+]\s/,
					""
				)}</li>`
			);
		} else {
			if (inList) {
				processedLines.push("</ul>");
				inList = false;
			}
			processedLines.push(line);
		}
	}

	if (inList) {
		processedLines.push("</ul>");
	}

	return processedLines.join("<br>");
};

const MessageBubble = ({message, isDarkMode }) => {
	const renderedMessage = parseMarkdown(message.message);

	return (
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
				{message.image && (
					<img
						src={`${import.meta.env.VITE_API_URL}/public${
							message.image
						}`}
						alt="User uploaded"
						className="max-w-full rounded-lg"
					/>
				)}
				{message.audio && (
					<audio
						controls
						src={`${import.meta.env.VITE_API_URL}/public${
							message.audio
						}`}
						className="w-50 mt-2 rounded-lg sm:w-40 md:w-60 lg:w-80"
					>
						Your browser does not support the audio element.
					</audio>
				)}
				<div
					className="text-sm leading-relaxed"
					dangerouslySetInnerHTML={{ __html: renderedMessage }}
				/>
				<span
					className={`text-xs ${
						message.sender === "user"
							? "text-white/70"
							: "text-gray-500"
					} block mt-2`}
				>
					{new Date(message.createdAt).toLocaleTimeString()}
				</span>
			</div>
		</div>
	);
};

export default MessageBubble;
