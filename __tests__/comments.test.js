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

describe("POST", () => {
  test("responds with 201 and the new comment", () => {
    const comment = {
      username: "lurker",
      body: "Test comment",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          author: comment.username,
          body: comment.body,
        });
      });
  });

  test("responds with 400 when given an invalid article_id", () => {
    const comment = {
      username: "lurker",
      body: "Test comment",
    };
    return request(app)
      .post("/api/articles/dog/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid type");
      });
  });

  test("responds with 404 when given a valid but non-existent article_id", () => {
    const comment = {
      username: "lurker",
      body: "Test comment",
    };
    return request(app)
      .post("/api/articles/999999/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("responds with 404 when given a non-existent username", () => {
    const comment = {
      username: "dog",
      body: "Test comment",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("responds with 400 when given an incomplete comment object", () => {
    const comment = {
      username: "lurker",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incomplete comment");
      });
  });
});
