import "./VerServico.css";
import { useEffect, useState } from "react";
import api from "../services/Api";

export default function VerServico() {
  const [orcamentos, setOrcamentos] = useState([]);

  useEffect(() => {
    async function carregarOrcamentos() {
      try {
        const response = await api.get("/orcamentos");
        setOrcamentos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
      }
    }

    carregarOrcamentos();
  }, []);

  // DELETE
  async function deletar(id) {
    try {
      await api.delete(`/orcamentos/${id}`);

      setOrcamentos((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
      alert("Erro ao deletar (somente admin)");
    }
  }

  const usuarioLogado = JSON.parse(localStorage.getItem("user"));
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cliente, setCliente] = useState("");
  const [tel, setTel] = useState("");
  const [status, setStatus] = useState("");

  //  ABRIR MODAL
  function abrirModal(item) {
    setEditandoId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setCliente(item.cliente);
    setTel(item.tel);
    setStatus(item.status);
    setModalAberto(true);
  }

  //  FECHAR MODAL
  function fecharModal() {
    setModalAberto(false);
    setEditandoId(null);
  }

  //  EDITAR
  async function editar() {
    try {
      await api.put(`/orcamentos/${editandoId}`, {
        title,
        description,
        cliente,
        tel,
        status,
      });

      // atualiza lista sem reload
      setOrcamentos((prev) =>
        prev.map((item) =>
          item.id === editandoId
            ? { ...item, title, description, cliente, tel, status }
            : item,
        ),
      );

      fecharModal();
    } catch (error) {
      console.log(error);
      alert("Erro ao editar (somente admin)");
    }
  }

  return (
    <div className="container2">
      <div className="listados">
        <span>Orçamentos Registrados!</span>
        <ul>
          {orcamentos.map((item) => (
            <li key={item.id}>
              <h3>TITULO: {item.title}</h3>
              <p>
                <strong>DESCRIÇÃO:</strong> {item.description}
              </p>
              <p>
                <strong>CLIENTE:</strong> {item.cliente}
              </p>

              <p>
                <strong>STATUS:</strong>
                <span className={`status ${item.status}`}>{item.status}</span>
              </p>

              <p>
                <strong>TEL:</strong> {item.tel}
              </p>

              <div className="botoes">
                {usuarioLogado?.role === "admin" && (
                  <button onClick={() => abrirModal(item)}>Editar</button>
                )}

                {usuarioLogado?.role === "admin" && (
                  <button onClick={() => deletar(item.id)}>Deletar</button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/*  MODAL */}

        {modalAberto && (
          <div className="overlay2" onClick={fecharModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Editar Orçamento</h2>

              <input
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                placeholder="Cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />

              <input
                placeholder="Telefone"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
              </select>

              <div className="botoes">
                <button onClick={editar}>Salvar</button>
                <button onClick={fecharModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
