import { Info } from '@nodegui/os-utils';

const isDarkMode = Info.isDarkMode();

const colours = {
	light: {
		text: '#111111',
		textSecondary: '#777777',
		contentBackground: '#ffffff',
		contentBorder: '#e6e6e6',
		supportBackground: '#ececec',
		supportBorder: '#d5d5d5',
		selectedBackground: '#1067DE',
		selectedText: '#ffffff',
		buttonBackground: '#ffffff',
		buttonActiveBackground: '#f0f0f0',
		buttonBorderTop: '#ffffff',
		buttonBorderBottom: '#bfbfbf',
		buttonText: '#262626'
	},
	dark: {
		text: '#ffffff',
		textSecondary: '#aaaaaa',
		contentBackground: '#1e1e1e',
		contentBorder: '#000000',
		supportBackground: '#323232',
		supportBorder: '#555555',
		selectedBackground: '#0d56CA',
		selectedText: '#ffffff',
		buttonBackground: '#6e6e6e',
		buttonActiveBackground: '#919191',
		buttonBorderTop: '#858585',
		buttonBorderBottom: '#6e6e6e',
		buttonText: '#fafafa'
	}
};

export default isDarkMode ? colours.dark : colours.light;
