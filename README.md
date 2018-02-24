# iot-backend

[![Build Status](https://travis-ci.org/mmontes11/iot-backend.svg?branch=develop)](https://travis-ci.org/mmontes11/iot-backend)
[![Coverage Status](https://coveralls.io/repos/github/mmontes11/iot-backend/badge.svg?branch=develop)](https://coveralls.io/github/mmontes11/iot-backend?branch=develop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Generic purpose ES6 NodeJS + MongoDB + Redis IoT backend 

### Run in development

```bash
$ npm start
```
### Run tests and show coverage

```bash
$ npm test
```

### Build server image

```bash
$ npm run dist 
$ docker build -t iot-backend .
```

### DockerHub

Server image available on [Docker Hub](https://hub.docker.com/r/mmontes11/iot-backend/)

### Deploy using Docker Compose

Configure env variables:
* [.env](https://github.com/mmontes11/iot-backend/blob/develop/.env)

```bash
$ docker-compose up -d 
```

### Test requests with Postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/51c5ec6b69c744e25a5a)