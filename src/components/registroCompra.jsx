import axios from "axios";
import "../assets/css/formCompra.css";
import FormularioAlimento from "./form/formAlimentos.jsx";
import { useState } from "react";
import Swal from "sweetalert2";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export function RegistroCompra({ mostrarCancelar = false }) {

  const [formKey, setFormKey] = useState(0);

  const handleCrear = async (form) => {
    const data = new FormData();
    data.append("nombre", form.nombre);
    data.append("descripcion", form.descripcion);
    if (form.imagen) {
      data.append("imagen", form.imagen);
    }

    try {
      const response = await axios.post(`${RUTAJAVA}/api/alimentacion`, data);
      console.log(response.data);
      Swal.fire({
        icon:'success',
        title:'Alimento creado correctamente',
        showConfirmButton:false,
        timer:1500
      })
      setFormKey(prevKey => prevKey + 1);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon:'error',
        title:'Error al crear el alimento',
        showConfirmButton:false,
        timer:1500
      })
    }
  };

  return (
    <div className="container w-100 p-3">
      <div className="container w-100 d-flex border-bottom border-2 border-gray p-0">
        <h2 className="text-start">Registro de Compra - Alimento</h2>
      </div>
      <div className="container w-100 d-flex justify-content-start align-items-center mt-2 p-0">
        <br />
        <FormularioAlimento key={formKey} onSubmit={handleCrear} mostrarCancelar={mostrarCancelar} />
      </div>

    </div>
  );
}