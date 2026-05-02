import "./Modelos.css";
import api from "../services/Api";
import { useEffect, useState } from "react";

export default function Modelos() {
  const [title, setTitle] = useState("");
  const [itens, setItens] = useState([]);
  const [nomeItem, setNomeItem] = useState("");
  const [precoItem, setPrecoItem] = useState("");
  const [modelos, setModelos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const total = itens.reduce((acc, item) => acc + Number(item.preco), 0);

  function abrirEdicao(modelo) {
    setEditandoId(modelo.id);
    setTitle(modelo.title);
    setItens(modelo.itens);
  }

  useEffect(() => {
    async function carregarModelos() {
      try {
        const response = await api.get("/modelos");
        setModelos(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    carregarModelos();
  }, []);

  async function deletarModelo(id) {
    try {
      await api.delete(`/modelos/${id}`);

      setModelos((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.log(error);
      alert("Erro ao deletar modelo");
    }
  }

  async function salvarComoCopia(modelo) {
    try {
      const response = await api.post("/modelos", {
        title: modelo.title + " (cópia)",
        itens: modelo.itens,
      });

      setModelos((prev) => [
        ...prev,
        {
          id: response.data.id,
          title: modelo.title + " (cópia)",
          itens: modelo.itens,
        },
      ]);

      alert("Modelo duplicado com sucesso!");
    } catch (error) {
      console.log(error);
      alert("Erro ao duplicar modelo");
    }
  }

  function addItem() {
    if (!nomeItem || !precoItem) return;

    const novoItem = {
      nome: nomeItem,
      preco: precoItem,
    };

    setItens([...itens, novoItem]);

    setNomeItem("");
    setPrecoItem("");
  }

  async function modelo(e) {
    e.preventDefault();

    try {
      if (editandoId) {
        // EDITAR
        await api.put(`/modelos/${editandoId}`, {
          title,
          itens,
        });

        setModelos((prev) =>
          prev.map((m) => (m.id === editandoId ? { ...m, title, itens } : m)),
        );

        alert("Modelo atualizado!");
        setEditandoId(null);
      } else {
        // CRIAR
        const response = await api.post("/modelos", {
          title,
          itens,
        });

        setModelos((prev) => [
          ...prev,
          {
            id: response.data.id,
            title,
            itens,
          },
        ]);

        alert("Modelo criado com sucesso!");
      }

      setTitle("");
      setItens([]);
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar modelo");
    }
  }

  return (
    <div className="container">
      <form onSubmit={modelo}>
        <h2>{editandoId ? "Editar Modelo" : "Criar Modelo"}</h2>

        <input
          placeholder="Título..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Item..."
          value={nomeItem}
          onChange={(e) => setNomeItem(e.target.value)}
        />

        <input
          placeholder="Preço..."
          value={precoItem}
          onChange={(e) => setPrecoItem(e.target.value)}
        />

        <button type="button" onClick={addItem}>
          Adicionar Item
        </button>

        <ul className="itens">
          {itens.map((item, index) => (
            <li key={item.nome + index}>
              {item.nome} - R${item.preco}
            </li>
          ))}
        </ul>

        <div className="total">Total: R$ {total}</div>

        <button type="submit">
          {editandoId ? "Atualizar Modelo" : "Salvar Modelo"}
        </button>
      </form>

      <div className="lista-modelos">
        <h2>Modelos Salvos</h2>

        {modelos.map((modelo) => (
          <div key={modelo.id} className="card-modelo">
            <h3>{modelo.title}</h3>

            <ul>
              {modelo.itens.map((item, index) => (
                <li key={item.nome + index}>
                  {item.nome} - R${item.preco}
                </li>
              ))}
            </ul>

            <div className="botoes-modelo">
              <button onClick={() => abrirEdicao(modelo)}>Editar</button>

              <button onClick={() => salvarComoCopia(modelo)}>
                Salvar como cópia
              </button>

              <button
                className="btn-deletar"
                onClick={() => deletarModelo(modelo.id)}
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
