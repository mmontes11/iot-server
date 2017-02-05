FROM node:6

ENV WORKDIR /usr/src/iot_backend
ENV PORT 8080

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}

RUN npm install

COPY . ${WORKDIR}

ENV NODE_ENV 'production'

EXPOSE ${PORT}

CMD ["npm", "start"]