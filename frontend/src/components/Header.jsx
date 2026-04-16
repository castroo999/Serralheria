import "./Header.css";
import { Link } from "react-router-dom";
import img from "../assets/img-header.png";
import { useState } from "react";

export default function Header() {
  const [usuario] = useState(() => {
    const userStorage = localStorage.getItem("user");
    return userStorage ? JSON.parse(userStorage) : null;
  });

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

        {usuario && <p className="user">User: {usuario.user}</p>}
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
