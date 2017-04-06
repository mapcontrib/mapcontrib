FROM node:5


RUN apt-get update && apt-get -y install mongodb mongodb-server mongodb-clients


WORKDIR /tmp
ADD https://github.com/MapContrib/MapContrib/archive/master.tar.gz .
RUN tar -zxf master.tar.gz
RUN mv MapContrib-master /mapcontrib


WORKDIR /mapcontrib
RUN npm install
RUN npm run build
RUN chmod +x docker/entrypoint.sh


EXPOSE 80
VOLUME ./public/files


CMD ["/mapcontrib/docker/entrypoint.sh"]
