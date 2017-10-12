FROM node:8

ENV WORKDIR /usr/src/iot_backend

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

COPY . ${WORKDIR}

RUN npm install

CMD npm run production