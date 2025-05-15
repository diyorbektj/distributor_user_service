FROM node:18.18.0

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm install

COPY . /usr/src/app

RUN npm run build

CMD ["npm", "start", "start:prod"]