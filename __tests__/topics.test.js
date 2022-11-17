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

describe("/api/topics", () => {
  describe("GET", () => {
    test("responds with 200 and an array of topic objects each with a slug and description property", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).not.toHaveLength(0);
          body.topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });

  describe("POST", () => {
    test("responds with 201 and the new topic", () => {
      const newTopic = {
        slug: "test",
        description: "Test description",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).toMatchObject(newTopic);
        });
    });

    test("responds with 400 when slug is not given", () => {
      const newTopic = {
        description: "test",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Required property missing");
        });
    });

    test("responds with 201 when description is not given, defaulting to a null description", () => {
      const newTopic = {
        slug: "test",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).toMatchObject({
            slug: "test",
            description: null,
          });
        });
    });

    test("ignores additional properties", () => {
      const newTopic = {
        slug: "test",
        description: "Test description",
        test: "test",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).not.toHaveProperty("test");
        });
    });
  });
});
