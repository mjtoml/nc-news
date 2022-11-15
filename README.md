# Northcoders News API

## Environment setup

To setup the environment add the following files:

```
.env.development
.env.test
```

For each of these env files add at least `PGDATABASE` (appending `_test` for the test env file):
`PGDATABASE=nc_news[_test]`

Then run the database setup:

```
$ npm run setup-dbs
```

If you are developing run:

```
$ npm run seed
$ npm run dev
```
