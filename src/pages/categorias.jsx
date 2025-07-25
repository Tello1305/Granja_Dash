import { Header } from "../components/header.jsx";
import { Nav } from "../components/nav.jsx";
import { Secciones } from "../components/secciones.jsx";
import GraficoClima from "../components/graficos/graficosCategorias.jsx";


export function Categorias() {
  return (
    <>
      <Header administrador="jesus" />
      <div className="d-flex">
        <Nav />
       <section className="container mt-3">
        <Secciones dataGeneral="1000" />
        <GraficoClima/>
       </section>
      </div>
    </>
  );
}
