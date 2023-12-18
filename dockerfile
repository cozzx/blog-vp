FROM node:18.19.0-alpine3.19

WORKDIR /app
COPY . /app/

RUN npm install pnpm -g
RUN pnpm install

EXPOSE 5173

ENTRYPOINT ["pnpm", "run" "docs:dev"]

