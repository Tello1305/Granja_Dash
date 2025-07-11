import axios from "axios";
import "../assets/css/formCompra.css";
import FormularioAlimento from "./formAlimentos.jsx";

export function RegistroCompra({ mostrarCancelar = false }) {
  
  const handleCrear = async (form) => {
    const data = new FormData();
    data.append("nombre", form.nombre);
    data.append("cantidad", form.cantidad);
    data.append("costo", form.costo);
    data.append("id_categoria", form.id_categoria);
    if (form.imagen) {
      data.append("imagen", form.imagen);
    } 

    try{
      const response = await axios.post("http://localhost:8000/api/alimentacion", data);
      console.log(response.data);
      alert("Alimento creado correctamente");
    }catch(error){
      console.log(error);
      alert("Error al crear el alimento");
    }
  };

  return (

  <div className="container mt-4 formComprar ">
    <h1>Registro de Compra de Alimentos</h1>
    <br />
    <FormularioAlimento onSubmit={handleCrear} mostrarCancelar={mostrarCancelar} />

  </div>
  );
}