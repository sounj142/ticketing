FROM node:16.5.0-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD [ "npm", "start" ]