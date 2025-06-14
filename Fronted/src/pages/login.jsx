import { useState } from "react";
import "../assets/css/login.css";
import { FormBoton } from "../components/formBoton.jsx";
import { CarruselLogin } from "../components/carruselLogin.jsx";

export function AppLogin() {
  const [formLogin, setFormLogin] = useState({
    usuario: "",
    contraseña: "",
  });

  const iptData = (e) => {
    const { id, value } = e.target;
    setFormLogin((prev) => ({ ...prev, [id]: value }));
  };

  const iptSubmit = (e) => {
    e.preventDefault();
    console.log(formLogin);
  };

  return (
    <>
      <main className="contenLogin d-flex container justify-content-center align-items-center">
        <section className="p-4 border sectionLogin">
          <div className="d-flex ">
            <article>
              <h1 className="fs-4">Iniciar Sesion</h1>
            </article>
            <article className="ms-auto">
              <img
                className="w-25 "
                src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-black-hen-logo-vector-png-image_6681063.png"
                alt=""
              />
            </article>
          </div>
          <br />

          <form onSubmit={iptSubmit}>
            <FormBoton
              id="usuario"
              label="usuario"
              type="text"
              value={formLogin.usuario}
              onChange={iptData}
              placeholder="usuario"
            />
            <br />
            <FormBoton
              id="contraseña"
              label="contraseña"
              type="password"
              value={formLogin.contraseña}
              onChange={iptData}
              placeholder="contraseña"
            />
            <br />
            <button type="submit">Enviar</button>
          </form>
          <br />
          <a href="#">¿No tienes cuenta?</a>
        </section>
        <CarruselLogin />
      </main>
    </>
  );
}
