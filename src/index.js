import os from 'os'
import Jimp from 'jimp'
import exifr from 'exifr'
import {
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
	QPixmap,
	WidgetEventTypes,
	QErrorMessage,
	CursorShape,
	QFileDialog } from '@nodegui/nodegui';

import addImage from '../assets/add.png';

let contentLabel;
let list;
let selectedListItem;

const homeDir = os.homedir();

function onListItemClickFn(listItem, output) {
	return () => {
		if (selectedListItem) {
			selectedListItem.setCursor(CursorShape.PointingHandCursor);
			selectedListItem.setInlineStyle(`
				background-color: transparent;
			`);
		}

		selectedListItem = listItem;

		listItem.setCursor(CursorShape.ArrowCursor);
		listItem.setInlineStyle(`
			background-color: #fefefe;
		`);

		contentLabel.setText(output ? JSON.stringify(output, null, 2) : "No headers");
	};
}

async function renderThumbnail(filePath, parent) {
	const label = new QLabel();
	const pixmap = new QPixmap();
	const lenna = await Jimp.read(filePath);
	const thumbnail = await lenna.scaleToFit(30, 30).getBufferAsync(Jimp.AUTO);
	// let thumbnail = await exifr.thumbnail(filePath); // alternate call, only works if in exif data
	pixmap.loadFromData(thumbnail);
	label.setPixmap(pixmap);
	parent.layout.addWidget(label);
}

async function onAddClick(e) {
	const fileDialog = new QFileDialog();
	fileDialog.setFileMode(FileMode.ExistingFiles);
	fileDialog.setNameFilter('Images (*.jpg *.jpeg *.heic *.tif *.tiff)');
	fileDialog.exec();

	const selectedFiles = fileDialog.selectedFiles();
	let lastOnClick;

	for (const filePath of selectedFiles) {
		try {
			let output = await exifr.parse(filePath, true);

			const listItem = new QWidget();
			listItem.setLayout(new FlexLayout());

			const listItemLabel = new QLabel();
			listItemLabel.setText(filePath.replace(homeDir, "~"));

			// await renderThumbnail(filePath, listItem)
			listItem.layout.addWidget(listItemLabel);
			lastOnClick = onListItemClickFn(listItem, output);
			listItem.addEventListener(WidgetEventTypes.MouseButtonPress, lastOnClick, false);
			listItem.setCursor(CursorShape.PointingHandCursor);
			list.layout.addWidget(listItem);
		} catch (e) {
			const errorMessage = new QErrorMessage();
			errorMessage.showMessage(e.message);
		}
	}

	if (lastOnClick) {
		lastOnClick();
	}
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

	list = new QWidget();
	list.setObjectName('list');
	list.setLayout(new FlexLayout());

	const listScroll = new QScrollArea();
	listScroll.setHorizontalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOff);
	listScroll.setWidget(list);

	const content = new QWidget();
	content.setObjectName('content');
	content.setLayout(new FlexLayout());

	contentLabel = new QLabel();
	contentLabel.setObjectName('contentLabel');
	contentLabel.setWordWrap(true);
	contentLabel.setAlignment(AlignmentFlag.AlignTop);

	const controls = new QWidget();
	controls.setObjectName('controls');
	controls.setLayout(new FlexLayout());

	const button = new QPushButton();
	button.setIcon(new QIcon(addImage));
	button.setText("Add");
	button.addEventListener('clicked', onAddClick, false);
	button.setCursor(CursorShape.PointingHandCursor);

	const controlsLabel = new QLabel();
	controlsLabel.setObjectName('controlsLabel');
	controlsLabel.setText('Select images');

	const contentLabelScroll = new QScrollArea();
	contentLabelScroll.setWidget(contentLabel);

	controls.layout.addWidget(button);
	controls.layout.addWidget(controlsLabel);

	sidebar.layout.addWidget(controls);
	sidebar.layout.addWidget(listScroll);
	body.layout.addWidget(sidebar);

	content.layout.addWidget(contentLabelScroll);
	body.layout.addWidget(content);

	win.setCentralWidget(body);

	body.setStyleSheet(
		`
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
			#contentLabel {
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

			#contentLabel {
				text-align: top;
				font-size: 12px;
				padding: 5px;
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
			}
		`
	);

	win.show();

	global.win = win;
}

main().catch(console.error);
