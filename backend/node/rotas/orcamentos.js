import { randomUUID } from "node:crypto";
import { verificarToken } from "../middleware/auth.js";

export async function orcamentosRoutes(server, db) {

  //criar orçamento
  server.post('/orcamentos', { preHandler: verificarToken }, async (request, reply) => {
    try {
      const { title, description, cliente, tel, endereco } = request.body;

      if (!title || !description) {
        return reply.status(400).send({ error: "Título e descrição são obrigatórios!" });
      }

      const criado_em = new Date().toISOString();

      const id = randomUUID();
      const user_id = request.user.id;
      const status = "pendente";

      await db.run(
        "INSERT INTO orcamentos (id, title, description, cliente, tel, user_id, status, endereco, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [id, title, description, cliente || "", tel || "", user_id, status, endereco || "", criado_em]
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

    if (!title || !description) {
      return reply.status(400).send({ error: "Título e descrição são obrigatórios!" });
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

  //cria modelos de orçamentos
  server.post('/modelos', { preHandler: verificarToken }, async (request, reply) => {

    if (request.user.role !== "admin") {
      return reply.status(403).send({ error: "Apenas admin tem acesso aos modelos" })
    }

    try {
      const { title, itens } = request.body;
      const id = randomUUID();
      const itensJSON = JSON.stringify(itens || []);

      await db.run(
        "INSERT INTO modelos (id, title, itens) VALUES (?, ?, ?)",
        [id, title, itensJSON]
      );

      return reply.status(201).send({ id, message: "Modelo criado" });

    } catch (err) {
      console.log("ERRO BACK:", err);
      return reply.status(500).send({ error: "Erro interno no servidor" });
    }
  });


  //listar modelos
  server.get('/modelos', { preHandler: verificarToken }, async (request, reply) => {
    if (request.user.role != "admin") {
      return reply.status(403).send({ error: "Apenas admin tem acesso aos modelos" })
    }

    const modelos = await db.all("SELECT * FROM modelos");

    // converte itens de string para array
    const modelosFormatados = modelos.map(m => ({
      ...m,
      itens: JSON.parse(m.itens || "[]")
    }));

    return modelosFormatados;
  })

  //editar modelo
  server.put('/modelos/:id', { preHandler: verificarToken }, async (req, reply) => {

    console.log("USER:", req.user);

    if (req.user.role != "admin") {
      return reply.status(403).send({ error: "Apenas admin tem acesso aos modelos" })
    }

    //pega dados
    const { id } = req.params
    const { title, itens } = req.body

    //transofrma em json e joga pra um array
    const itensJSON = JSON.stringify(itens || [])

    await db.run(
      "UPDATE modelos SET title = ?, itens = ? WHERE id = ?",
      [title, itensJSON, id]
    )

    return reply.send({ message: "Modelo atualizado com sucesso" })
  })

  //deletar modelo de orçamento
  server.delete('/modelos/:id', { preHandler: verificarToken }, async (req, reply) => {

    if (req.user.role != "admin") {
      return reply.status(403).send({ error: "Apenas admin tem acesso aos modelos" })
    }

    const { id } = req.params

    await db.run("DELETE FROM modelos WHERE id = ?", [id])

    return reply.send({ message: "Modelo deletado com sucesso" });

  })
}