FROM node:lts-alpine

RUN apk update && apk add python make g++

WORKDIR /code
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && chown appuser:appgroup /code
USER appuser

COPY --chown=appuser:appgroup package.json package-lock.json ./
RUN npm ci

COPY --chown=appuser:appgroup . .

RUN npm run build

ENV PORT=3000

CMD npm start
