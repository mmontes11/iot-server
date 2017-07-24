FROM node:8

ENV WORKDIR /usr/src/iot_backend

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}

RUN npm install

COPY . ${WORKDIR}

ENV NODE_ENV 'production'
ENV PORT 8080

EXPOSE ${PORT}

CMD ["npm", "start"]