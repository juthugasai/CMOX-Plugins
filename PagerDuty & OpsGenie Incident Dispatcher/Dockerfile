FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install --production=false
COPY . .
RUN npx tsc || true
EXPOSE 7890
CMD ["npx", "tsx", "index.ts"]
