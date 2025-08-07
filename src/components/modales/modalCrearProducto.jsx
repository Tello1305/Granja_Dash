import { useState, useEffect } from "react";
import {FormProducto} from "../form/formProducto.jsx";
import axios from 'axios';
import { useAuth } from "../../auth/authContext";
import Swal from 'sweetalert2';
const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export function ModalCrearProducto({onUpdated}) {

    const [formKey, setFormKey] = useState(0)
    const [form, setForm] = useState ({
        nombre: '',
        descripcion: '',
        id_raza: '',
    })
   

    const { auth } = useAuth();

    const handleChange = (e) => {
        const {id, value} = e.target;
        setForm((prev) => ({
            ...prev,
            [id]:value
        }))
    }

    const handleCrear = async (e) => {
        e.preventDefault()

        try {

            const response = await axios.post(`${RUTAJAVA}/api/productoAnimales`, form,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    }
                }
            );
            console.log(response.data);
            if (onUpdated) onUpdated();
            setFormKey(prevKey => prevKey + 1);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Producto creado con éxito',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error("Error al crear:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al crear',
                text: 'Hubo un problema al crear el producto.'
            });
        }

        const closeButton = document.querySelector(
            "#modalCrearProducto .btn-close"
          );
          if (closeButton) {
            closeButton.click();
          }
          if (document.activeElement) {
            document.activeElement.blur();
          }
    }

    const handleCancelar = () => {
        setForm({
            nombre: '',
            descripcion: '',
            id_raza: '',
        });
        setFormKey(prevKey => prevKey + 1); 
    }
    return (
        <>
        <div
        className="modal fade"
        id="modalCrearProducto"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Crear Producto
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
              form={form}
              handleChange={handleChange}
              key={formKey}
              onSubmit={handleCrear} 
              mostrarCancelar={true}
              onCancelar={handleCancelar}
              />
            </div>
          </div>
        </div>
        </div>
        
        </>
    )
}
