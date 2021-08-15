# syntax=docker/dockerfile:1

FROM node
ENV NODE_ENV=production

WORKDIR /mnt/repos/blueberry-api-products

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "nodemon", "server/server.js" ]