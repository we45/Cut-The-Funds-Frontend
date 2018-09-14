FROM node:8
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD package.json /usr/src/app/package.json
RUN npm install && npm install pm2 -g
ADD . /usr/src/app
RUN npm run build
RUN rm -rf ./build && rm -rf ./src
ENV PORT=5000
EXPOSE 5000
CMD pm2 start --no-daemon ./bin/www