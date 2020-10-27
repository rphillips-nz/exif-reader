<p align="center"><img src="https://raw.githubusercontent.com/rphillips-nz/exif-reader/master/raw/bumblebee.svg" alt="Nice, unrelated image of a bumblebee"  width="380"></p>
<h1 align="center">EXIF Reader</h1>
<p align="center">Cross-platform desktop app to parse and display EXIF headers from images.</p>
<p align="center">📦 <strong><a href="https://github.com/rphillips-nz/exif-reader/releases/latest/download/EXIF.Reader.zip">Download latest macOS release</a></strong></p>

&nbsp;

![Screenshot of EXIF Reader](https://raw.githubusercontent.com/rphillips-nz/exif-reader/master/raw/screenshot.png)

&nbsp;

[Features](#features)
&bull;
[Development](#development)
&bull;
[License](#license)

---

## Features

- 📄 Supports multiple file types (JPG/JPEG, PNG, TIF/TIFF, HEIC)
- 🕶 Dark mode support for macOS
- 💧 Drag and drop files
- 🚀 Fast parsing and UI

## Development

Make sure you have met the requirements listed here: https://docs.nodegui.org/#/tutorial/development-environment

```sh
npm install
npm start
```

### Building

EXIF Reader is packaged with [@nodegui/packer](https://github.com/nodegui/packer).

#### Step 1: (_**Run this command only once per platform**_)

> This has already been run for macOS, but you'll need to run it for other platforms.

```sh
npx nodegui-packer --init 'EXIF Reader'
```

This creates the `deploy` directory with a template. Here you can add icons, change the app name, description and add other native features or dependencies. Make sure you commit this directory.

#### Step 2: (_**Run this command every time you want to build a new distributable**_)

Creates the JavaScript bundle along with assets inside the `dist` directory:

```sh
npm run build
```

Build the distributable based on the template, the output is in the `/deploy/<platform>/build` directory (ignored in git):

```sh
npm run package
```

## License

MIT
