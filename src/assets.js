import { Info } from '@nodegui/os-utils';

const isDarkMode = Info.isDarkMode();

import addLight from '../assets/add.png';
import addDark from '../assets/add-dark.png';

import stateLoadingLight from '../assets/state-loading.png';
import stateLoadingDark from '../assets/state-loading-dark.png';

import stateEmptyLight from '../assets/state-empty.png';
import stateEmptyDark from '../assets/state-empty-dark.png';

import stateFailedLight from '../assets/state-failed.png';
import stateFailedDark from '../assets/state-failed-dark.png';

import stateSuccessLight from '../assets/state-success.png';
import stateSuccessDark from '../assets/state-success-dark.png';

const assets = {
	light: {
		addPath: addLight,
		stateLoadingPath: stateLoadingLight,
		stateEmptyPath: stateEmptyLight,
		stateFailedPath: stateFailedLight,
		stateSuccessPath: stateSuccessLight,
		stateLoadingPathSelected: stateLoadingDark,
		stateEmptyPathSelected: stateEmptyDark,
		stateFailedPathSelected: stateFailedDark,
		stateSuccessPathSelected: stateSuccessDark,
	},
	dark: {
		addPath: addDark,
		stateLoadingPath: stateLoadingDark,
		stateEmptyPath: stateEmptyDark,
		stateFailedPath: stateFailedDark,
		stateSuccessPath: stateSuccessDark,
	},
};

export default isDarkMode ? assets.dark : assets.light;
