import {
	QPlainTextEdit,
	QWidget,
	FlexLayout,
	QScrollArea,
} from '@nodegui/nodegui';

export default class Details {
	constructor() {
		this.widget = new QWidget();
		this.widget.setObjectName('details');
		this.widget.setLayout(new FlexLayout());

		this.detailsText = new QPlainTextEdit();
		this.detailsText.setObjectName('detailsText');
		this.detailsText.setReadOnly(true);

		const detailsTextScroll = new QScrollArea();
		detailsTextScroll.setWidget(this.detailsText);

		this.widget.layout.addWidget(detailsTextScroll);

		this.widget.setStyleSheet(`
			#details {
				flex: 4 0 400px;
				border-left: 1px solid #dedede;
				height: '100%';
			}

			QScrollArea {
				border: 0;
				flex: 1;
				width: '100%';
				height: '100%';
			}

			#detailsText {
				border: 0;
				text-align: top;
				font-size: 12px;
				font-family: 'Monaco';
				background-color: #fefefe;
			}`
		);
	}

	setText(text) {
		this.detailsText.setPlainText(text);
	}
}
