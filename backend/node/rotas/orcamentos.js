import { randomUUID } from "node:crypto";
import { verificarToken } from "../middleware/auth.js";

export async function orcamentosRoutes(server, db) {

  //criar orçamento
  server.post('/orcamentos', { preHandler: verificarToken }, async (request, reply) => {
    try {
      const { title, description, cliente, tel, endereco } = request.body;

      if (!title || !description || !cliente || !tel || !endereco) {
        return reply.status(400).send({ error: "Preencha todos os campos!" });
      }

      const criado_em = new Date().toISOString();

      const id = randomUUID();
      const user_id = request.user.id;
      const status = "pendente";

      await db.run(
        "INSERT INTO orcamentos (id, title, description, cliente, tel, user_id, status, endereco, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [id, title, description, cliente, tel, user_id, status, endereco, criado_em]
      );

      return reply.status(201).send();

    } catch (error) {
      console.log(error);
      return reply.status(500).send({ error: "Erro ao criar orçamento" });
    }
  });

  //listar
  server.get('/orcamentos', { preHandler: verificarToken }, async (request, reply) => {

    if (request.user.role === "admin") {
      return await db.all("SELECT * FROM orcamentos");
    }

    return await db.all(
      "SELECT * FROM orcamentos WHERE user_id = ?",
      [request.user.id]
    );
  });

  //editar
  server.put('/orcamentos/:id', { preHandler: verificarToken }, async (request, reply) => {

    if (request.user.role !== "admin") {
      return reply.status(403).send({ error: "Apenas admin pode editar" });
    }

    const { id } = request.params;
    const { title, description, cliente, tel, status, endereco } = request.body;

    if (!title || !description || !cliente || !tel || !status || !endereco) {
      return reply.status(400).send({ error: "Preencha todos os campos!" });
    }

    await db.run(
      "UPDATE orcamentos SET title = ?, description = ?, cliente = ?, tel = ?, status = ?, endereco = ? WHERE id = ?",
      [title, description, cliente, tel, status, endereco, id]
    );

    return reply.status(204).send();
  });

  //deletar
  server.delete('/orcamentos/:id', { preHandler: verificarToken }, async (request, reply) => {

    if (request.user.role !== "admin") {
      return reply.status(403).send({ error: "Apenas admin pode deletar" });
    }

    const { id } = request.params;

    await db.run(
      "DELETE FROM orcamentos WHERE id = ?",
      [id]
    );

    return reply.status(204).send();
  });
}