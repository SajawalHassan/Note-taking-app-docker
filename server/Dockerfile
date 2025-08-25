FROM node:20

RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .

RUN npm run build

COPY docker-entrypoint.sh docker-entrypoint.sh
RUN chmod u+x docker-entrypoint.sh

CMD [ "./docker-entrypoint.sh" ]