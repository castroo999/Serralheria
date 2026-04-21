import "./Cadastro.css";
import api from "../services/Api.js";
import { useState } from "react";

export default function Cadastro() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cliente, setCliente] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tel, setTel] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  function fecharModal() {
    setModalAberto(false);
  }

  async function enviar(e) {
    e.preventDefault();

    //se o usuario nao colocar todos os dados nao envia
    if (!title || !description || !cliente || !tel || !endereco) {
      alert("Preencha todos os campos por favor!");
      return;
    }

    try {
      //espera conexção com o backend
      await api.post("/orcamentos", {
        title,
        description,
        cliente,
        tel,
        endereco,
      });

      //abre o modal
      setModalAberto(true);

      setTimeout(() => {
        setModalAberto(false);
      }, 5000);

      // limpa todos os campos dps de enviar
      setTitle("");
      setDescription("");
      setCliente("");
      setEndereco("");
      setTel("");


    } catch (error) {
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
          placeholder="Endereço:"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />

        <input
          placeholder="Telefone:"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
        />

        <button type="submit">Enviar</button>
      </form>

      {modalAberto && (
        <div className="overlay3" onClick={fecharModal}>
          <div className="modal2" onClick={(e) => e.stopPropagation()}>
            <div className="alert">
              <h3>
                Sua solicitação de orçamento foi enviada iremos analizar e
                entrar em contato!
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
