import fastify from "fastify";
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
  const { title, description, cliente, tel} = request.body;

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