FROM node:24-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4000

# creates the tables, loads the demo data, then starts the API
CMD ["npm", "run", "dev"]
