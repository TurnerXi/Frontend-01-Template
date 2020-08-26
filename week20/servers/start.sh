#!/bin/bash
pm2 start /home/web-server/bin/www && \
pm2 start /home/publish-server/index.js && \
pm2 logs /home/web-server/bin/www