import "./VerServico.css";
import { useEffect, useState } from "react";
import api from "../services/Api";

export default function VerServico() {
  const usuarioLogado = JSON.parse(localStorage.getItem("user"));
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDeletar, setModalDeletar] = useState(false);
  const [modalSucessoEditar, setModalSucessoEditar] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cliente, setCliente] = useState("");
  const [tel, setTel] = useState("");
  const [endereco, setEndereco] = useState("");
  const [status, setStatus] = useState("");
  const [idParaDeletar, setIdParaDeletar] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [filtro, setFiltro] = useState("");





  //filtro de orçamento
  const orcamentosFiltrados = orcamentos.filter((item) => {
    const texto = filtro.toLocaleLowerCase();

    return (
      item.title.toLowerCase().includes(texto) ||
      item.cliente.toLowerCase().includes(texto) ||
      item.status.toLowerCase().includes(texto)
    );
  });

  //carrega os orçamentos
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

  //  ABRIR MODAL
  function abrirModal(item) {
    setEditandoId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setCliente(item.cliente);
    setTel(item.tel);
    setEndereco(item.endereco);
    setStatus(item.status);
    setModalAberto(true);
  }

  //  FECHAR MODAL
  function fecharModal() {
    setModalAberto(false);
    setModalDeletar(false);
    setModalSucessoEditar(false);
    setEditandoId(null);
  }

  //mandar mensagem pelo whatszap do cliente
  function mandarMsg(tel, cliente) {
    //pega o numero do cliente e tira tudo q nao é numero
    const numero = tel.replace(/\D/g, "");

    //msg que será enviada para o cliente
    const msg = `Olá ${cliente}, tudo bem?
    estamos entrando em contato para falar 
    sobre seu orçamento que foi aprovado`;

    //para abrir o whatszap com o numero do cliente e a msg
    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank");

    if (!tel) return alert("numero invalido!");
  }

  //  EDITAR
  async function editar() {
    try {
      await api.put(`/orcamentos/${editandoId}`, {
        title,
        description,
        cliente,
        tel,
        endereco,
        status,
      });

      // atualiza lista sem reload
      setOrcamentos((prev) =>
        prev.map((item) =>
          item.id === editandoId
            ? { ...item, title, description, cliente, tel, endereco, status }
            : item,
        ),
      );

      fecharModal();
      setModalSucessoEditar(true);
    } catch (error) {
      console.log(error);
      alert("Erro ao editar (somente admin)");
    }
  }

  return (
    <div className="container2">
      <div className="listados">
        {usuarioLogado?.role === "admin" && (
          <input
            type="text"
            className="filtro"
            placeholder="Filtrar por cliente ou status..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        )}

        <span>Orçamentos Registrados!</span>
        <ul>
          {orcamentosFiltrados.map((item) => (
            <li key={item.id} className={item.status}>
              <h3>TITULO: {item.title}</h3>
              <p>
                <strong>DESCRIÇÃO:</strong> {item.description}
              </p>
              <p>
                <strong>CLIENTE:</strong> {item.cliente}
              </p>

              <p>
                <strong>ENDEREÇO:</strong> {item.endereco}
              </p>

              <p>
                <strong>TEL:</strong> {item.tel}
              </p>

              <p>
                <strong>DATA:</strong>{" "}
                {new Date(item.criado_em).toLocaleString("pt-BR")}
              </p>

              <p>
                <strong>STATUS:</strong>
                <span className={`status ${item.status}`}>{item.status}</span>
              </p>

              <div className="botoes">
                {usuarioLogado?.role === "admin" && (
                  <button onClick={() => abrirModal(item)}>Editar</button>
                )}

                {usuarioLogado?.role === "admin" && (
                  <button
                    onClick={() => {
                      setIdParaDeletar(item.id);
                      setModalDeletar(true);
                    }}
                  >
                    Deletar
                  </button>
                )}
              </div>
              {usuarioLogado?.role === "admin" && (
                <button
                  className="whats"
                  onClick={() => mandarMsg(item.tel, item.cliente)}
                >
                  Enviar mensagem
                </button>
              )}
            </li>
          ))}
        </ul>

        {modalDeletar && (
          <div className="overlay4" onClick={fecharModal}>
            <div className="modal3" onClick={(e) => e.stopPropagation()}>
              <div className="certeza">
                <h3>
                  Certeza que deseja excluir esse item? (essa ação nao tem
                  volta!)
                </h3>

                <div className="botoes">
                  <button
                    onClick={() => {
                      deletar(idParaDeletar);
                      fecharModal();
                    }}
                  >
                    Confirmar
                  </button>

                  <button onClick={fecharModal}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalSucessoEditar && (
          <div className="overlay4" onClick={fecharModal}>
            <div className="modal3" onClick={(e) => e.stopPropagation()}>
              <h3>Orçamento atualizado com sucesso!</h3>
              <button onClick={fecharModal}>Fechar</button>
            </div>
          </div>
        )}

        {/*  modal */}
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
                placeholder="Cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />

              <input
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />

              <input
                placeholder="Telefone"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
              />

              <textarea
                placeholder="Descreva o serviço com detalhes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />

              <select
                className={status}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
                <option value="aguardando">Aguardando Resposta</option>
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