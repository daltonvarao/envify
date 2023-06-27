rm build.zip
mkdir build

cp -r dist build
cp manifest.json build
cp -r assets build

zip -r build.zip build
rm -rf build