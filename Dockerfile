FROM node:8

ENV WORKDIR /usr/src/iot_backend

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}

RUN npm install

COPY . ${WORKDIR}

CMD ["npm", "run", "production"]