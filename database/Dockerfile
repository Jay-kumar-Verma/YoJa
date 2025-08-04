FROM postgres:latest

ENV POSTGRES_DB yoja_db
ENV POSTGRES_USER yoja_user
ENV POSTGRES_PASSWORD yoja_password

COPY init.sql /docker-entrypoint-initdb.d/ 

EXPOSE 5432