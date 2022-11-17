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

    test("accepts a limit query which limits the number of responses", () => {});

    test("limit query defaults to 10", () => {});

    test("accepts a p query which specifies the page at which to start", () => {});

    test("p query defaults to 1", () => {});

    test("responds with a total_count property displaying the total number of articles", () => {});

    test("responds with 400 if the limit query is invalid", () => {});

    test("responds with 400 if the p query is invalid", () => {});

    test("responds with 404 if the page specified does not exist", () => {});

    test("next_page should be null if there are no more pages", () => {});
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
            votes: 0,
            created_at: expect.any(String),
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
          expect(body.msg).toBe("Linking property does not exist");
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
          expect(body.msg).toBe("Linking property does not exist");
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
          expect(body.msg).toBe("Required property missing");
        });
    });

    test("ignores any additional properties", () => {
      const comment = {
        username: "lurker",
        body: "Test comment",
        test: "test",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(comment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).not.toHaveProperty("test");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("responds with 204 and an empty body", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });

    test("responds with 400 if comment_id is invalid", () => {
      return request(app)
        .delete("/api/comments/dog")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid type");
        });
    });

    test("responds with 404 if comment_id is valid but doesn't exist", () => {
      return request(app)
        .delete("/api/comments/999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment not found");
        });
    });
  });

  describe("PATCH", () => {
    test("responds with 200 and the updated comment", () => {
      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/1")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 1,
            votes: 17,
          });
        });
    });

    test("responds with 200 and the updated comment when inc_votes is negative", () => {
      const newVote = { inc_votes: -2 };
      return request(app)
        .patch("/api/comments/1")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 1,
            votes: 14,
          });
        });
    });

    test("subsequent PATCH requests increment the votes, not overwrite", () => {
      const newVote = { inc_votes: 3 };
      return request(app)
        .patch("/api/comments/1")
        .send(newVote)
        .expect(200)
        .then(() => {
          return request(app)
            .patch("/api/comments/1")
            .send(newVote)
            .expect(200);
        })
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 1,
            votes: 22,
          });
        });
    });

    test("responds with 400 if comment_id is invalid", () => {
      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/dog")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid type");
        });
    });

    test("responds with 404 if comment_id is valid but doesn't exist", () => {
      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/999999")
        .send(newVote)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment not found");
        });
    });

    test("responds with 400 if the inc_votes is missing", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Required property missing");
        });
    });

    test("responds with 400 if the inc_votes is invalid", () => {
      const newVote = { inc_votes: "dog" };
      return request(app)
        .patch("/api/comments/1")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid type");
        });
    });

    test("ignores additional properties", () => {
      const newVote = { inc_votes: 1, test: "test", author: "newAuthor" };
      return request(app)
        .patch("/api/comments/1")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 1,
            votes: 17,
          });
          expect(body.comment.author).not.toBe("newAuthor");
          expect(body.comment.test).toBeUndefined();
        });
    });
  });
});
