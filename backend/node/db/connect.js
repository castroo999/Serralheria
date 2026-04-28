import { connectDB } from "../banco.js";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";

//conecta o banco de dados com o node.js aq no vs code
export async function initDB() {
  const db = await connectDB();

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

  //cria a tabela usuarios
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

  return db;
}