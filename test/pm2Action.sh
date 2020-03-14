#!/usr/bin/env bash

cd `dirname $0`

pm2 stop pm2Action.js > /dev/null 2>&1
pm2 start --no-autorestart pm2Action.js && \
pm2 logs --highlight 'pm2Action'

