FROM node:8-slim

RUN apt-get update && apt-get -y install mongodb mongodb-server mongodb-clients

ADD . /mapcontrib

WORKDIR /mapcontrib
RUN npm install
RUN npm run build

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080
VOLUME ["/mapcontrib/config", "/mapcontrib/public/files", "/var/lib/mongo"]

CMD ["/entrypoint.sh"]
