FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 4000

CMD ["npm", "start"]
