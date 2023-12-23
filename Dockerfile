FROM node:18
WORKDIR /usr/src
COPY package*.json ./
RUN npm install
RUN npm install -g concurrently
COPY . .
EXPOSE 5000
CMD ["concurrently", "node src/app.js", "node src/services/receiver.js"]