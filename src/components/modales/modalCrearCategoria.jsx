import FormularioCategoria from "../form/formCategoria.jsx";
import { useState} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../auth/authContext.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalCrearCategoria({ onUpdated, mostrarCancelar = true }) {

    const [formKey, setFormKey] = useState(0);
    const { auth } = useAuth();

    const handleCrear = async (form) => {
        try {
        const response = await axios.post(`${RUTAJAVA}/api/CategoriaProductos`,
          {
            nombre: form.nombre,
            descripcion: form.descripcion,
          }
          ,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          }
        );
        if (onUpdated) onUpdated();
        setFormKey(prevKey => prevKey + 1); // Reinicia el formulario
        console.log(response.data);
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Categoría creada con éxito',
            showConfirmButton: false,
            timer: 1500
        });
  
        
        const closeButton = document.querySelector(
          "#ModalCrearTablaCategoria .btn-close"
        );
        if (closeButton) {
          closeButton.click(); // Dispara el evento de cerrar
        }
        if (document.activeElement) {
          document.activeElement.blur();
        }
        
  
      } catch (error) {
        console.log(error);
        Swal.fire({
            icon: 'error',
            title: 'Error al crear',
            text: 'Hubo un problema al crear la categoría.'
        });
      }
    };



    return (
        <div
        className="modal fade"
        id="ModalCrearTablaCategoria"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Crear Categoria
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <FormularioCategoria key={formKey} onSubmit={handleCrear} mostrarCancelar={mostrarCancelar} />
            </div>
          </div>
        </div>
      </div>
    )

}

    