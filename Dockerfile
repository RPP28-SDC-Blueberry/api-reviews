# syntax=docker/dockerfile:1

FROM node
ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /blueberry-api-products

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

RUN npm install pm2 -g

COPY . .

CMD ["pm2-runtime", "--public", "XXX", "--secret", "YYY", "ecosystem.config.js"]