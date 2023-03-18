import { randomUUID } from "crypto";
import fastify from "fastify";
import { knex } from "./database";
import env from "./env";

const app = fastify();

app.get("/hello", async () => {
  const transactions = await knex("transactions")
    .insert({
      id: randomUUID(),
      title: "transação de teste",
      amount: 1000,
    })
    .returning("*");

  return transactions;
});

app.get("/transactions", async () => {
  const res = await knex("transactions").select("*");
  return res;
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server is running!");
  });
