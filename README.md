# iot-server

[![Build Status](https://travis-ci.org/mmontes11/iot-server.svg?branch=develop)](https://travis-ci.org/mmontes11/iot-server)
[![Coverage Status](https://coveralls.io/repos/github/mmontes11/iot-server/badge.svg?branch=develop)](https://coveralls.io/github/mmontes11/iot-server?branch=develop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Generic purpose ES6 NodeJS + MongoDB + Redis IoT server. It provides REST and MQTT interfaces to interact with IoT data.

### Development

```bash
$ npm start
```

### Lint

```bash
$ npm run lint
```

### Test and Coverage

```bash
$ npm test
```

### Build Image

```bash
$ npm run build 
$ docker build -t iot-server .
```

### DockerHub

Image available on [Docker Hub](https://hub.docker.com/r/mmontes11/iot-server/)

### Production

See [docker-compose](https://docs.docker.com/compose/) set up on [iot](https://github.com/mmontes11/iot)

### Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/51c5ec6b69c744e25a5a#?env%5Biot-dev%5D=W3siZW5hYmxlZCI6dHJ1ZSwia2V5Ijoic2VydmVyIiwidmFsdWUiOiJsb2NhbGhvc3Q6OTAwMCIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJ0b2tlbiIsInZhbHVlIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5Ym1GdFpTSTZJbTF0YjI1MFpYTWlMQ0pwWVhRaU9qRTFNRFkzTnpFeE9EQjkuSkVsN1owN0JRbHZuWk8wRWdrTkZRYV9CRGtGUzJfUXpQekhGbDlvMklDWSIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJiYXNpY0F1dGgiLCJ2YWx1ZSI6IllXUnRhVzQ2WVdSdGFXND0iLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoidXNlcm5hbWUiLCJ2YWx1ZSI6ImJpb3QiLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoicGFzc3dvcmQiLCJ2YWx1ZSI6ImFBMTIzNDU2NzgmIiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6InR5cGUiLCJ2YWx1ZSI6InRlbXBlcmF0dXJlLW91dGRvb3IiLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoidGhpbmciLCJ2YWx1ZSI6InJhc3BpLW9yemFuIiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6ImNoYXRJZCIsInZhbHVlIjoiNTY1NTk4IiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6InRvcGljSWQiLCJ2YWx1ZSI6IjVhYmUyMGEzNzczZmZhNmFhMWEyY2VhZCIsInR5cGUiOiJ0ZXh0In1d)
