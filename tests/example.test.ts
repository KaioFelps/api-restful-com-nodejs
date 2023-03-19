import { afterAll, beforeAll, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

it("should let a user create a new transaction", async () => {
  await request(app.server)
    .post("/transactions")
    .send({
      title: "new transaction",
      amount: 5000,
      type: "credit",
    })
    .expect(202);
});
