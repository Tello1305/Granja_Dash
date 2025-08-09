import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../auth/authContext";
import Swal from "sweetalert2";
import { FormUsuario } from "../form/formUsuario";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalEditarUsuario({ onUpdated, usuarios, roles }) {
  const { auth } = useAuth();
  const [formKey, setFormKey] = useState(0);

  const [usuario, setUsuario] = useState({
    nombre: "",
    usuario: "",
    password: "",
    id_rol: "",
  });



  useEffect(() => {
    if (usuarios) {
      setUsuario({
        nombre: usuarios.nombre || "",
        usuario: usuarios.usuario || "",
        password: "",
        id_rol: usuarios.id_rol || ""
      });
    }
  }, [usuarios]);

  console.log('los usuaripos son estos: ', usuarios);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUsuario((prev) => ({ ...prev, [id]: value }));
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    document.activeElement?.blur();

    try {
      const usuarioToSend = { ...usuario };
      if (!usuario.password) {
        delete usuarioToSend.password;
      }

      const response = await axios.put(`${RUTAJAVA}/api/usuarios/${usuarios.id_usuario}`, usuarioToSend, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      console.log(response.data);
      if (onUpdated) onUpdated();

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuario actualizado con éxito',
        showConfirmButton: false,
        timer: 1500
      });

      // Cierra modal
      const closeButton = document.querySelector("#modalEditarUsuario .btn-close");
      if (closeButton) closeButton.click();

    } catch (error) {
      console.error("Error al editar usuario:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: error.response?.data?.message || 'Hubo un problema al editar el usuario.'
      });
    }

    setFormKey((prevKey) => prevKey + 1);
  };

  return (
    <div
      className="modal fade"
      id="modalEditarUsuario"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Editar Usuario
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
              onSubmit={handleEditar}
              mostrarCancelar={true}
              key={formKey}
              handleChange={handleChange}
              form={usuario}
              roles={roles}
            />
          </div>
        </div>
      </div>
    </div>
  );
}