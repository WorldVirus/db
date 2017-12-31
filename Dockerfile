FROM ubuntu:16.04

MAINTAINER Kuklina Nina

# Обвновление списка пакетов
RUN apt-get -y update

#
# Установка postgresql
#
RUN apt-get install -y postgresql

# Run the rest of the commands as the ``postgres`` user created by the ``postgres-$PGVER`` package when it was ``apt-get installed``
USER postgres

# Create a PostgreSQL role named ``docker`` with ``docker`` as the password and
# then create a database `docker` owned by the ``docker`` role.
RUN /etc/init.d/postgresql start &&\
    psql --command "CREATE USER maildb WITH SUPERUSER PASSWORD '123';" &&\
    createdb -E utf8 -T template0 -O maildb maildb &&\
    psql maildb --command "CREATE TABLE IF NOT EXISTS users (userId SERIAL PRIMARY KEY, about TEXT, email TEXT, fullname TEXT, nickname TEXT);" &&\
    psql maildb --command "CREATE TABLE IF NOT EXISTS forums (forumID SERIAL PRIMARY KEY, posts INTEGER, slug TEXT, threads INTEGER, title TEXT, userID INTEGER, userNickname TEXT);" &&\
    psql maildb --command "CREATE TABLE IF NOT EXISTS branches (branchId  INTEGER, authorBranchId INTEGER, authorBranchNickname TEXT, created TIMESTAMPTZ, forumId INTEGER, forumSlug TEXT, message TEXT, slug TEXT, title TEXT, votes INTEGER);" &&\
    psql maildb --command "CREATE TABLE IF NOT EXISTS posts (author TEXT, created TIMESTAMPTZ, forum TEXT, forumId INTEGER, idPost INTEGER, isEdited BOOLEAN, message TEXT, parent INTEGER, threadId INTEGER, threadSlug TEXT);" &&\
    psql maildb --command "CREATE TABLE IF NOT EXISTS votes (voteId SERIAL PRIMARY KEY, nickname TEXT, branchId INTEGER, branchSlug TEXT, voice INTEGER);" &&\
    /etc/init.d/postgresql stop

# Expose the PostgreSQL port
EXPOSE 5432

# Add VOLUMEs to allow backup of config, logs and databases
VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

# Back to the root user
USER root

#
# Сборка проекта
#

# Установка Nodejs & npm
RUN apt-get install -y nodejs nodejs-legacy npm

# Копируем исходный код в Docker-контейнер
ENV APP /root/app
ADD ./ $APP

# Собираем и устанавливаем пакет
WORKDIR $APP
RUN npm install

# Объявлем порт сервера
EXPOSE 5000

#
# Запускаем PostgreSQL и сервер
#
CMD service postgresql start && node index.js
