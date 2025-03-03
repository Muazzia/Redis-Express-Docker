FROM node:23

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY ./ ./


EXPOSE 3000

CMD [ "node","index.js" ]
