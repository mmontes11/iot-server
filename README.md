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
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/51c5ec6b69c744e25a5a#?env%5Biot-dev%5D=W3sidHlwZSI6InRleHQiLCJlbmFibGVkIjp0cnVlLCJrZXkiOiJzZXJ2ZXIiLCJ2YWx1ZSI6ImxvY2FsaG9zdDo5MDAwIn0seyJ0eXBlIjoidGV4dCIsImVuYWJsZWQiOnRydWUsImtleSI6InRva2VuIiwidmFsdWUiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlibUZ0WlNJNkltMXRiMjUwWlhNaUxDSnBZWFFpT2pFMU1EWTNOekV4T0RCOS5KRWw3WjA3QlFsdm5aTzBFZ2tORlFhX0JEa0ZTMl9RelB6SEZsOW8ySUNZIn0seyJ0eXBlIjoidGV4dCIsImVuYWJsZWQiOnRydWUsImtleSI6ImJhc2ljQXV0aCIsInZhbHVlIjoiWVdSdGFXNDZZV1J0YVc0PSJ9LHsidHlwZSI6InRleHQiLCJlbmFibGVkIjp0cnVlLCJrZXkiOiJ1c2VybmFtZSIsInZhbHVlIjoiYWRtaW4ifSx7InR5cGUiOiJ0ZXh0IiwiZW5hYmxlZCI6dHJ1ZSwia2V5IjoicGFzc3dvcmQiLCJ2YWx1ZSI6ImFBMTIzNDU2NzgmIn0seyJ0eXBlIjoidGV4dCIsImVuYWJsZWQiOnRydWUsImtleSI6InR5cGUiLCJ2YWx1ZSI6InRlbXBlcmF0dXJlLW91dGRvb3IifSx7InR5cGUiOiJ0ZXh0IiwiZW5hYmxlZCI6dHJ1ZSwia2V5IjoidGhpbmciLCJ2YWx1ZSI6InJhc3BpLW9yemFuIn1d)
