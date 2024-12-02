DOCKER_COMPOSE = docker-compose -f docker-compose.yml

all: build

build:
	${DOCKER_COMPOSE} build 
	sleep 3
	${DOCKER_COMPOSE} up -d
	sleep 3
	${DOCKER_COMPOSE} exec django python manage.py makemigrations
	sleep 3
	${DOCKER_COMPOSE} exec django python manage.py migrate

up:
	${DOCKER_COMPOSE} up -d

down:
	${DOCKER_COMPOSE} down --rmi all

rm_images:
	${DOCKER_COMPOSE} down --rmi all

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