#!/usr/bin/env bash

cd `dirname $0`
test -e node_modules || npm install
rm -rf *.tgz package
LOCAL=`pwd`
cd ..
npm pack && mv *.tgz $LOCAL
cd $LOCAL
TGZ=`ls -1t |head -n1`
tar xzf $TGZ && echo $TGZ >package/TGZ_NAME
rm -rf node_modules/logging2file
mv package node_modules/logging2file

echo "Using package: `cat node_modules/logging2file/TGZ_NAME`"

