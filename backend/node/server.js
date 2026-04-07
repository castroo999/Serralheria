import fastify from "fastify";
import jwt from "jsonwebtoken";
import { database, } from "./database.js";
import { connectDB } from "./banco.js";
import { randomUUID } from "node:crypto";
import cors from "@fastify/cors";

//mini freamework do node.js
const server = fastify()


//conecta o banco de dados com o node.js aq no vs code
const db = await connectDB();
await db.exec(`
  CREATE TABLE IF NOT EXISTS orcamentos (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    cliente TEXT,
    tel TEXT 
  )
`);


//cria o banco de dados SQLITE
const banco = new database()

await server.register(cors, {
  origin: "*",
});


//cria os status adm
import jwt from "jsonwebtoken";

const SECRET = "segredo123"; 

server.post("/login", async (request, reply) => {
  const { user, password } = request.body;

  
  if (user !== "admin" || password !== "123") {
    return reply.status(401).send({ error: "Login inválido" });
  }

  const token = jwt.sign({ user }, SECRET, {
    expiresIn: "1h",
  });

  return { token };
});
 

//criar um novo orçamento
server.post('/orcamentos', async (request, reply) => {
  const { title, description, cliente, tel } = request.body;

  const id = randomUUID();

  await db.run(
    "INSERT INTO orcamentos (id, title, description, cliente, tel) VALUES (?, ?, ?, ?, ?)",
    [id, title, description, cliente, tel]
  );

  return reply.status(201).send();
});


//mostrar os orçamentos registrados
server.get('/orcamentos', async () => {
  const orcamentos = await db.all("SELECT * FROM orcamentos");
  return (orcamentos);
});


//editar um orçamento selecionado pelo id dele
server.put('/orcamentos/:id', async (request, reply) => {
  const { id } = request.params;
  const { title, description, cliente, tel } = request.body;

  await db.run(
    "UPDATE orcamentos SET title = ?, description = ?, cliente = ? , tel = ? WHERE id = ?",
    [title, description, cliente, tel, id]
  );

  return reply.status(204).send();
});


//deletar um orçamento pelo id dele
server.delete('/orcamentos/:id', async (request, reply) => {
  const { id } = request.params;

  await db.run(
    "DELETE FROM orcamentos WHERE id = ?",
    [id]
  );

  return reply.status(204).send();
});


//porta do servidor
server.listen({
  port: 3000,
})