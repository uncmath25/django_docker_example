# Dockerized Django Example

### Description:
This project shows how to Dockerize a Django web server.  Docker-compose facilitates a mysql backend for the Django database which has a persistent Docker volume for testing across multiple sessions.  The Dockerization provides both a contained environment for reproducible Django development and also an easy transition into a production-ready environment.  The Django webserver contains a simple yet comprehensive example involving a "todo list" web app.

### Usage:
* Start the Dockerized environment with `make up`
* Make ongoing changes to your Django applications
* Stop the Dockerized environment with `make down`

### Deployment:
The Django webserver is easily deployed by properly configuring the database credentials in **admin.settings** and then running `make deploy` in the production environment.  Review https://docs.djangoproject.com/en/dev/howto/deployment/checklist/ to ensure that all appropriate configuration are set.
