# Northcoders News API

[![Website](https://img.shields.io/website?style=for-the-badge&up_message=online&url=https%3A%2F%2Fnc-news-production-d3b7.up.railway.app%2Fapi)](https://nc-news-production-d3b7.up.railway.app/api) ![Node](https://img.shields.io/badge/nodejs-%3E%3D%2016.0.0-reen?style=for-the-badge&logo=nodedotjs) ![Postgres](https://img.shields.io/badge/postgres-%3E%3D%2015.1-9cf?style=for-the-badge&logo=postgresql)

## Summary

A simple news API which interacts with a Postgres database to serve information about news articles. The full list of endpoints can be found by making a GET request to the /api endpoint.

## Setup

### **1. Clone**

First clone this repository either to your local machine or remote host:

```console
$ git clone https://github.com/mjtoml/nc-news.git
```

### **2. Install Dependencies**

This API requires nodejs and a postgres database (installed locally with PSQL if developing/testing locally). Once node has been installed, use NPM to install the project's dependencies:

```console
$ npm install
```

### **3. Setup environment**

To setup the environment for developing and testing, add the following files:

```
.env.test
.env.development
```

For each of these env files add at least `PGDATABASE` to be `nc_news`, appending `_test` for the test env file:
`PGDATABASE=nc_news[_test]`.

For production, either add the file `.env.production` and set `DATABASE_URL` to be the production database connection URL (whether self-hosted or managed), or set this environment variable directly.

### **4. Setup database**

To run the database setup for development and testing:

```console
$ npm run setup-dbs
```

Testing requires no further database setup, but if you are developing run:

```console
$ npm run seed
```

And iff you are setting up the production database run:

```console
$ npm run seed-prod
```

### **5. Test/Run/Host**

To run tests:

```console
$ npm test
```

To run the local development server:

```console
$ npm run dev
```

To host the API, first ensure the `DATABASE_URL` environment variable is set. The main JS file and NPM start scripts are already setup, which some hosting platforms will use as the entrypoint by default. However, you may need to specify the initial command as `npm run start`.
