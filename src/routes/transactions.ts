import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { amount, title, type } = createTransactionBodySchema.parse(req.body);

    await knex("transactions").insert({
      id: randomUUID(),
      amount: type === "credit" ? amount : amount * -1,
      title,
    });

    return res.status(202).send();
  });

  app.get("/", async (_, res) => {
    const transactions = await knex("transactions").select("*");
    return res.status(200).send({
      data: transactions,
    });
  });

  app.get("/:id", async (req, res) => {
    const getTransactionsParmsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionsParmsSchema.parse(req.params);

    const transaction = await knex("transactions")
      .where({
        id,
      })
      .first();

    return res.status(200).send({
      data: transaction,
    });
  });

  app.get("/summary", async (_, res) => {
    const summary = await knex("transactions")
      .sum("amount", {
        as: "amount",
      })
      .first(); // first faz não retornar um array

    return res.status(200).send({
      data: summary!.amount,
    });
  });
}
