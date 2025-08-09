
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import TablaGenerica from "../TablaGenerica.jsx";
import ModalCrearUsuario from "../modales/modalCrearUsuario.jsx";
import ModalEditarUsuario from "../modales/modalEditarUsuario.jsx";
import { useAuth } from "../../auth/authContext";


const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function UsuariosList({ onDataUpdate }) {
  const { auth } = useAuth();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarios, setUsuario] = useState();


  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${RUTAJAVA}/api/usuarios`);
      setUsuario(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);



  const handleDelete = (id_usuario) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡bórralo!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${RUTAJAVA}/api/usuarios/${id_usuario}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });
          fetchUsuarios();
          Swal.fire(
            '¡Eliminado!',
            'El usuario ha sido eliminado.',
            'success'
          )
        } catch (error) {
          console.error("Error al eliminar:", error);
          Swal.fire(
            '¡Error!',
            'No se pudo eliminar el usuario. Intente nuevamente.',
            'error'
          )
        }
      }
    })
  };

  const columns = [
    {
      header: "N°",
      accessorKey: "id",
      cell: (info) => info.row.index + 1,
      enableSorting: false,
      size: 50
    },
    {
      header: "NOMBRE",
      accessorKey: "nombre",
      enableSorting: true
    },
    {
      header: "USUARIO",
      accessorKey: "usuario",
      enableSorting: true,
    },
    {
      header: "CLAVE",
      accessorKey: "clave",
      enableSorting: false,
      cell: () => "********",


    },
    {
      header: "ROL",
      accessorKey: "rolNombre",
      enableSorting: true,


    },
    {
      header: "ACCIÓN",
      enableSorting: false,
      cell: (info) => (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(info.row.original.id_usuario)}
            disabled={info.row.original.enUso}
          >
            <i className="bi bi-trash-fill"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalEditarUsuario"
            onClick={() => setUsuarioSeleccionado(info.row.original)}
          >
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="container mt-0 mb-4">
      <TablaGenerica
        data={usuarios}
        columns={columns}
        showSearch={true}
        showPagination={true}
        itemsPerPage={10}
        createModalId="#modalCrearUsuario"
        onCreate={() => document.activeElement.blur()}
      />

      <ModalCrearUsuario
        //usuario={usuarioSeleccionada}
        onUpdated={fetchUsuarios}
      />
      <ModalEditarUsuario
        usuarios={usuarioSeleccionado}
        onUpdated={fetchUsuarios}
      />

    </div>
  )
}