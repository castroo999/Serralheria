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

  // const [modalAberto, setModalAberto] = useState(false);
  // const [editandoId, setEditandoId] = useState(null);
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [cliente, setCliente] = useState("");
  // const [tel, setTel] = useState("");

  // //função do modal
  // function abrirModal(item) {
  //   setEditandoId(item.id);
  //   setTitle(item.title);
  //   setDescription(item.description);
  //   setCliente(item.cliente);
  //   setTel(item.tel);

  //   setModalAberto(true);
  // }

  // function fecharModal() {
  //   setModalAberto(false);
  //   setEditandoId(null);
  // }

  // async function editar() {
  //   try {
  //     await api.put(`/orcamentos/${editandoId}`, {
  //       title,
  //       description,
  //       cliente,
  //       tel,
  //     });

  //     // atualiza lista
  //     setOrcamentos(
  //       orcamentos.map((item) => item.id === editandoId ? { ...item, title, description, cliente, tel } : item));
  //     fecharModal();
  //   }
  //   catch (error) {
  //     console.log(error);
  //     alert("Erro ao editar!");
  //   }
  // }

  return (
    <div className="container2">
      <div className="listados">
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
