FROM node:18.16.0-alpine3.17

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY node-runtime/package.json ./
RUN npm install

COPY node-runtime/ .


EXPOSE 8080

CMD [ "npm", "start"]