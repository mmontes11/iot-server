# iot-backend

[![Build Status](https://travis-ci.org/mmontes11/iot-backend.svg?branch=develop)](https://travis-ci.org/mmontes11/iot-backend)
[![Coverage Status](https://coveralls.io/repos/github/mmontes11/iot-backend/badge.svg?branch=develop)](https://coveralls.io/github/mmontes11/iot-backend?branch=develop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/mmontes11/iot)

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
$ npm run build 
$ docker build -t iot-backend .
```

### DockerHub

Server image available on [Docker Hub](https://hub.docker.com/r/mmontes11/iot-backend/)

### Deploy using Docker Compose

Configure env variables:
* [.env](https://github.com/mmontes11/iot-backend/blob/develop/.env)
* [.env.biot](https://github.com/mmontes11/iot-backend/blob/develop/.env.biot)
* [.env.iot-backend](https://github.com/mmontes11/iot-backend/blob/develop/.env.iot-backend)


```bash
$ docker-compose up -d 
```

### Test REST API with Postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/51c5ec6b69c744e25a5a#?env%5Biot-dev%5D=W3siZW5hYmxlZCI6dHJ1ZSwia2V5Ijoic2VydmVyIiwidmFsdWUiOiJsb2NhbGhvc3Q6OTAwMCIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJ0b2tlbiIsInZhbHVlIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5Ym1GdFpTSTZJbTF0YjI1MFpYTWlMQ0pwWVhRaU9qRTFNRFkzTnpFeE9EQjkuSkVsN1owN0JRbHZuWk8wRWdrTkZRYV9CRGtGUzJfUXpQekhGbDlvMklDWSIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJiYXNpY0F1dGgiLCJ2YWx1ZSI6IllXUnRhVzQ2WVdSdGFXND0iLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoidXNlcm5hbWUiLCJ2YWx1ZSI6ImFkbWluIiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6InBhc3N3b3JkIiwidmFsdWUiOiJhQTEyMzQ1Njc4JiIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJ0eXBlIiwidmFsdWUiOiJ0ZW1wZXJhdHVyZS1vdXRkb29yIiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6InRoaW5nIiwidmFsdWUiOiJyYXNwaS1vcnphbiIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJjaGF0SWQiLCJ2YWx1ZSI6IjU2NTU5OCIsInR5cGUiOiJ0ZXh0In1d)
