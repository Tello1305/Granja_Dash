import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import TablaGenerica from "../TablaGenerica.jsx";
import ModalEditarLote from "../modales/modalEditarLote.jsx";
import ModalCrearLote from "../modales/modalCrearLote.jsx";
import { useAuth } from "../../auth/authContext.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function TablaLotesAnimales() {

  const [loteSeleccionada, setLoteSeleccionada] = useState(null);
  const [lotes, setLotes] = useState([]);

  const { auth } = useAuth();

  const fetchLotes = async () => {
    try {
      const response = await axios.get(`${RUTAJAVA}/api/lotesDeAnimales`);
      setLotes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  const handleDelete = (id_lote) => {
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
          await axios.delete(`${RUTAJAVA}/api/lotesDeAnimales/${id_lote}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });
          setLotes(prev => prev.filter(lote => lote.id_lote !== id_lote));
          Swal.fire(
            '¡Eliminado!',
            'El lote ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error("Error al eliminar:", error);
          Swal.fire(
            '¡Error!',
            'No se pudo eliminar el lote. Intente nuevamente.',
            'error'
          );
        }
      }
    });
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
      header: "CANTIDAD",
      accessorKey: "cantidad",
      enableSorting: true
    },
    {
      header: "FECHA DE COMPRA",
      accessorKey: "fecha",
      enableSorting: true,
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleString("es-PE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    },
      {
        header: "RAZA",
        accessorKey: "razaNombre", 
        enableSorting: true,
      },
    
      {
        header: "IMAGEN",
        accessorKey: "imagen",
        enableSorting: false,
        cell: (info) => (
          <img
            src={`${RUTAJAVA}/uploads/${info.getValue()}`}
            alt="Imagen"
            style={{
              width: "80px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            onClick={() => window.open(`${RUTAJAVA}/uploads/${info.getValue()}`, '_blank')}
          />
        )
      },
    {
      header: "ACCIÓN",
      enableSorting: false,
      cell: (info) => (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-danger btn-sm "
            onClick={() => handleDelete(info.row.original.id_lote)}

          >
            Eliminar
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#ModalEditarTablaLote"
            onClick={() => setLoteSeleccionada(info.row.original)}
          >
            Editar
          </button>
        </div>
      )
    }
  ];
    return (
        <section className="container mt-0 mb-4">
          <h2>Lotes de Animales</h2>
          <hr />
          <TablaGenerica
        data={lotes}
        columns={columns}
        showSearch={true}
        showPagination={true}
        itemsPerPage={10}
        createModalId="#ModalCrearTablaLote"
        onCreate={() => document.activeElement.blur()}
      />
      <ModalEditarLote lote={loteSeleccionada} onUpdated={fetchLotes} />
      <ModalCrearLote onUpdated={fetchLotes} />
        </section>
    )
}
    