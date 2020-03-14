#!/usr/bin/env bash

set -e

cd `dirname $0`
test -e node_modules/logging2file || npm install
MOCHA=`which mocha || true`
if [ -z $MOCHA ]; then
	npm install -g mocha
	MOCHA=`which mocha`
fi
$MOCHA index.js

