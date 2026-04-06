import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import CardInicial from "./components/CardInicial";
import Cadastro from "./pages/Cadastro";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<CardInicial />} />
        <Route path="/orcamentos" element={<Cadastro />} />
      </Routes>
    </>
  );
}