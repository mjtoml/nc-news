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
