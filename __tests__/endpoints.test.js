const request = require("supertest");
const app = require("../app");

describe("/api", () => {
  describe("GET", () => {
    test("responds with 200 and a JSON object describing all of the available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const endpoints = Object.keys(body.endpoints);
          expect(endpoints).not.toHaveLength(0);
          endpoints.forEach((endpoint) => {
            expect(body.endpoints[endpoint]).toMatchObject({
              description: expect.any(String),
            });
          });
        });
    });
  });
});
