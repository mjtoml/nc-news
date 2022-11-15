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
            comment_count: expect.any(Number),
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

  describe("PATCH", () => {
    test("responds with 200 and the updated article", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 3,
            votes: 2,
          });
        });
    });

    test("responds with 200 and the updated article when given a negative number", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: -3 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 3,
            votes: -3,
          });
        });
    });

    test("consecutive votes increment/decrement the number not overwrite", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(() => {
          return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: 8 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article).toMatchObject({
                article_id: 3,
                votes: 10,
              });
            });
        });
    });

    test("responds with 400 when given an invalid article_id", () => {
      return request(app)
        .patch("/api/articles/dog")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid type");
        });
    });

    test("responds with 404 when given a valid but non-existent article_id", () => {
      return request(app)
        .patch("/api/articles/999999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });

    test("responds with 400 when given an invalid inc_votes", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: "dog" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid type");
        });
    });

    test("responds with 400 when inc_votes not given", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("inc_votes required");
        });
    });

    test("ignores additional properties", () => {
      const update = { inc_votes: 1, title: "dog", new: "test" };
      return request(app)
        .patch("/api/articles/3")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 3,
            votes: 1,
          });
          expect(body.article.title).not.toBe(update.title);
          expect(body.article.new).toBeUndefined();
        });
    });
  });
});
