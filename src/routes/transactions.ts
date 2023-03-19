import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import validateSessionId from "../middlewares/validate-session-id";

export async function transactionsRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { amount, title, type } = createTransactionBodySchema.parse(req.body);

    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      res.cookie("sessionId", sessionId, {
        path: "/", // em quais endereços; rotas do back-end essa informação vai estar disponível. / significa qualquer rotas (e não só /transactions)
        maxAge:
          1000 /* um segundo */ *
          60 /* um minuto */ *
          60 /* uma hora */ *
          24 /* um dia */ *
          31 /* um mês */,
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      amount: type === "credit" ? amount : amount * -1,
      title,
      session_id: sessionId,
    });

    return res.status(202).send();
  });

  app.get(
    "/",
    {
      preHandler: [validateSessionId],
    },
    async (req, res) => {
      const { sessionId } = req.cookies;

      const transactions = await knex("transactions").where({
        session_id: sessionId,
      });

      return res.status(200).send({
        data: transactions || [],
      });
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [validateSessionId],
    },
    async (req, res) => {
      const { sessionId } = req.cookies;

      const getTransactionsParmsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionsParmsSchema.parse(req.params);

      const transaction = await knex("transactions")
        .where({
          session_id: sessionId,
          id,
        })
        .first();

      return res.status(200).send({
        data: transaction || [],
      });
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [validateSessionId],
    },
    async (req, res) => {
      const { sessionId } = req.cookies;

      const summary = await knex("transactions")
        .where({
          session_id: sessionId,
        })
        .sum("amount", {
          as: "amount",
        })
        .first(); // first faz não retornar um array

      return res.status(200).send({
        data: summary!.amount,
      });
    }
  );
}
