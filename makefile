DOCKER_COMPOSE = docker-compose -f docker-compose.yml

all: build up

build:
	${DOCKER_COMPOSE} build
	docker-compose run django python manage.py makemigrations
	docker-compose run django python manage.py migrate

up:
	${DOCKER_COMPOSE} up -d

down:
	${DOCKER_COMPOSE} down --rmi all

rm_images:
	${DOCKER_COMPOSE} --rmi all

logs:
	${DOCKER_COMPOSE} logs nginx

restart:
	${DOCKER_COMPOSE} restart nginx_conatiner postgre_container django_container

clean: down
	${DOCKER_COMPOSE} down -v --rmi all --remove-orphans

fclean: clean
	docker system prune -f

re: fclean all

.PHONY: build up down logs restart rm_images re fclean clean

# docker stop $(docker ps -a -q)
# docker rm $(docker ps -a -q)
# docker rmi $(docker images -q)
# docker volume rm $(docker volume ls -q)
