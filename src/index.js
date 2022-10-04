import { QMainWindow } from '@nodegui/nodegui';
import App from './app.js';

const main = async () => {
	const app = new App();
	const win = new QMainWindow();
	win.setWindowTitle('EXIF Reader');
	win.setCentralWidget(app.widget);
	win.show();

	global.win = win;
};

main().catch(console.error);
