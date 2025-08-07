import "../assets/css/login.css";
import { CarruselLogin } from "../components/carruselLogin.jsx";
import { FormLogin } from "../components/form/formLogin.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import Swal from 'sweetalert2';
//import {useState} from "react"
//import {jwtDecode} from "jwt-decode";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export function AppLogin() {

  //const [form, setForm] = useState()

  const navigate = useNavigate();
  const { login } = useAuth();
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${RUTAJAVA}/api/auth/login`, data);

      const { token } = response.data;
      login(token);

      Swal.fire({
        icon: 'success',
        title: 'BIENVENIDO',
        showConfirmButton: false,
        timer: 1500
      })
      navigate("/GranjaDash/ingresosTotales");

    } catch (error) {

      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          showConfirmButton: false,
          timer: 1500
        })
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