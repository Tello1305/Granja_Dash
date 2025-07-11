import React, { useState, useEffect } from "react";
import axios from "axios";
import TablaGenerica from "./TablaGenerica";
import ModalEditarTablaAlimentos from "./modalEditarTablaAlimentos";
import ModalCrearTablaAlimentos from "./modalCrearTablaAlimentos";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function AlimentacionList() {
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
  const [alimentos, setAlimentos] = useState([]);

  const fetchAlimentos = async () => {
    try {
      const response = await axios.get(`${RUTAJAVA}/api/alimentacion`);
      setAlimentos(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchAlimentos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este alimento?")) {
      try {
        await axios.delete(`${RUTAJAVA}/api/alimentacion/${id}`);
        setAlimentos(prev => prev.filter(alimento => alimento.id !== id));
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar el alimento. Intente nuevamente.");
      }
    }
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
      header: "COSTO",
      accessorKey: "costo",
      enableSorting: true,
      cell: (info) => `S/ ${parseFloat(info.getValue()).toFixed(2)}`
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
      header: "CATEGORÍA",
      accessorKey: "categoriaNombre",
      enableSorting: true
    },
    {
      header: "COMPROBANTE",
      accessorKey: "image",
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
      header: "ACCIÓN",
      enableSorting: false,
      cell: (info) => (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(info.row.original.id)}

          >
            Eliminar
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#ModalEditarTablaAlimentos"
            onClick={() => setAlimentoSeleccionado(info.row.original)}
          >
            Editar
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="container mt-4 mb-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Lista de Alimentos</h2>
        <div>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#ModalCrearTablaAlimentos"
            onClick={() => document.activeElement.blur()}
          >
            <i className="bi bi-plus-lg me-2"></i>Nuevo Alimento
          </button>
        </div>
      </div>

      <TablaGenerica
        data={alimentos}
        columns={columns}
        showSearch={true}
        showPagination={true}
        itemsPerPage={10}
      />

      <ModalEditarTablaAlimentos
        alimento={alimentoSeleccionado}
        onUpdated={fetchAlimentos}
      />
      <ModalCrearTablaAlimentos onUpdated={fetchAlimentos} />
    </div>
  );
}
