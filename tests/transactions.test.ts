import { afterAll, beforeAll, it, describe, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("Transactions routes", async () => {
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

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body).toEqual({
      data: [
        expect.objectContaining({
          title: "new transaction",
          amount: 5000,
        }),
      ],
    });
  });
}); // descreve o que está sendo testado, cria um contexto; um grupo; uma categoria.
