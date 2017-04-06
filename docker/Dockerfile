FROM node:5

RUN apt-get update && apt-get -y install mongodb mongodb-server mongodb-clients

RUN npm install
RUN npm run build

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
VOLUME ./public/files

CMD ["/entrypoint.sh"]
