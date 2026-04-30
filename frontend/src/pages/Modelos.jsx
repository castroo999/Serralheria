import "./Modelos.css";
import api from "../services/Api";
import { useEffect, useState } from "react";

export default function Modelos() {
  const [title, setTitle] = useState("");
  const [itens, setItens] = useState([]);
  const [nomeItem, setNomeItem] = useState("");
  const [precoItem, setPrecoItem] = useState("");
  const [modelos, setModelos] = useState([])

  const total = itens.reduce((acc, item) => acc + Number(item.preco), 0);

  useEffect(() => {
    async function carregarModelos() {
        try{
            const response = await api.get('/modelos')
            setModelos(response.data)
        }
        catch (error){
            console.log(error)
        }
    }

    carregarModelos();
  }, [])

  async function deletarModelo(id) {
    try {
      await api.delete(`/modelos/${id}`);

      setModelos((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.log(error);
      alert("Erro ao deletar modelo");
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

    console.log("ENVIANDO:", { title, itens });

    try {
      const response = await api.post("/modelos", {
        title,
        itens,
      });

      alert("Modelo criado com sucesso!");

      // adiciona na lista sem precisar recarregar
      setModelos((prev) => [
        ...prev,
        {
          id: response.data.id,
          title,
          itens,
        },
      ]);

      
      setTitle("");
      setItens([]);
    } catch (error) {
      console.log(error);
      alert("Erro ao criar modelo");
    }
  }

  return (
    <div className="container">
      <form onSubmit={modelo}>
        <h2>Criar Modelo</h2>

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
            <li key={index}>
              {item.nome} - R${item.preco}
            </li>
          ))}
        </ul>

        <div className="total">Total: R$ {total}</div>

        <button type="submit">Salvar Modelo</button>
      </form>


      <div className="lista-modelos">
        <h2>Modelos Salvos</h2>

        {modelos.map((modelo) => (
          <div key={modelo.id} className="card-modelo">
            <h3>{modelo.title}</h3>

            <ul>
              {modelo.itens.map((item, index) => (
                <li key={index}>
                  {item.nome} - R${item.preco}
                </li>
              ))}
            </ul>

            <button  className="btn-deletar" onClick={() => deletarModelo(modelo.id)}>
              Deletar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}