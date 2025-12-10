FROM node:20-alpine

RUN apk add --no-cache go

WORKDIR /app

COPY package.json .
COPY go.mod .
COPY go.sum .
COPY . .

RUN npm install && go mod tidy
RUN npm run build