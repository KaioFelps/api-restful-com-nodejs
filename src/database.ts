import { knex as initialKnex } from "knex";

export const knex = initialKnex({
  client: "sqlite3",
  connection: {
    filename: "./tmp/app.db",
  },
});
