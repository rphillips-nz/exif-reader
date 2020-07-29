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
	constructor(filePath, output, onSelect) {
		this.filePath = filePath;
		this.output = output;
		this.onSelect = onSelect;

		this.widget = new QWidget();

		const pixmap = new QPixmap();
		const imageData = stateImages[this.state];
		pixmap.loadFromData(imageData);

		const iconLabel = new QLabel();
		iconLabel.setObjectName('icon');
		iconLabel.setPixmap(pixmap.scaled(18, 18, AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation));
		iconLabel.setStyleSheet(`
			#icon {
				margin-right: 5px;
			}`
		);

		const label = new QLabel();
		const showFullPath = false; // TODO - make configurable
		if (showFullPath) {
			label.setText(filePath.replace(homeDir, '~'));
		} else {
			label.setText(path.basename(filePath));
		}

		this.widget.setLayout(new FlexLayout());
		this.widget.layout.addWidget(iconLabel);
		this.widget.layout.addWidget(label);
		this.widget.addEventListener(WidgetEventTypes.MouseButtonPress, this.onClick.bind(this), false);
		this.widget.setCursor(CursorShape.PointingHandCursor);
	}

	get state() {
		if (!this.output || !Object.keys(this.output).length) {
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
		this.widget.setCursor(CursorShape.ArrowCursor);
		this.widget.setInlineStyle(`background-color: ${Colours.selectedBackground};`);
	}

	unselect() {
		this.widget.setCursor(CursorShape.PointingHandCursor);
		this.widget.setInlineStyle('');
	}

	onClick() {
		this.onSelect(this);
	}
}
