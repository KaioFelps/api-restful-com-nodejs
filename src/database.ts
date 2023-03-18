import { knex as initialKnex, Knex } from "knex";
import env from "./env";

export const knexConfig: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
  },
};

export const knex = initialKnex(knexConfig);
