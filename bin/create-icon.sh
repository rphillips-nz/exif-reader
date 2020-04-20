#!/bin/bash

export TEMP=temp.iconset
export SOURCE=assets/logo.png

mkdir $TEMP
sips -z 16 16     $SOURCE --out $TEMP/icon_16x16.png
sips -z 32 32     $SOURCE --out $TEMP/icon_16x16@2x.png
sips -z 32 32     $SOURCE --out $TEMP/icon_32x32.png
sips -z 64 64     $SOURCE --out $TEMP/icon_32x32@2x.png
sips -z 128 128   $SOURCE --out $TEMP/icon_128x128.png
sips -z 256 256   $SOURCE --out $TEMP/icon_128x128@2x.png
sips -z 256 256   $SOURCE --out $TEMP/icon_256x256.png
sips -z 512 512   $SOURCE --out $TEMP/icon_256x256@2x.png
sips -z 512 512   $SOURCE --out $TEMP/icon_512x512.png
cp $SOURCE $TEMP/icon_512x512@2x.png
iconutil -c icns -o deploy/darwin/EXIF\ Reader.app/Contents/Resources/iconfile.icns $TEMP
rm -R $TEMP