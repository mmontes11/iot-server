# iot_backend

[![Build Status](https://travis-ci.org/mmontes11/iot_backend.svg?branch=develop)](https://travis-ci.org/mmontes11/iot_backend)
[![Coverage Status](https://coveralls.io/repos/github/mmontes11/iot_backend/badge.svg?branch=develop)](https://coveralls.io/github/mmontes11/iot_backend?branch=develop)
[![MIT License](https://img.shields.io/npm/l/stack-overflow-copy-paste.svg?style=flat-square)](http://opensource.org/licenses/MIT)

Generic purpose ES6 NodeJS + MongoDB + Redis IoT backend 

### Run in development

```bash
$ npm install 
$ npm start
```
### Run tests and show coverage

```bash
$ npm test
```

### Build server image

```bash
$ npm run dist 
$ docker build -t iot_backend .
```

### DockerHub

Server image available on [Docker Hub](https://hub.docker.com/r/mmontes11/iot_backend/)

### Deploy using Docker Compose

You may change your environment variables located in `.env` and then execute:
```bash
$ docker-compose up -d 
```

### Test requests with Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/95f05db9eadcd090b16a#?env%5BIoT_DEV%5D=W3siZW5hYmxlZCI6dHJ1ZSwia2V5Ijoic2VydmVyIiwidmFsdWUiOiJsb2NhbGhvc3Q6ODAwMCIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJ0b2tlbiIsInZhbHVlIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5Ym1GdFpTSTZJbTF0YjI1MFpYTWlMQ0pwWVhRaU9qRTFNRFkzTnpFeE9EQjkuSkVsN1owN0JRbHZuWk8wRWdrTkZRYV9CRGtGUzJfUXpQekhGbDlvMklDWSIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJnb29nbGVNYXBzS2V5IiwidmFsdWUiOiJBSXphU3lDdGxzdkxrRVBUd01tU1BYbTFFc0JYY2RKOTRrWk5KQzQiLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoiYmFzaWNBdXRoIiwidmFsdWUiOiJZV1J0YVc0NllXUnRhVzQ9IiwidHlwZSI6InRleHQifV0=)
