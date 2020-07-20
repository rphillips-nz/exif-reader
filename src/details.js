import {
	QPlainTextEdit,
	QWidget,
	FlexLayout,
	QScrollArea,
} from '@nodegui/nodegui';

export default class Details {
	constructor() {
		this.widget = new QWidget();
		this.widget.setObjectName('content');
		this.widget.setLayout(new FlexLayout());

		this.contentText = new QPlainTextEdit();
		this.contentText.setObjectName('contentText');
		this.contentText.setReadOnly(true);

		const contentTextScroll = new QScrollArea();
		contentTextScroll.setWidget(this.contentText);

		this.widget.layout.addWidget(contentTextScroll);

		this.widget.setStyleSheet(`
			#content {
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

			#contentText {
				border: 0;
				text-align: top;
				font-size: 12px;
				font-family: 'Monaco';
				background-color: #fefefe;
			}`
		);
	}

	setText(text) {
		this.contentText.setPlainText(text);
	}
}
