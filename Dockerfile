# syntax=docker/dockerfile:1

FROM node
ENV NODE_ENV=production

WORKDIR /repos/blueberry-api-products

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

RUN npm install pm2 -g

COPY . .

CMD ["pm2-runtime", "--public", "XXX", "--secret", "YYY", "ecosystem.config.js"]