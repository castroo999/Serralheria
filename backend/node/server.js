import fastify from "fastify";
import { database, } from "./database.js";
import { connectDB } from "./banco.js";
import { randomUUID } from "node:crypto";
import cors from "@fastify/cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

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

//cria a tabela usuarios
await db.exec(`
  CREATE TABLE IF NOT EXISTS user(
  id TEXT PRIMARY KEY,
  user TEXT,
  password TEXT,
  role TEXT
  )  
`)


//cria o banco de dados SQLITE
const banco = new database()

await server.register(cors, {
  origin: "*",
});


// middleware
async function verificarToken(request, reply) {
  try {
    const authHeader = request.headers.authorization;

    //verifica se tem token
    if (!authHeader) {
      return reply.status(401).send({ error: "Token não enviado" });
    }

    //mostra só o token na array
    const token = authHeader.split(" ")[1];

    //verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //salva os dados do usuário
    request.user = decoded;

  } catch (error) {
    return reply.status(401).send({ error: "Token inválido" });
  }
}


//criar um novo orçamento
server.post('/orcamentos', async (request, reply) => {
  const { title, description, cliente, tel } = request.body;

  //cria um id aleatorio unico
  const id = randomUUID();

  await db.run(
    "INSERT INTO orcamentos (id, title, description, cliente, tel) VALUES (?, ?, ?, ?, ?)",
    [id, title, description, cliente, tel]
  );

  return reply.status(201).send();
});


//registar um usuario
server.post('/registrar', async (request, reply)=>{
  try{
    const {user , password} = request.body

    //verifica se a senha ta certa
    if(!user || !password){
      return reply.status(400).send ({error:"preencha todos os campos!"});
    }

    //verifica usuario
    const existe = await db.get(
      "SELECT * FROM user WHERE user = ?",
      [user]
    );

    //evita usuario duplicado
    if (existe){
      return reply.status(400).send ({error:"Usuario digitado ja existe"})
    }

    //define role 
    const role = user === "admin" ? "admin" : "user";

    //criptografa a senha
    const hash = await bcrypt.hash(password, 10)
    const id = randomUUID();

    //add o usuario no banco de dados
    await db.run(
      "INSERT INTO user (id, user, password, role) VALUES (?, ?, ?, ?)",
      [id, user, hash, role]
    );

    //se tudo der certo retorna isso
    return reply.status(201).send({message: "Usuario cadastrado com susseso!"})

  }

  //se alguma coisa dar errado retorna isso
  catch(error){
    console.log(error)
    return reply.status(500).send({error:"Erro no servidor :( "})
  }
});


//cria a rota login de usuario
server.post('/login', async (request, reply)=>{
  try{
    const {user, password} = request.body

    //se o usuario nao colocar senha ou o nome dele da erro
    if (!user || !password){
      return reply.status(400).send({error:"Preencha todos os campos!"})
    };

    //seleciona o usuario novo
    const usuario = await db.get(
      "SELECT * FROM user WHERE user = ?",
      [user]
    );

    //se nao achar da esse erro
    if(!usuario){
      return reply.status(404).send({error:"Usuario não encontrado"})
    };

    //criptografa a senha do usaurio
    const senhaCorreta = await bcrypt.compare(password, usuario.password);

    //se a senha estiver errada da esse erro
    if(!senhaCorreta){
      return reply.status(401).send({error:"Senha Incorreta"})
    };

    //cria o token
    const token = jwt.sign(
      {
        id: usuario.id,
        user: usuario.user,
        role: usuario.role
      },
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );

    return reply.send({token});
  }

  //se alguma coisa der errado da isso
  catch(error){
    console.log(error)
    return reply.status(500).send({error:"Erro no servidor :( "})
  }
})


//mostrar os orçamentos registrados
server.get('/orcamentos', { preHandler: verificarToken }, async () => {
  const orcamentos = await db.all("SELECT * FROM orcamentos");
  return (orcamentos);
});


//editar um orçamento selecionado pelo id dele só adm
server.put('/orcamentos/:id', { preHandler: verificarToken }, async (request, reply) => {

  if (request.user.role !== "admin") {
    return reply.status(403).send({ error: "Apenas admin pode editar" });
  }

  const { id } = request.params;
  const { title, description, cliente, tel} = request.body;

  await db.run(
    "UPDATE orcamentos SET title = ?, description = ?, cliente = ? , tel = ? WHERE id = ?",
    [title, description, cliente, tel, id]
  );

  return reply.status(204).send();
});


//deletar um orçamento pelo id dele só adm pode
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


//porta do servidor
server.listen({
    port: process.env.PORT || 3000,
})