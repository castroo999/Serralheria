import "./Header.css";
import { Link } from "react-router-dom";
import img from "../assets/img-header.png";

export default function Header() {

  function getUser() {
    try {
      const user = localStorage.getItem("user");

      if (!user) return null;

      const parsed = JSON.parse(user);

      if (typeof parsed === "object" && parsed.user) {
        return parsed;
      }

      return null;
    } catch {
      return null;
    }
  }

  const usuario = getUser();

  return (
    <>
      <div className="navbar">
        <h2>INOVE SERRALHERIA</h2>

        <nav>
          <Link to="/home">HOME</Link>
          <Link to="/servicos">SERVIÇOS</Link>
          <Link to="/orcamentos">ORÇAMENTOS</Link>
          <Link to="/ver_orcamentos">VER ORÇAMENTOS</Link>
        </nav>

        {usuario && (
          <p className="user">
            User: {usuario.user}
          </p>
        )}
      </div>

      <div className="header">
        <div className="header-texto">
          <h1>INOVE SERRALHERIA</h1>
          <p>Serviços de Solda, Usinagem, Mecânica industrial e Serralheria</p>
        </div>

        <div className="header-img">
          <img src={img} alt="img" />
          <div className="overlay"></div>
        </div>
      </div>
    </>
  );
}