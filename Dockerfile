FROM node:6

ENV workdir /usr/src/node_template
ENV port 8080

RUN mkdir ${workdir}

WORKDIR ${workdir}

COPY package.json ${workdir}

RUN npm install

RUN export NODE_ENV='production'

EXPOSE ${port}

CMD ["npm", "start"]