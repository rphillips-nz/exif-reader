# EXIF Reader

**🌅 Cross-platform desktop app to parse and display EXIF headers from images.**

[Download latest release](https://github.com/rphillips-nz/exif-reader/releases/latest/download/EXIF.Reader.zip)

Currently supports the following file types:

- JPG/JPEG
- PNG
- TIF/TIFF
- HEIC

## Develop

Make sure you have met the requirements listed here: https://docs.nodegui.org/#/tutorial/development-environment

```sh
npm install
npm start
```

## Building

EXIF Reader is packaged with [@nodegui/packer](https://github.com/nodegui/packer).

### Step 1: (_**Run this command only once per platform**_)

> This has already been run for macOS, but you'll need to run it for other platforms.

```sh
npx nodegui-packer --init 'EXIF Reader'
```

This creates the `deploy` directory with a template. Here you can add icons, change the app name, description and add other native features or dependencies. Make sure you commit this directory.

### Step 2: (_**Run this command every time you want to build a new distributable**_)

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
