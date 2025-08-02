import "../assets/css/login.css";
import { CarruselLogin } from "../components/carruselLogin.jsx";
import { FormLogin } from "../components/form/formLogin.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
//import {useState} from "react"

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export function AppLogin() {

  //const [form, setForm] = useState()

  const navigate = useNavigate();
  const { login } = useAuth();
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${RUTAJAVA}/api/auth/login`, data);

      const { token, nombre, id_rol } = response.data;
      login(token, nombre, id_rol);

      alert("Login exitoso");
      navigate("/GranjaDash/ingresosTotales");

    } catch (error) {

      if (error.response && error.response.status === 403) {
        alert("Credenciales incorrectas");
      } else {
        alert("Error al iniciar sesión");
      }

    }
  };

  return (
    <>
      <main className="contenLogin d-flex container justify-content-center align-items-center">
        <section className="p-4 border sectionLogin">
          <div className="d-flex ">
            <article>
              <h1 className="fs-4">Bienvenido Usuario GranjaDash</h1>
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
          <FormLogin onSubmit={onSubmit} />
        </section>
        <CarruselLogin />
      </main>
    </>
  );
}