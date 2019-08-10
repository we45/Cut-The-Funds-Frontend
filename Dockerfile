FROM node:10.15.3
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD package.json /usr/src/app/package.json
RUN npm install && npm install -g serve
ADD . /usr/src/app
#RUN npm run build
#RUN rm -rf ./build && rm -rf ./src
ENV HOST=0.0.0.0
ENV PORT=5000
EXPOSE 5000
CMD echo "{\"API_URL\": \"$API_URL\"}" > configure.json && npm run dev
