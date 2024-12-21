# This is to run whole project in a conatiner
FROM docker:latest

RUN apk add --no-cache docker-compose

WORKDIR /app

COPY . .

CMD ["docker-compose", "up", "--build"]
