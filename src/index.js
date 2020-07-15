import exifr from 'exifr';
import {
	QPlainTextEdit,
	QMainWindow,
	QWidget,
	QLabel,
	FlexLayout,
	QPushButton,
	QIcon,
	FileMode,
	QScrollArea,
	ScrollBarPolicy,
	AlignmentFlag,
	WidgetEventTypes,
	QErrorMessage,
	QDragMoveEvent,
	QDragLeaveEvent,
	QDropEvent,
	CursorShape,
	QFileDialog,
} from '@nodegui/nodegui';

import List from './list.js';
import addImage from '../assets/add.png';

let contentText;
let list;

function onChangeList(listItem) {
	contentText.setPlainText(listItem.outputFormatted);
}

async function addFiles(filePaths) {
	for (const filePath of filePaths) {
		let output;

		try {
			output = await exifr.parse(filePath);
		} catch (err) {
			output = {_error: err.message};
		}

		const listItem = list.addListItem(filePath, output);

		if (filePath === filePaths[filePaths.length - 1]) {
			listItem.onClick();
		}
	}
}

async function onAddClick(e) {
	const fileDialog = new QFileDialog();
	fileDialog.setFileMode(FileMode.ExistingFiles);
	fileDialog.setNameFilter('Images (*.jpg *.jpeg *.heic *.tif *.tiff)');
	fileDialog.exec();

	await addFiles(fileDialog.selectedFiles());
}

const main = async () => {
	const win = new QMainWindow();
	win.setWindowTitle('EXIF Reader');

	const body = new QWidget();
	body.setObjectName('body');
	body.setLayout(new FlexLayout());

	const sidebar = new QWidget();
	sidebar.setObjectName('sidebar');
	sidebar.setLayout(new FlexLayout());

	list = new List(onChangeList);

	const content = new QWidget();
	content.setObjectName('content');
	content.setLayout(new FlexLayout());

	contentText = new QPlainTextEdit();
	contentText.setObjectName('contentText');
	contentText.setReadOnly(true);

	const controls = new QWidget();
	controls.setObjectName('controls');
	controls.setLayout(new FlexLayout());

	const button = new QPushButton();
	button.setIcon(new QIcon(addImage));
	button.setText('Add');
	button.addEventListener('clicked', onAddClick, false);
	button.setCursor(CursorShape.PointingHandCursor);

	const controlsLabel = new QLabel();
	controlsLabel.setObjectName('controlsLabel');
	controlsLabel.setText('Select or drop images');

	const contentTextScroll = new QScrollArea();
	contentTextScroll.setWidget(contentText);

	body.setAcceptDrops(true);

	body.addEventListener(WidgetEventTypes.DragEnter, (e) => {
		controlsLabel.setText('Drop to add images');
		const ev = new QDragMoveEvent(e);
		ev.accept();
	});

	body.addEventListener(WidgetEventTypes.DragLeave, (e) => {
		controlsLabel.setText('Select or drop images');
		const ev = new QDragLeaveEvent(e);
		ev.ignore();
	});

	body.addEventListener(WidgetEventTypes.Drop, async (e) => {
		controlsLabel.setText('Select or drop images');
		const dropEvent = new QDropEvent(e);
		const mimeData = dropEvent.mimeData();
		const urls = mimeData.urls();

		await addFiles(urls.map((url) => {
			return url.toString().replace('file://', '');
		}));
	});

	controls.layout.addWidget(button);
	controls.layout.addWidget(controlsLabel);

	sidebar.layout.addWidget(controls);
	sidebar.layout.addWidget(list.widget);
	body.layout.addWidget(sidebar);

	content.layout.addWidget(contentTextScroll);
	body.layout.addWidget(content);

	win.setCentralWidget(body);

	body.setStyleSheet(`
		* {
			color: #222;
			font-weight: 400;
		}

		#body,
		#sidebar,
		#content {
			height: '100%';
		}

		#body,
		#controls,
		#contentText {
			background-color: #fefefe;
		}

		#body {
			flex: 1;
			flex-direction: 'row';
			min-height: 500px;
			min-width: 600px;
		}

		#sidebar {
			flex: 1 0 275px;
		}

		#list {
			background-color: #eee;
			height: '100%';
		}

		#list > QWidget {
			padding: 15px 10px;
			border-bottom: 1px solid #dedede;
		}

		#list QLabel {
			background-color: transparent;
		}

		#list > QWidget:hover {
			background-color: #f5f5f5;
		}

		#controlsLabel {
			margin-left: 3px;
			color: #888;
		}

		#controls {
			border-bottom: 1px solid #dedede;
			flex-direction: 'row';
			padding: 5px;
			padding-left: 10px;
		}

		#content {
			flex: 4 0 400px;
			border-left: 1px solid #dedede;
		}

		QScrollArea {
			border: 0;
			flex: 1;
			width: '100%';
			height: '100%';
		}

		#contentText {
			border: 0;
			text-align: top;
			font-size: 12px;
			font-family: 'Monaco';
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

	win.show();

	global.win = win;
};

main().catch(console.error);
