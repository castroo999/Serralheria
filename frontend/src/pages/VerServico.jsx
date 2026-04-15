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

  return (
    <div className="container">
      <div className="listados">
        <ul>

          {/* mapeia os orçamentos */}
          {orcamentos.map((item) => (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>{item.cliente}</p>
              <p>{item.tel}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}