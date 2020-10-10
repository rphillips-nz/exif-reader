import path from 'path';
import fs from 'fs';
import os from 'os';
import {
	QWidget,
	QLabel,
	QIcon,
	FlexLayout,
	FileMode,
	QPixmap,
	TransformationMode,
	AspectRatioMode,
	WidgetEventTypes,
	CursorShape,
} from '@nodegui/nodegui';
import exifr from 'exifr';

import Colours from './colours.js';
import Assets from './assets.js';

const homeDir = os.homedir();

const stateImages = {
	loading: fs.readFileSync(Assets.stateLoadingPath),
	empty: fs.readFileSync(Assets.stateEmptyPath),
	failed: fs.readFileSync(Assets.stateFailedPath),
	success: fs.readFileSync(Assets.stateSuccessPath),
};

export default class ListItem {
	constructor(filePath, onLoad, onSelect) {
		this.filePath = filePath;
		this.onLoad = onLoad;
		this.onSelect = onSelect;

		this.widget = new QWidget();

		this.iconLabel = new QLabel();
		this.iconLabel.setInlineStyle('margin-right: 5px;');

		const label = new QLabel();
		const showFullPath = false; // TODO - make configurable
		if (showFullPath) {
			label.setText(filePath.replace(homeDir, '~'));
		} else {
			label.setText(path.basename(filePath));
		}

		this.widget.setLayout(new FlexLayout());
		this.widget.layout.addWidget(this.iconLabel);
		this.widget.layout.addWidget(label);
		this.widget.addEventListener(WidgetEventTypes.MouseButtonPress, this.onClick.bind(this), false);
		this.widget.setCursor(CursorShape.PointingHandCursor);

		const loadOnSelect = false; // TODO - make configurable
		if (loadOnSelect) {
			this.loading = true;
			this.renderIconLabel();
		} else {
			this.load();
		}
	}

	load() {
		this.loading = true;
		this.renderIconLabel();

		this.loadOutput().then((output) => {
			this.output = output;
			this.loading = false;
			this.renderIconLabel();
			this.onLoad(this);
		});
	}

	get state() {
		if (this.loading) {
			return 'loading';
		} else if (!this.output || !Object.keys(this.output).length) {
			return 'empty';
		} else if (this.output._error) {
			return 'failed';
		} else {
			return 'success';
		}
	}

	get outputFormatted() {
		if (this.output) {
			return this.output._error ?
				this.output._error :
				JSON.stringify(this.output, null, 2);
		}

		return 'No headers';
	}

	select() {
		this.isSelected = true;
		this.widget.setCursor(CursorShape.ArrowCursor);
		this.widget.setInlineStyle(`background-color: ${Colours.selectedBackground};`);
	}

	unselect() {
		this.isSelected = false;
		this.widget.setCursor(CursorShape.PointingHandCursor);
		this.widget.setInlineStyle('');
	}

	renderIconLabel() {
		const pixmap = new QPixmap();
		pixmap.loadFromData(stateImages[this.state]);
		this.iconLabel.setPixmap(pixmap.scaled(18, 18, AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation));
	}

	async loadOutput() {
		try {
			return await exifr.parse(this.filePath);
		} catch (err) {
			return {_error: err.message};
		}
	}

	onClick() {
		this.load();
		this.onSelect(this);
	}
}
