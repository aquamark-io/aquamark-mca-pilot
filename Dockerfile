FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x build.sh && ./build.sh

EXPOSE 10000
CMD ["npm", "start"]
