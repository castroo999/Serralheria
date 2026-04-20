import "./Cadastro.css";
import api from "../services/Api.js";
import { useState } from "react";

export default function Cadastro() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cliente, setCliente] = useState("");
  const [tel, setTel] = useState("");


  async function enviar(e) {
    e.preventDefault();

    //se o usuario nao colocar todos os dados nao envia
    if (!title || !description || !cliente || !tel){
        alert("Preencha todos os campor por favor!")
        return;
    }

    try {

      //espera conexção com o backend
      await api.post("/orcamentos", {
        title,
        description,
        cliente,
        tel,
      });

      alert("Seu orçamento foi registrado com sucesso!");

      // limpa todos os campos dps de enviar
      setTitle("");
      setDescription("");
      setCliente("");
      setTel("");

    }
    catch (error) {
      console.error(error);
      alert("Erro ao enviar orçamento");
    }
  }

  return (
    <div className="container">
      <form onSubmit={enviar}>
        <h1>Solicite seu Orçamento</h1>

        <input
          placeholder="Título:"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Descrição:"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Cliente:"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />

        <input
          placeholder="Telefone:"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
        />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}