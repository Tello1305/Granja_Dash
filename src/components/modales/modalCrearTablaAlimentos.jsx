import FormularioAlimento from "../form/formAlimentos.jsx";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../auth/authContext.jsx";
import Swal from "sweetalert2";


const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalAlimentos({ onUpdated, mostrarCancelar = true }) {

  const [formKey, setFormKey] = useState(0);
  const { auth } = useAuth();

  const handleCrear = async (form) => {
    
    const data = new FormData();
    data.append("nombre", form.nombre);
    data.append("descripcion", form.descripcion);
    if (form.imagen) {
      data.append("imagen", form.imagen);
    }

    try {
      const response = await axios.post(`${RUTAJAVA}/api/alimentacion`, data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (onUpdated) onUpdated();
      setFormKey(prevKey => prevKey + 1);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Alimento creado con éxito',
        showConfirmButton: false,
        timer: 1500
      });

      
      const closeButton = document.querySelector(
        "#ModalCrearTablaAlimentos .btn-close"
      );
      if (closeButton) {
        closeButton.click(); 
      }
      if (document.activeElement) {
        document.activeElement.blur();
      }
      

    } catch (error) {
      console.error("Error al crear:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear',
        text: 'Hubo un problema al crear el alimento.'
      });
    }
  };

  return (
    <div
      className="modal fade"
      id="ModalCrearTablaAlimentos"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Crear Alimento
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <FormularioAlimento key={formKey} onSubmit={handleCrear} mostrarCancelar={mostrarCancelar} />
          </div>
        </div>
      </div>
    </div>
  );
}
