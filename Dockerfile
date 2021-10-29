FROM node:lts-alpine

RUN apk update && apk add python3 make g++

WORKDIR /code

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && chown appuser:appgroup /code

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=3000

COPY . .
RUN yarn build

RUN chown -R appuser:appgroup /code
USER appuser

CMD yarn start
