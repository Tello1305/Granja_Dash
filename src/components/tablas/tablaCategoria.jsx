import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import TablaGenerica from "../TablaGenerica";
import ModalEditarCategoria from "../modales/modalEditarCategoria";
import ModalCrearCategoria from "../modales/modalCrearCategoria";
import { useAuth } from "../../auth/authContext.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function TablaCategoria({ categoriasData, onDataUpdate }) {
    const { auth } = useAuth();
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);



    const handleDelete = (id_categoria) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡bórrala!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${RUTAJAVA}/api/CategoriaProductos/${id_categoria}`, {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    onDataUpdate();
                    Swal.fire(
                        '¡Eliminada!',
                        'La categoría ha sido eliminada.',
                        'success'
                    );
                } catch (error) {
                    console.error("Error al eliminar:", error);
                    Swal.fire(
                        '¡Error!',
                        'No se pudo eliminar la categoría. Intente nuevamente.',
                        'error'
                    );
                }
            }
        });
    };

    const columns = [
        {
            header: "N°",
            accessorKey: "id_categoria",
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
            header: "DESCRIPCION",
            accessorKey: "descripcion",
            enableSorting: true
        },
        {
            header: "DISPOSICIÓN",
            accessorKey: "enUso",
            enableSorting: true,
            cell: (info) => (
                <span className={`badge ${info.row.original.enUso ? 'bg-warning text-white' : 'bg-success'}`}>
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
                        onClick={() => handleDelete(info.row.original.id_categoria)}
                        disabled={info.row.original.enUso}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#ModalEditarTablaCategoria"
                        onClick={() => setCategoriaSeleccionada(info.row.original)}
                    >
                        <i className="bi bi-pencil-square text-gray"></i>
                    </button>
                </div>
            )
        }
    ];

    return (
        <section>
            <TablaGenerica
                data={categoriasData}
                columns={columns}
                showSearch={true}
                showPagination={true}
                itemsPerPage={10}
                createModalId="#ModalCrearTablaCategoria"
                onCreate={() => document.activeElement.blur()}
            />
            <ModalEditarCategoria categoria={categoriaSeleccionada} onUpdated={onDataUpdate} />
            <ModalCrearCategoria onUpdated={onDataUpdate} />
        </section>
    )
}