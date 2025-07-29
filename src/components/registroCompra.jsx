import axios from "axios";
import "../assets/css/formCompra.css";
import FormularioAlimento from "./form/formAlimentos.jsx";
import {useState} from "react";

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

    try{
      const response = await axios.post(`${RUTAJAVA}/api/alimentacion`, data);
      console.log(response.data);
      alert("Alimento creado correctamente");
      setFormKey(prevKey => prevKey + 1); 
    }catch(error){
      console.log(error);
      alert("Error al crear el alimento");
    }
  };

  return (

  <div >
    <h1>Registro de Compra de Alimentos</h1>
    <br />
    <FormularioAlimento key={formKey} onSubmit={handleCrear} mostrarCancelar={mostrarCancelar} />

  </div>
  );
}