import fastify from "fastify";
import { database } from "./database.js";
import cors from "@fastify/cors";
import bcrypt from "bcrypt";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { initDB } from "./db/connect.js";
import { authRoutes } from "./rotas/authRotas.js";
import { orcamentosRoutes } from "./rotas/orcamentos.js";

//mini freamework do node.js
const server = fastify()

//conecta o banco
const db = await initDB();

//cria tabela orcamentos
await db.exec(`
  CREATE TABLE IF NOT EXISTS orcamentos (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    cliente TEXT,
    tel TEXT,
    user_id TEXT,
    status TEXT DEFAULT 'pendente',
    endereco TEXT,
    criado_em TEXT
  )
`);

//cria tabela usuarios
await db.exec(`
  CREATE TABLE IF NOT EXISTS user(
    id TEXT PRIMARY KEY,
    user TEXT,
    password TEXT,
    role TEXT
  )  
`)

//criar admin automaticamente se nao existir
const adminExiste = await db.get(
  "SELECT * FROM user WHERE user = ?",
  ["castro"]
);

if (!adminExiste) {
  const id = randomUUID();
  const senha = await bcrypt.hash("Felipinho04", 10);

  await db.run(
    "INSERT INTO user (id, user, password, role) VALUES (?, ?, ?, ?)",
    [id, "castro", senha, "admin"]
  );
}

//cors
await server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});


authRoutes(server, db);
orcamentosRoutes(server, db);

//erro global
server.setErrorHandler((error, request, reply) => {
  console.error("ERRO GLOBAL:", error);

  if (error.validation) {
    return reply.status(400).send({ error: "Dados inválidos" });
  }

  return reply.status(500).send({
    error: "Erro interno do servidor",
  });
});

//porta
server.listen({
  port: process.env.PORT || 3000,
});