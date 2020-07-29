import { Info } from '@nodegui/os-utils';

const isDarkMode = Info.isDarkMode();

const colours = {
	light: {
		text: '#111111',
		textSecondary: '#888888',
		contentBackground: "#ffffff",
		contentBorder: "#e6e6e6",
		supportBackground: "#ececec",
		supportBorder: "#d5d5d5",
		selectedBackground: "#1067DE",
		buttonBackground: "TODO",
		buttonActiveBackground: "TODO",
		buttonBorder: "TODO",
		buttonText: "TODO",
	},
	dark: {
		text: "#ffffff",
		textSecondary: '#aaaaaa',
		contentBackground: "#1e1e1e",
		contentBorder: "#000000",
		supportBackground: "#323232",
		supportBorder: "#555555",
		selectedBackground: "#0d56CA",
		buttonBackground: "#6e6e6e",
		buttonActiveBackground: "#919191",
		buttonBorder: "#858585",
		buttonText: "#fafafa",
	},
};

export default isDarkMode ? colours.dark : colours.light;
