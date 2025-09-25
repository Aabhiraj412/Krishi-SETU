import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
 import {LanguageProvider}  from "./context/LanguageContext";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<StrictMode>
			<LanguageProvider>
			<App />
			</LanguageProvider>
		</StrictMode>
	</BrowserRouter>
);
