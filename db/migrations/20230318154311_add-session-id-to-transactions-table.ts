import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table
      .uuid("session_id") // tipo + nome da linha
      .after("id") // posicionar dps da linha ID
      .index(); // adicionar um índice de tabela
    // índice é uma forma de falar pro banco de dados que faremos muitas buscas usando o session id, isso deixa a busca mais rápida, pois fará um "cache" com os resultados
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table.dropColumn("session_id");
  });
}
