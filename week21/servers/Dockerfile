FROM node:alpine
ADD publish-server /home/publish-server/
ADD web-server /home/web-server/
RUN npm config set registry https://registry.npm.taobao.org && \
  npm install -g pm2 && \
  cd /home/publish-server && npm install && \
  cd /home/web-server && npm install 
ADD start.sh /home/
EXPOSE 3000 3010
WORKDIR /home
CMD ["sh", "start.sh"]