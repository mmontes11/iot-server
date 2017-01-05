FROM node:6

ENV workdir /usr/src/node_template

RUN mkdir ${workdir}

WORKDIR ${workdir}

