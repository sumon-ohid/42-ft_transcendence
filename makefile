DOCKER_COMPOSE = docker-compose -f docker-compose.yml

all: build up

build:
	${DOCKER_COMPOSE} build 

up:
	${DOCKER_COMPOSE} up -d

down:
	${DOCKER_COMPOSE} down

rm_images:
	${DOCKER_COMPOSE} --rmi all

logs:
	${DOCKER_COMPOSE} logs nginx

clean: down
	${DOCKER_COMPOSE} down -v --rmi all --remove-orphans

fclean: clean
	docker system prune -f

re: fclean all

.PHONY: build up down logs rm_images re fclean clean

# docker stop $(docker ps -a -q)
# docker rm $(docker ps -a -q)
# docker rmi $(docker images -q)
# docker volume rm $(docker volume ls -q)


# docker build -t docker-compose-runner .
# docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock -v $(pwd):/app -w /app docker-compose-runner