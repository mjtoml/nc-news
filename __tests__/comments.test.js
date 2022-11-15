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

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("responds with an array of comments for the given article, each with the expected properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).not.toHaveLength(0);
          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });

    test("responds with an array of comments, sorted by date in descending order (most recent first)", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).not.toHaveLength(0);
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    test("responds with 400 and an error message when given an invalid article_id", () => {
      return request(app)
        .get("/api/articles/dog/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid type");
        });
    });

    test("responds with 404 and an error message when given a valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/999999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });

    test("responds with an empty array when the article exists but has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(0);
        });
    });
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
