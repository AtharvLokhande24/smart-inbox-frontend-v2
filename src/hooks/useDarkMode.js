import { useEffect, useState } from "react";

const DARK_MODE_STORAGE_KEY = "darkMode";

function getInitialDarkMode() {
	const stored = localStorage.getItem(DARK_MODE_STORAGE_KEY);

	if (stored === "true") {
		return true;
	}

	if (stored === "false") {
		return false;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function useDarkMode() {
	const [darkMode, setDarkMode] = useState(getInitialDarkMode);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
		localStorage.setItem(DARK_MODE_STORAGE_KEY, String(darkMode));
	}, [darkMode]);

	return [darkMode, setDarkMode];
}

