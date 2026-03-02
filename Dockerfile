FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production=false

COPY tsconfig.json ./
COPY src ./src
COPY agents ./agents
COPY schedule.yaml ./

RUN npm run build
RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/server.js"]
