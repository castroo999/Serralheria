import { Routes, Route } from "react-router-dom";

import Header from '../src/components/Header'
import CardInicial from "../src/components/CardInicial";
import Cadastro from '../src/pages/Cadastro'

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