#!/usr/bin/env bash

cd `dirname $0`
if [ ! -s node_modules/DONE ]; then
	npm install
	date +%Y-%m-%dT%H:%M:%S%z > node_modules/DONE
fi
MOCHA=`which mocha`
[ -z $MOCHA ] && npm install -g mocha
$MOCHA index.js
