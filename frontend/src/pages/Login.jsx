import api from "../services/Api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css"
import "./Login.css"

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();

    if (!user || !password) {
      alert("Preencha todos os campos por favor!");
      return;
    }

    try {
      const response = await api.post("/login", {
        user,
        password,
      });

      // pega o token
      const token = response.data.token;

      // salva o token
      localStorage.setItem("token", token);

      // decodifica o token
      const decoded = JSON.parse(atob(token.split(".")[1]));

      // salva token e user
      localStorage.setItem(
        "user",
        JSON.stringify({
          user: decoded.user,
          role: decoded.role,
        }),
      );

      

      navigate("/home");

      // limpa os campos
      setUser("");
      setPassword("");
    } catch (error) {
      console.log("USER DIGITADO:", user);
      console.error(error.response?.data || error.message);
      alert("Erro ao fazer login");
    }
  }

  return (
    <div className="container">
      <div className="login">
        <h2>Bem vindo, faça login para continuar!</h2>

        <form onSubmit={login}>
          <input
            placeholder="Login"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Entrar</button>

          <p className="cadastrar">
            Não tem conta? <a href="/cadastro">Cadastre-se</a>
          </p>
        </form>
      </div>
    </div>
  );
}
