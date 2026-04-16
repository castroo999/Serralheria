import "./VerServico.css";
import { useEffect, useState } from "react";
import api from "../services/Api";

export default function VerServico() {
  const [orcamentos, setOrcamentos] = useState([]);

  useEffect(() => {
    async function carregarOrcamentos() {
      try {
        //espera resposta da api para pegar o get
        const response = await api.get("/orcamentos");

        //armazena os orçamentos
        setOrcamentos(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    carregarOrcamentos();
  }, []);

  async function deletar(id) {
    try {
      await api.delete(`/orcamentos/${id}`);

      //remove o orçamento
      setOrcamentos(orcamentos.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
      alert("erro ao deletar somente administradores podem");
    }
  }


  return (
    <div className="container2">
      <div className="listados">
        <h2>Orçamentos</h2>
        <ul>
          {/* mapeia os orçamentos */}
          {orcamentos.map((item) => (
            <li key={item.id}>
              <h3>TITULO: {item.title}</h3>
              <p>DESCRIÇÃO: {item.description}</p>
              <p> CLIENTE: {item.cliente}</p>
              <p> TEL: {item.tel}</p>
              <div className="botoes">

                {/* chama a função de abrir o modal */}
                <button onClick={() => (item)}>Editar</button>
                {/* chama a função de deletar o orçamento */}
                <button onClick={() => deletar(item.id)}>Deletar</button>
              </div>
            </li>
          ))}
        </ul>


      </div>
    </div>
  );
}
