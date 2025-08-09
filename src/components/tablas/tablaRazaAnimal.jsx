import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import TablaGenerica from "../TablaGenerica.jsx";
import ModalEditarRaza from "../modales/modalEditarRaza.jsx";
import ModalCrearRaza from "../modales/modalCrearRaza.jsx";
import { useAuth } from "../../auth/authContext";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function TablaRazaAnimal({ razasData, onDataUpdate }) {
  const { auth } = useAuth();
  const [razaSeleccionada, setRazaSeleccionada] = useState(null);

  const handleDelete = (id_raza) => {
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
          await axios.delete(`${RUTAJAVA}/api/razaAnimales/${id_raza}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });
          onDataUpdate();
          Swal.fire(
            '¡Eliminado!',
            'La raza ha sido eliminada.',
            'success'
          )
        } catch (error) {
          console.error("Error al eliminar:", error);
          Swal.fire(
            '¡Error!',
            'No se pudo eliminar la raza. Intente nuevamente.',
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
      header: "CATEGORIA",
      accessorKey: "categoriaNombre", 
      enableSorting: true,
    },
    {
      header: "DUEÑO",
      accessorKey: "dueno", 
      enableSorting: true,
    },
    {
      header: "DISPOSICIÓN",
      accessorKey: "enUso", 
      enableSorting: true,
      cell: (info) => (
        <span className={`badge ${info.row.original.enUso ? 'bg-warning text-dark' : 'bg-success'}`}>
          {info.row.original.enUso ? "En uso" : "Sin uso"}
        </span>
      )
    },
    {
      header: "ACCIÓN",
      enableSorting: false,
      cell: (info) => (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(info.row.original.id_raza)}
            disabled={info.row.original.enUso}
          >
            <i className="bi bi-trash-fill"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#ModalEditarRaza"
            onClick={() => setRazaSeleccionada(info.row.original)}
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
        data={razasData}
        columns={columns}
        showSearch={true}
        showPagination={true}
        itemsPerPage={10}
        createModalId="#ModalCrearTablaRaza"
        onCreate={() => document.activeElement.blur()}
      />
      <ModalEditarRaza
        raza={razaSeleccionada}
        onUpdated={onDataUpdate}
      />
      <ModalCrearRaza onUpdated={onDataUpdate} />
    </div>
  )
}