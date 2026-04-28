import "./Home.css";
import img from "../assets/img-header.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="inicio">
        <br />
        <h1>Serviços de Serralheria e Estruturas Metálicas</h1>
        <p>Qualidade, segurança e acabamento profissional</p>
      </div>
      <br />
      <div className="serviços">
        <h2>O que fazemos?</h2>

        <div className="cards">
          <div className="card">
            <p>Portões</p> <img src={img} />
          </div>

          <div className="card">
            <p>Grades</p> <img src={img} />
          </div>

          <div className="card">
            <p>Estruturas</p> <img src={img} />
          </div>
        </div>

        <div className="botao">
          <div className="coluna">
            <p>Solicite seu orçamento</p>
            <Link to="/login">
              <button>Fazer login</button>
            </Link>
          </div>

          <div className="coluna">
            <p>Crie sua conta</p>
            <Link to="/cadastro">
              <button>Cadastrar</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
