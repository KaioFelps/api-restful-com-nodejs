import { afterAll, beforeAll, it, describe, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "child_process";

describe("Transactions routes", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // executa comandos de terminal
    execSync("npm run knex migrate:rollback --all"); // reseta o banco
    execSync("npm run knex migrate:latest"); // cria as migrations para o banco de dados de teste
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

  it("should be able to list a specific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const getTransictionsListResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies);

    const transactionId = getTransictionsListResponse.body.data[0].id;

    const getSingleTransactionResponse = await request(app.server)
      .get("/transactions/", transactionId)
      .set("Cookie", cookies)
      .expect(200);

    expect(getSingleTransactionResponse.body).toEqual({
      data: [
        expect.objectContaining({
          title: "new transaction",
          amount: 5000,
        }),
      ],
    });
  });

  it("should be able to get the summary", async () => {
    const createFirstTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createFirstTransactionResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "second transaction",
        amount: 2000,
        type: "debit",
      });

    const getSummaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(getSummaryResponse.body.data).toEqual(3000);
  });
}); // descreve o que está sendo testado, cria um contexto; um grupo; uma categoria.
