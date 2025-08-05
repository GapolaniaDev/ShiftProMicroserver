FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . .
RUN npm run build

RUN npm prune --production

EXPOSE 5004

CMD ["npm", "run", "start:prod"]