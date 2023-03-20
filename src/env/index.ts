import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({
    path: ".env.test",
  });
} else {
  config();
}

// formato de dados que vamos receber das variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("⚠️ Invalid environment variables: ", _env.error.format());
  throw new Error("Invalid environment variables.");
}

const env = _env.data;
export default env;
// se não houver a database_url no process.env ele taca erro, se não for uma string, também. O ZOD já retorna erros sozinho
// outras ferramentas como essa são o Joi e Yup, mas o ZOD é o que melhor tem uma integração com Typescript
