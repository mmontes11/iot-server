FROM node:8

ENV WORKDIR /usr/src/iot-backend

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

ADD dist ${WORKDIR}

CMD npm run production