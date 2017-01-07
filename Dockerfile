FROM node:6

ENV workdir /usr/src/node_mongo
ENV port 8080

RUN mkdir ${workdir}

WORKDIR ${workdir}

COPY package.json ${workdir}

RUN npm install

COPY . ${workdir}

RUN export NODE_ENV="production"

EXPOSE ${port}

CMD ["npm", "start"]