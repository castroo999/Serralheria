import "./CardInicial.css";
import img from "../assets/img-header.png";

export default function CardInicial() {
  return (
    <div className="tudo">
      <h1>Alguns de nossos serviços</h1>

      <div className="cards">
        <div className="card">
          <img src={img} alt="img" />
        </div>
        <div className="card">
          <img src={img} alt="img" />
        </div>
        <div className="card">
          <img src={img} alt="img" />
        </div>
        <div className="card">
          <img src={img} alt="img" />
        </div>
        <div className="card">
          <img src={img} alt="img" />
        </div>
        <div className="card">
          <img src={img} alt="img" />
        </div>
      </div>
    </div>
  );
}
