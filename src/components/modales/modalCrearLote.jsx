import { FormLote } from "../form/formLote";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../auth/authContext";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalCrearLote({ onUpdated }) {
    const { auth } = useAuth();

    const [formKey, setFormKey] = useState(0);


    const handleSubmit = async (form) => {

        const data = new FormData();
        data.append("nombre", form.nombre);
        data.append("cantidad", form.cantidad);
        data.append("id_raza", form.id_raza);
        if (form.imagen) {
            data.append("imagen", form.imagen);
        }

        try {
            const response = await axios.post(`${RUTAJAVA}/api/lotesDeAnimales`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${auth.token}`
                }
            });
            if (onUpdated) onUpdated();
            setFormKey(prevKey => prevKey + 1);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Lote creado con éxito',
                showConfirmButton: false,
                timer: 1500
            });

            const closeButton = document.querySelector(
                "#ModalCrearTablaLote .btn-close"
            );
            if (closeButton) {
                closeButton.click(); // Dispara el evento de cerrar
            }
            if (document.activeElement) {
                document.activeElement.blur();
            }
        } catch (error) {
            console.error("Error al crear el lote:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al crear',
                text: 'Hubo un problema al crear el lote.'
            });
        }
    }
    return (
        <div
            className="modal fade"
            id="ModalCrearTablaLote"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            Crear Lote
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <FormLote onSubmit={handleSubmit} mostrarCancelar={true} key={formKey} />
                    </div>
                </div>
            </div>
        </div>
    )
}   