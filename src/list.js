import {
	QWidget,
	QLabel,
	FlexLayout,
	QScrollArea,
	ScrollBarPolicy,
} from '@nodegui/nodegui';

import ListItem from './list-item.js';

export default class List {
	constructor(onChange) {
		this.onChange = onChange;

		this.list = new QWidget();
		this.list.setObjectName('list');
		this.list.setLayout(new FlexLayout());

		const listScroll = new QScrollArea();
		listScroll.setHorizontalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOff);
		listScroll.setWidget(this.list);

		this.widget = listScroll;

		this.widget.setStyleSheet(`
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

			QScrollArea {
				border: 0;
				flex: 1;
				width: '100%';
				height: '100%';
			}`
		);
	}

	// TODO check if file exists and if so, reload it
	addListItem(filePath, output) {
		const listItem = new ListItem(filePath, output, this.onSelect.bind(this));
		this.list.layout.addWidget(listItem.widget);
		return listItem;
	}

	onSelect(listItem) {
		if (this.selectedListItem) {
			this.selectedListItem.unselect();
		}

		this.selectedListItem = listItem;
		listItem.select();

		this.onChange(listItem);
	}
}
