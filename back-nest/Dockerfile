FROM node:24-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "npm run start:seed && npm run start:dev"]
