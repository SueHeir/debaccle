FROM node:16
WORKDIR /usr/src/app



COPY package.json ./
COPY yarn.lock ./

RUN yarn





COPY . . 
COPY .env.production ./.env
COPY precise-datum-351121-afa36c0f5203.json /usr/src/precise-datum-351121-afa36c0f5203.json

RUN yarn build


ENV NODE_ENV production

EXPOSE 8080
CMD ["yarn","mig:up"]

CMD ["node","dist/index.js"]
USER node