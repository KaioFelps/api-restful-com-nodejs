import "dotenv/config";
import { knex as initialKnex, Knex } from "knex";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable not found.");
}

export const knexConfig: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
  },
};

export const knex = initialKnex(knexConfig);
