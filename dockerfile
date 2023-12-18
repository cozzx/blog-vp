FROM node:18.19.0-alpine3.19

WORKDIR /app
COPY . /app/

RUN npm install pnpm -g
RUN pnpm install

EXPOSE 8080
CMD ["pnpm", "run" "docs:dev"]
