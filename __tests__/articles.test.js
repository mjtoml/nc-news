const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("responds with an array of article objects, each with the expected properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).not.toHaveLength(0);
          body.articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });

    test("responds with an array of article objects, sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).not.toHaveLength(0);
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("responds with an article object which matches the given id and contains the expected properties", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 3,
            title: expect.any(String),
            author: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            body: expect.any(String),
          });
        });
    });

    test("responds with a 400 status code when given an invalid article_id", () => {
      return request(app)
        .get("/api/articles/dog")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid type");
        });
    });

    test("responds with a 404 status code when given a valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
  });
});
