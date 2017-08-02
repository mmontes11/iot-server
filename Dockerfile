FROM node:8

ENV WORKDIR /usr/src/iot_backend

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}

RUN npm install

COPY . ${WORKDIR}

ENV NODE_ENV 'production'
ENV NODE_PORT 8080
ENV MONGO_HOST 'mongo_docker'
ENV MONGO_PORT 27017
ENV MONGO_DB 'IoT'
ENV REDIS_HOST 'redis_docker'
ENV REDIS_PORT 6379

EXPOSE ${NODE_PORT}

CMD ["npm", "start"]