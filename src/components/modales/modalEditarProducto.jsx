
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../auth/authContext";
import Swal from 'sweetalert2';
import {FormProducto} from "../form/formProducto";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export function ModalEditarProducto({ producto, onUpdated }) {
    const { auth } = useAuth();

    const [formKey, setFormKey] = useState(0);
    const [formEdit, setFormEdit] = useState({
        nombre: "",
        descripcion: "",
        id_raza: "",
    });

    useEffect(() => {
        if (producto) {
          setFormEdit({
            nombre: producto.nombre || "",
            descripcion: producto.descripcion || "",
            id_raza: producto.id_raza || "",
          });
        }
      }, [producto]);
    
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormEdit((prev) => ({ ...prev, [id]: value }));
    };
    
    const handleCancelar = () => {
        if (producto) {
            setFormEdit({
                nombre: producto.nombre || "",
                descripcion: producto.descripcion || "",
                id_raza: producto.id_raza || "",
            });
        }
    }

    const handleEditar = async (e) => {
        e.preventDefault();
        document.activeElement?.blur();

        try {

            const response = await axios.put(`${RUTAJAVA}/api/productoAnimales/${producto.id_producto}`, formEdit, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                }
            });
            console.log(response.data);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Producto actualizado con éxito',
                showConfirmButton: false,
                timer: 1500
            });
            setFormKey(prevKey => prevKey + 1); 
            if (onUpdated) onUpdated();
            setFormEdit({
                nombre: '',
                descripcion: '',
                id_raza: '',
            });

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: 'Hubo un problema al editar el producto.'
            });
        }

        const closeButton = document.querySelector(
            "#modalEditarProducto .btn-close"
          );
          if (closeButton) {
            closeButton.click();
          }
          if (document.activeElement) {
            document.activeElement.blur();
          }

    }
    
    return (
        <div
              className="modal fade"
              id="modalEditarProducto"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Editar Producto
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <FormProducto
                      onSubmit={handleEditar}
                      mostrarCancelar={true}
                      key={formKey}
                      handleChange={handleChange}
                      form={formEdit}
                      onCancelar={handleCancelar}
                    />
                  </div>
                </div>
              </div>
            </div>
    )
}
    


