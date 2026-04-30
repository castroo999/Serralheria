import "./Header.css";
import { Link } from "react-router-dom";
import img from "../assets/img-header.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  function getUser() {
    try {
      //pega o user logado salvo no local storage
      const user = localStorage.getItem("user");

      //se nao tiver nao muda nda
      if (!user) return null;

      //transforma so o nome do usuario em JSON
      const parsed = JSON.parse(user);

      //retona o user
      if (typeof parsed === "object" && parsed.user) {
        return parsed;
      }

      return null;
    } catch {
      return null;
    }
  }

  const [usuario, setUsuario] = useState(getUser());
  const navigate = useNavigate();
  

  function sair() {
    localStorage.clear();
    setUsuario(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  }

  //para atualizar o user atual
  useEffect(() => {
    const atualizarUser = () => {
      setUsuario(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("userChanged", atualizarUser);

    return () => {
      window.removeEventListener("userChanged", atualizarUser);
    };
  }, []);

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    function atualizarToken() {
      setToken(localStorage.getItem("token"));
    }

    window.addEventListener("userChanged", atualizarToken);

    return () => {
      window.removeEventListener("userChanged", atualizarToken);
    };
  }, []);

  return (
    <>
      <div className="navbar">
        <h2>INOVE SERRALHERIA</h2>

        <nav>
          
          {!token && (
            <>
              <Link to="/">INICIO</Link>
              <Link to="/">SERVIÇOS</Link>
              <Link to="/login">LOGIN</Link>
              <Link to="/cadastro">CADASTRAR</Link>
            </>
          )}

          {token && (
            <>
              <Link to="/dashboard">INICIO</Link>
              <Link to="/servicos">SERVIÇOS</Link>
              <Link to="/orcamentos">ORÇAMENTOS</Link>
              <Link to="/ver_orcamentos">VER ORÇAMENTOS</Link>
              {usuario?.role === "admin" &&(
                <Link to="/modelos">VER MODELOS</Link>
              )}
            </>
          )}
        </nav>

        {usuario && (
          <>
            <span className="user">User: {usuario.user}</span>
            <button onClick={sair}>Sair</button>
          </>
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
