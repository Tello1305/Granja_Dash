import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../auth/authContext.jsx";
import {FormUsuario} from "../form/formUsuario.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalCrearUsuario({ onUpdated }) {
    //const [formkey, setFormKey] = useState(0);
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    password: "",
    id_rol: "",
    
  });

  const { auth } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrear = (e) => {
    e.preventDefault();
    

    const fetchUsuarios = async () => {
      try {
        const response = await axios.post(`${RUTAJAVA}/api/usuarios`, form, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        console.log(response);
        if (onUpdated) onUpdated();
        setForm({
            nombre: "",
            usuario: "",
            password: "",
            id_rol: "",
          });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Usuario creado con éxito',
          showConfirmButton: false,
          timer: 1500
        });
        const closeButton = document.querySelector("#modalCrearUsuario .btn-close");
        if (closeButton) closeButton.click();
        if (document.activeElement) document.activeElement.blur();
      } catch (error) {
        console.error("Error al crear:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear',
          text: 'Hubo un problema al crear el usuario.'
        });
      }
    };
    fetchUsuarios();
  }

    

  return (
    <div
      className="modal fade"
      id="modalCrearUsuario"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Crear Usuario
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <FormUsuario
              onSubmit={handleCrear}
              mostrarCancelar={true}
              form={form}
              handleChange={handleChange}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
