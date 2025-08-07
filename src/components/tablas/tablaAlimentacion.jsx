import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import TablaGenerica from "../TablaGenerica";
import ModalEditarTablaAlimentos from "../modales/modalEditarTablaAlimentos";
import ModalCrearTablaAlimentos from "../modales/modalCrearTablaAlimentos";
import StockAlimentos from "../tablaModales/StockAlimentos";
//import ModalStockAlimentos from "../modales/modalCrearStock";
import { useAuth } from '../../auth/authContext.jsx';
import '../../assets/css/ToggleSwitch.css';

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function AlimentacionList() {

  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
  const [alimentos, setAlimentos] = useState([]);
  const { auth } = useAuth();

  const fetchAlimentos = async () => {
    try {
      const response = await axios.get(`${RUTAJAVA}/api/alimentacion`);
      console.log(response.data);
      setAlimentos(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchAlimentos();
  }, []);

  const handleDelete = (id_alimento) => {
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
          await axios.delete(`${RUTAJAVA}/api/alimentacion/${id_alimento}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });
          setAlimentos(prev => prev.filter(alimento => alimento.id_alimento !== id_alimento));
          Swal.fire(
            '¡Eliminado!',
            'El alimento ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error("Error al eliminar:", error);
          if (error.response && error.response.status === 400 && error.response.data.includes("historial")) {
            Swal.fire({
              title: 'No se puede eliminar',
              text: "Este alimento tiene historial de movimientos. ¿Deseas inactivarlo en su lugar?",
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Sí, inactivar',
              cancelButtonText: 'No'
            }).then((result) => {
              if (result.isConfirmed) {
                handleToggleEstado(id_alimento, "ACTIVO");
              }
            });
          } else {
            Swal.fire(
              '¡Error!',
              'No se pudo eliminar el alimento. Intente nuevamente.',
              'error'
            );
          }
        }
      }
    });
  };

  const handleToggleEstado = async (id_alimento, estadoActual) => {
    const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    try {
      await axios.put(`${RUTAJAVA}/api/alimentacion/${id_alimento}/estado`,
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );

      const alimentosActualizados = alimentos.map(alimento =>
        alimento.id_alimento === id_alimento
          ? { ...alimento, estado: nuevoEstado }
          : alimento
      );

      setAlimentos(alimentosActualizados);
      Swal.fire(
        '¡Estado cambiado!',
        `El alimento ahora está ${nuevoEstado.toLowerCase()}.`,
        'success'
      );

    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire(
        '¡Error!',
        'No se pudo cambiar el estado. Inténtalo nuevamente.',
        'error'
      );
    }
  };


  const columns = [
    {
      header: "N°",
      accessorKey: "id_alimento",
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
      header: "DESCRIPCION",
      accessorKey: "descripcion",
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
      header: "COMPROBANTE",
      accessorKey: "imagen",
      enableSorting: false,
      cell: (info) => (
        <img
          src={`${RUTAJAVA}/uploads/${info.getValue()}`}
          alt="Comprobante"
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
      header: "ESTADO",
      accessorKey: "estado",
      enableSorting: false,
      cell: (info) => {
        const alimento = info.row.original;
        return (
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={alimento.estado === "ACTIVO"}
              onChange={() => handleToggleEstado(alimento.id_alimento, alimento.estado)}
            />
            <span className="slider"></span>
          </label>
        );
      }
    },

    {
      header: "ACCIÓN",
      enableSorting: false,
      cell: (info) => {
        const alimento = info.row.original;
        const isInactive = alimento.estado === "INACTIVO";

        return (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-warning btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#ModalEditarTablaAlimentos"
              onClick={() => setAlimentoSeleccionado(alimento)}
              disabled={isInactive}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(alimento.id_alimento)}
              disabled={isInactive}
            >
              Eliminar
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="container mt-0 mb-4 w-100">
      <div className="d-flex justify-content-between mb-2 w-100">
        <h2>Lista de Alimentos</h2>

      </div>
      <hr />
      <TablaGenerica
        data={alimentos}
        columns={columns}
        showSearch={true}
        showPagination={true}
        showtock={true}
        stockModalId="#modalPrincipalStock"
        onStock={() => document.activeElement.blur()}
        createModalId="#ModalCrearTablaAlimentos"
        onCreate={() => document.activeElement.blur()}
      />

      <ModalEditarTablaAlimentos
        alimento={alimentoSeleccionado}
        onUpdated={fetchAlimentos}
      />
      <ModalCrearTablaAlimentos onUpdated={fetchAlimentos} />
      <StockAlimentos onUpdated={fetchAlimentos} alimentos={alimentos} />
    </div>
  );
}
