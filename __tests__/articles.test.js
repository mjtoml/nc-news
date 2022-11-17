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

    test("responds with an array of article objects, defaults to sorted by date in descending order", () => {
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

    test("accepts a topic query which filters by the provided topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).not.toHaveLength(0);
          body.articles.forEach((article) => {
            expect(article.topic).toBe("cats");
          });
        });
    });

    test("responds with 200 and an empty array if the topic exists but no articles are associated with it", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(0);
        });
    });

    test("responds with 404 if the topic provided does not exist in the database, preventing sql injection", () => {
      return request(app)
        .get("/api/articles?topic=; DROP TABLE articles;--")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic not found");
          return request(app).get("/api/articles").expect(200);
        })
        .then(({ body }) => {
          expect(body.articles).not.toHaveLength(0);
        });
    });

    test("accepts a sort_by query which sorts the articles by the provided column defaulting to descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).not.toHaveLength(0);
          expect(body.articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });

    test("sort_by query should work for calculated columns such as comment_count", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).not.toHaveLength(0);
          expect(body.articles).toBeSortedBy("comment_count", {
            descending: true,
          });
        });
    });

    test("responds with 400 if sort_by is an invalid column, preventing sql injection", () => {
      return request(app)
        .get("/api/articles?sort_by=; DROP TABLE articles;--")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort_by query");
          return request(app).get("/api/articles").expect(200);
        })
        .then(({ body }) => {
          expect(body.articles).not.toHaveLength(0);
        });
    });

    test("accepts an order query which sorts the articles in the provided order (asc/desc)", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).not.toHaveLength(0);
          expect(body.articles).toBeSortedBy("created_at", {
            ascending: true,
          });
        });
    });

    test("responds with 400 if order is not ascending or descending, preventing sql injection", () => {
      return request(app)
        .get("/api/articles?order=; DROP TABLE articles;--")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order query");
          return request(app).get("/api/articles").expect(200);
        })
        .then(({ body }) => {
          expect(body.articles).not.toHaveLength(0);
        });
    });

    test("all queries can be used in combination", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).not.toHaveLength(0);
          expect(body.articles).toBeSortedBy("title", {
            ascending: true,
          });
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
  });

  describe("POST", () => {
    test("responds with 201 and the created article containing additional properties which were not passed", () => {
      const newArticle = {
        title: "Test Article",
        author: "butter_bridge",
        topic: "cats",
        body: "Test body...",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: 0,
            comment_count: 0,
            ...newArticle,
          });
        });
    });

    test("responds with 404 if the author does not exist", () => {
      const newArticle = {
        title: "Test Article",
        author: "dog",
        topic: "cats",
        body: "Test body...",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Linking property does not exist");
        });
    });

    test("responds with 404 if the topic does not exist", () => {
      const newArticle = {
        title: "Test Article",
        author: "butter_bridge",
        topic: "dog",
        body: "Test body...",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Linking property does not exist");
        });
    });

    test("responds with 400 if the request body is missing required properties", () => {
      const newArticle = {
        title: "Test Article",
        topic: "cats",
        body: "Test body...",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Required property missing");
        });
    });

    test("ignores any additional properties", () => {
      const newArticle = {
        title: "Test Article",
        author: "butter_bridge",
        topic: "cats",
        body: "Test Body",
        test: "test",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).not.toHaveProperty("test");
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
            .expect(200);
        })
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 3,
            votes: 10,
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
          expect(body.msg).toBe("Required property missing");
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
