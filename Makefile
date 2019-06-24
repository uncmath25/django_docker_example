.PHONY: install clean flake test up down deploy

install:
	@echo "*** Installing necessary requirements ***"
	pip3 install -r requirements.txt

clean:
	@echo "*** Cleaning unnecessary caches ***"
	@sudo rm -rf `find . -name __pycache__`
	sudo rm -rf .pytest_cache

flake:
	@echo "*** Linting python code ***"
	flake8 . --ignore="E501"

up:
	@echo "*** Running Django Dockerized Environment ***"
	@echo "Webserver available at http://localhost:8030"
	docker-compose -f docker-compose.yml up -d --build --remove-orphans

down:
	@echo "*** Stopping Django Dockerized Environment ***"
	docker-compose -f docker-compose.yml down --remove-orphans
	make clean

deploy: clean
	@echo "*** Deploying Django Dockerized Webserver at http://localhost:8000 ***"
	# docker run -e MYSQL_DATABASE="todo_list" -e MYSQL_ROOT_PASSWORD="PASSWORD" -p 3306:3306 -d --rm mariadb:10.3
	docker build -t uncmath25/django_todo_list:latest -f Dockerfile .
	docker run --rm -d --network host uncmath25/django_todo_list:latest
