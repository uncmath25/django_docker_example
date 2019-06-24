# Debian Python 3.7 Base Image
FROM python:3.7-slim

# Install packages needed to run your application (not build deps):
#   mime-support -- for mime types when serving static files
#   postgresql-client -- for running database commands
# Need to recreate the /usr/share/man/man{1..8} directories first because they were clobbered by a parent image
RUN set -ex \
    && RUN_DEPS=" \
        libpcre3 \
        mime-support \
        postgresql-client \
    " \
    && seq 1 8 | xargs -I{} mkdir -p /usr/share/man/man{} \
    && apt-get update && apt-get install -y --no-install-recommends $RUN_DEPS \
    && rm -rf /var/lib/apt/lists/*

ARG BUILD_DEPS=" \
        build-essential \
        libpcre3-dev \
        libpq-dev \
        libmariadbclient-dev \
        default-libmysqlclient-dev \
    "

# Install build deps
RUN set -ex \
    && apt-get update && apt-get install -y --no-install-recommends $BUILD_DEPS

# Build python virtual environment and install pip requirements
ADD requirements.txt /requirements.txt
RUN set -ex \
    && python3.7 -m venv /venv \
    && /venv/bin/pip install -U pip \
    && /venv/bin/pip install --no-cache-dir -r /requirements.txt

# Clean up build deps
# RUN set -ex \
#     && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false $BUILD_DEPS \
#     && rm -rf /var/lib/apt/lists/*

# Copy your application code to the container (make sure you create a .dockerignore file if any large files or directories should be excluded)
ARG PROJECT_PATH=/django_project
RUN mkdir $PROJECT_PATH
WORKDIR $PROJECT_PATH
ADD src $PROJECT_PATH

# uWSGI will listen on this port
EXPOSE 8000

# Configure Django settings module
ENV DJANGO_SETTINGS_MODULE=admin.settings

# Configure location of uwsgi module
ENV UWSGI_WSGI_FILE=$PROJECT_PATH/wsgi.py

# Base uWSGI configuration
ENV UWSGI_VIRTUALENV=/venv UWSGI_HTTP=:8000 UWSGI_MASTER=1 UWSGI_HTTP_AUTO_CHUNKED=1 UWSGI_HTTP_KEEPALIVE=1 UWSGI_UID=1000 UWSGI_GID=2000 UWSGI_LAZY_APPS=1 UWSGI_WSGI_ENV_BEHAVIOR=holy

# Number of uWSGI workers and threads per worker
ENV UWSGI_WORKERS=2 UWSGI_THREADS=4

# uWSGI static file serving configuration
# ENV UWSGI_STATIC_MAP="/static/=/code/static/" UWSGI_STATIC_EXPIRES_URI="/static/.*\.[a-f0-9]{12,}\.(css|js|png|jpg|jpeg|gif|ico|woff|ttf|otf|svg|scss|map|txt) 315360000"

# Deny invalid hosts before they get to Django
# ENV UWSGI_ROUTE_HOST="^(?!localhost:8000$) break:400"

ADD django-docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
