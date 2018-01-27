# iot-backend

[![Build Status](https://travis-ci.org/mmontes11/iot-backend.svg?branch=develop)](https://travis-ci.org/mmontes11/iot-backend)
[![Coverage Status](https://coveralls.io/repos/github/mmontes11/iot-backend/badge.svg?branch=develop)](https://coveralls.io/github/mmontes11/iot-backend?branch=develop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Generic purpose ES6 NodeJS + MongoDB + Redis IoT backend 

### Run in development

```bash
$ npm install 
$ npm start
```
### Run tests and show coverage

```bash
$ npm install
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

You may change your environment variables located in `.env` and then execute:
```bash
$ docker-compose up -d 
```

### Test requests with Postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/95f05db9eadcd090b16a#?env%5Biot-dev%5D=W3siZW5hYmxlZCI6dHJ1ZSwia2V5Ijoic2VydmVyIiwidmFsdWUiOiJsb2NhbGhvc3Q6OTAwMCIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJ0b2tlbiIsInZhbHVlIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5Ym1GdFpTSTZJbTF0YjI1MFpYTWlMQ0pwWVhRaU9qRTFNRFkzTnpFeE9EQjkuSkVsN1owN0JRbHZuWk8wRWdrTkZRYV9CRGtGUzJfUXpQekhGbDlvMklDWSIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJiYXNpY0F1dGgiLCJ2YWx1ZSI6IllXUnRhVzQ2WVdSdGFXND0iLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoidXNlcm5hbWUiLCJ2YWx1ZSI6ImFkbWluIiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6InBhc3N3b3JkIiwidmFsdWUiOiJhQTEyMzQ1Njc4JiIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJ0eXBlIiwidmFsdWUiOiJ0ZW1wZXJhdHVyZS1vdXRkb29yIiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6InRoaW5nIiwidmFsdWUiOiJyYXNwaS1vcnphbiIsInR5cGUiOiJ0ZXh0In1d)
