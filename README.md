# EXIF Reader

**🌅 Cross-platform desktop app to parse and display EXIF headers from images.**

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

Next you can run the pack command:

```sh
npm run build
```

This creates the JavaScript bundle along with assets inside the `dist` directory.

```sh
npx nodegui-packer --pack ./dist
```

This builds the distributable based on the template. The output is in the `/deploy/<platform>/build` directory (ignored in git).

## License

MIT
