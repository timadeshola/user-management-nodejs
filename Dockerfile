# FROM node:7.7.2-alpine
FROM node:19.5.0-alpine
WORKDIR /usr/app
COPY package.json .
# COPY keycloak.json .
RUN npm install --quiet
COPY . .