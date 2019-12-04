FROM node:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /usr/src/app
COPY . .

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]