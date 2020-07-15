import os from 'os';
import {
	QWidget,
	QLabel,
	FlexLayout,
	FileMode,
	QPixmap,
	WidgetEventTypes,
	CursorShape,
} from '@nodegui/nodegui';

const homeDir = os.homedir();

export default class ListItem {
	constructor(filePath, output, onSelect) {
		this.filePath = filePath;
		this.output = output;
		this.onSelect = onSelect;

		this.widget = new QWidget();
		const label = new QLabel();

		label.setText(filePath.replace(homeDir, '~'));

		this.widget.setLayout(new FlexLayout());
		this.widget.layout.addWidget(label);
		this.widget.addEventListener(WidgetEventTypes.MouseButtonPress, this.onClick.bind(this), false);
		this.widget.setCursor(CursorShape.PointingHandCursor);
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
		this.widget.setInlineStyle(`
			background-color: #fefefe;
		`);
	}

	unselect() {
		this.widget.setCursor(CursorShape.PointingHandCursor);
		this.widget.setInlineStyle(`
			background-color: transparent;
		`);
	}

	onClick() {
		this.onSelect(this);
	}
}
