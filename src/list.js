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
