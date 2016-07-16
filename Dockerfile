
FROM node:5

RUN apt-get update && apt-get install mongodb mongodb-server mongodb-clients


WORKDIR /mapcontrib

ADD https://github.com/MapContrib/MapContrib/archive/master.tar.gz .
RUN tar -zxvf ./master.tar.gz

RUN npm install
RUN npm run build

VOLUME ./src/public/files

ADD entrypoint.sh .
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ./entrypoint.sh

# Ports
EXPOSE 80
