import {
	QWidget,
	QLabel,
	FlexLayout,
	QPushButton,
	QIcon,
	FileMode,
	WidgetEventTypes,
	QDragMoveEvent,
	QDragLeaveEvent,
	QDropEvent,
	CursorShape,
	QFileDialog,
} from '@nodegui/nodegui';
import { Info } from '@nodegui/os-utils';

import List from './list.js';
import Details from './details.js';
import Colours from './colours.js';
import Assets from './assets.js';

export default class App {
	constructor() {
		this.widget = new QWidget();
		this.widget.setObjectName('body');
		this.widget.setLayout(new FlexLayout());

		const sidebar = new QWidget();
		sidebar.setObjectName('sidebar');
		sidebar.setLayout(new FlexLayout());

		this.list = new List(this.onChangeList.bind(this));
		this.details = new Details();

		const controls = new QWidget();
		controls.setObjectName('controls');
		controls.setLayout(new FlexLayout());

		const addButton = new QPushButton();
		addButton.setIcon(new QIcon(Assets.addPath));
		addButton.addEventListener('clicked', this.onAddClick.bind(this), false);
		addButton.setCursor(CursorShape.PointingHandCursor);

		const controlsLabel = new QLabel();
		controlsLabel.setObjectName('controlsLabel');
		controlsLabel.setText('Select or drop images');

		this.widget.setAcceptDrops(true);

		this.widget.addEventListener(WidgetEventTypes.DragEnter, (e) => {
			const dragMoveEvent = new QDragMoveEvent(e);
			const mimeData = dragMoveEvent.mimeData();
			const urls = mimeData.urls();

			controlsLabel.setText(`Drop to add ${urls.length > 1 ? `${urls.length} images` : 'image'}`);
			dragMoveEvent.accept();
		});

		this.widget.addEventListener(WidgetEventTypes.DragLeave, (e) => {
			controlsLabel.setText('Select or drop images');
			const dragLeaveEvent = new QDragLeaveEvent(e);
			dragLeaveEvent.ignore();
		});

		this.widget.addEventListener(WidgetEventTypes.Drop, async (e) => {
			controlsLabel.setText('Select or drop images');
			const dropEvent = new QDropEvent(e);
			const mimeData = dropEvent.mimeData();
			const urls = mimeData.urls();

			await this.addFiles(urls.map((url) => {
				return url.toString().replace('file://', '');
			}));
		});

		controls.layout.addWidget(addButton);
		controls.layout.addWidget(controlsLabel);

		sidebar.layout.addWidget(controls);
		sidebar.layout.addWidget(this.list.widget);

		this.widget.layout.addWidget(sidebar);
		this.widget.layout.addWidget(this.details.widget);

		this.widget.setStyleSheet(`
			* {
				color: ${Colours.text};
				font-weight: 400;
			}

			#body,
			#sidebar {
				height: '100%';
			}

			#body {
				flex: 1;
				flex-direction: 'row';
				min-height: 700px;
				min-width: 900px;
			}

			#sidebar {
				flex: 1 0 300px;
				min-width: 300px;
			}

			#controlsLabel {
				margin-left: 3px;
				color: ${Colours.textSecondary};
				flex: 1;
			}

			#controls {
				border-bottom: 1px solid ${Colours.supportBorder};
				background-color: ${Colours.supportBackground};
				flex-direction: 'row';
				padding: 5px;
				padding-left: 10px;
			}

			QPushButton {
				border-top: 1px solid ${Colours.buttonBorderTop};
				border-bottom: 1px solid ${Colours.buttonBorderBottom};
				background-color: ${Colours.buttonBackground};
				color: ${Colours.buttonText};
				padding: 2px 3px;
				border-radius: 4px;
				margin: 0;
			}

			QPushButton:pressed {
				background-color: ${Colours.buttonActiveBackground};
				border-top: 2px solid ${Colours.buttonActiveBackground};
				border-bottom: 0;
			}`
		);
	}

	onChangeList(listItem) {
		this.details.setText(listItem.outputFormatted);
	}

	onListItemLoad(listItem) {
		if (listItem.isSelected) {
			this.onChangeList(listItem);
		}
	}

	async addFiles(filePaths) {
		for (const filePath of filePaths) {
			const listItem = this.list.addListItem(filePath, this.onListItemLoad.bind(this));

			if (filePath === filePaths[filePaths.length - 1]) {
				listItem.onClick();
			}
		}
	}

	async onAddClick(e) {
		const fileDialog = new QFileDialog();
		fileDialog.setFileMode(FileMode.ExistingFiles);
		fileDialog.setNameFilter('Images (*.jpg *.jpeg *.heic *.tif *.tiff *.png)');
		fileDialog.exec();

		await this.addFiles(fileDialog.selectedFiles());
	}
}
