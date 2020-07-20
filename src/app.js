import exifr from 'exifr';
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

import List from './list.js';
import Details from './details.js';
import addImage from '../assets/add.png';

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

		const button = new QPushButton();
		button.setIcon(new QIcon(addImage));
		button.setText('Add');
		button.addEventListener('clicked', this.onAddClick, false);
		button.setCursor(CursorShape.PointingHandCursor);

		const controlsLabel = new QLabel();
		controlsLabel.setObjectName('controlsLabel');
		controlsLabel.setText('Select or drop images');

		this.widget.setAcceptDrops(true);

		this.widget.addEventListener(WidgetEventTypes.DragEnter, (e) => {
			const dragMoveEvent = new QDragMoveEvent(e);
			const mimeData = dragMoveEvent.mimeData();
			const urls = mimeData.urls();
			controlsLabel.setText(`Drop to add ${urls.length} images`);
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

		controls.layout.addWidget(button);
		controls.layout.addWidget(controlsLabel);

		sidebar.layout.addWidget(controls);
		sidebar.layout.addWidget(this.list.widget);

		this.widget.layout.addWidget(sidebar);
		this.widget.layout.addWidget(this.details.widget);

		this.widget.setStyleSheet(`
			* {
				color: #222;
				font-weight: 400;
			}

			#body,
			#sidebar {
				height: '100%';
			}

			#body,
			#controls {
				background-color: #fefefe;
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
				color: #888;
				flex: 1;
			}

			#controls {
				border-bottom: 1px solid #dedede;
				flex-direction: 'row';
				padding: 5px;
				padding-left: 10px;
			}

			QPushButton {
				border: 1px solid #dedede;
				background-color: #fefefe;
				padding: 5px 15px 5px 10px;
				border-radius: 3px;
				margin: 0;
			}

			QPushButton:hover {
				border: 1px solid #bababa;
			}

			QPushButton:pressed {
				background-color: #eee;
			}`
		);
	}

	onChangeList(listItem) {
		this.details.setText(listItem.outputFormatted);
	}

	async addFiles(filePaths) {
		for (const filePath of filePaths) {
			let output;

			try {
				output = await exifr.parse(filePath);
			} catch (err) {
				output = {_error: err.message};
			}

			const listItem = this.list.addListItem(filePath, output);

			if (filePath === filePaths[filePaths.length - 1]) {
				listItem.onClick();
			}
		}
	}

	async onAddClick(e) {
		const fileDialog = new QFileDialog();
		fileDialog.setFileMode(FileMode.ExistingFiles);
		fileDialog.setNameFilter('Images (*.jpg *.jpeg *.heic *.tif *.tiff)');
		fileDialog.exec();

		await this.addFiles(fileDialog.selectedFiles());
	}
}
