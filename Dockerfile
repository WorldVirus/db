FROM ubuntu:16.04

MAINTAINER Ivaschenko Veniamin

# Обвновление списка пакетов
RUN apt-get -y update

# Установка postgresql
ENV PGVER 10
RUN apt-get install -y wget curl python

RUN echo deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main > /etc/apt/sources.list.d/pgdg.list

RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
         apt-key add -

RUN apt-get -y update

RUN apt-get install -y postgresql-$PGVER
RUN apt-get install -y python-psycopg2
# Run the rest of the commands as the ``postgres`` user created by the ``postgres-$PGVER`` package when it was ``apt-get installed``
USER postgres

# Create a PostgreSQL role named ``docker`` with ``docker`` as the password and
# then create a database `docker` owned by the ``docker`` role.
RUN /etc/init.d/postgresql start &&\
    psql --command "CREATE USER docker WITH SUPERUSER PASSWORD 'docker';" &&\
                       createdb -E utf8 -T template0 -O docker docker &&\
                       /etc/init.d/postgresql stop

# config Postgre
RUN echo "synchronous_commit = off" >> /etc/postgresql/$PGVER/main/postgresql.conf
RUN echo "fsync = off" >> /etc/postgresql/$PGVER/main/postgresql.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/$PGVER/main/postgresql.conf
RUN echo "shared_buffers = 128MB" >> /etc/postgresql/$PGVER/main/postgresql.conf
RUN echo "max_wal_size = 1GB" >> /etc/postgresql/$PGVER/main/postgresql.conf
RUN echo "effective_cache_size = 256MB" >> /etc/postgresql/$PGVER/main/postgresql.conf
RUN echo "work_mem = 8MB" >> /etc/postgresql/$PGVER/main/postgresql.conf

# Expose the PostgreSQL port
EXPOSE 5432

# Add VOLUMEs to allow backup of config, logs and databases
VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

# Back to the root user
USER root
RUN apt-get install libpq-dev -y
RUN apt-get install build-essential -y
#
# Сборка проекта
#

# Установка Nodejs & npm
# install from nodesource using apt-get
# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server
RUN apt-get update && apt-get install -y \
curl
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs


# Копируем исходный код в Docker-контейнер
ADD . /db
WORKDIR /db

# Собираем и устанавливаем пакет
RUN npm install
RUN npm run webpack-prod

# Объявлем порт сервера
EXPOSE 5000

#
# Запускаем PostgreSQL и сервер
ENV PGPASSWORD docker

CMD service postgresql start && psql -h localhost -U docker -d docker -f DATABASE.sql && npm start