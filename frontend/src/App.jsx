import { Routes, Route } from "react-router-dom";

import Header from '../src/components/Header'
import CardInicial from "../src/components/CardInicial";
import Cadastro from '../src/pages/Cadastro'
import Servicos from "./components/Servicos.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import CadastroUser from "./pages/CadastroUser.jsx"

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/home" element={<CardInicial />} />
        <Route path="/orcamentos" element={<Cadastro />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUser />} />
      </Routes>

      <Footer />
    </>
      
  );
}