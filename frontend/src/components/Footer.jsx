import "./Footer.css";
import { FaInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <div className="footer">
      <div className="contato">
        <h2>Entre em contato aqui:</h2>
        <span>
          <MdEmail size={30} color="white"/>
          VSTR@gmail.com
        </span> 
        <span>
          <MdEmail size={30} color="white"/>
          inoveserralheria@gmail.com
        </span>
        <span>
          <FaInstagram size={30} color="deeppink" />Instagram: @inove.serralheria.cerquilho

        </span>
        <span>
          <FaWhatsapp size={30} color="green" /> Tel: (55) 15996485913
        </span>
      </div>
    </div>
  );
}