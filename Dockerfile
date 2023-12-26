# Dockerfile
FROM node
RUN mkdir -p /api
WORKDIR /api
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "server.js"]