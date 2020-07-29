import {
	QWidget,
	QLabel,
	FlexLayout,
	QScrollArea,
	ScrollBarPolicy,
} from '@nodegui/nodegui';

import ListItem from './list-item.js';
import Colours from './colours.js';

export default class List {
	constructor(onChange) {
		this.listItems = [];
		this.onChange = onChange;

		this.list = new QWidget();
		this.list.setObjectName('list');
		this.list.setLayout(new FlexLayout());

		this.widget = new QScrollArea();
		this.widget.setHorizontalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOff);
		this.widget.setWidget(this.list);

		this.widget.setStyleSheet(`
			#list {
				background-color: ${Colours.supportBackground};
				height: '100%';
			}

			#list > QWidget {
				padding: 15px 10px;
				border-bottom: 1px solid ${Colours.supportBorder};
			}

			QScrollArea {
				border: 0;
				flex: 1;
				width: '100%';
				height: '100%';
			}`
		);
	}

	addListItem(filePath, output) {
		let listItem = this.listItems.find(function (listItem) {
			return listItem.filePath === filePath;
		});

		if (listItem) {
			listItem.output = output;
		} else {
			listItem = new ListItem(filePath, output, this.onSelect.bind(this));
			this.listItems.push(listItem);
			this.list.layout.addWidget(listItem.widget);
		}

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
