FROM node:alpine
ADD publish-server /home/publish-server
ADD web-server /home/web-server
ADD start.sh /home/
RUN npm config set registry https://registry.npm.taobao.org && \
  npm install -g pm2
EXPOSE 3000 3010
# CMD ["sh", "/home/start.sh"]