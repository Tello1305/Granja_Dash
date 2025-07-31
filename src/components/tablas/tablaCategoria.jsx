import { useEffect, useState } from "react";        
import axios from "axios";  
import TablaGenerica from "../TablaGenerica";
import ModalEditarCategoria from "../modales/modalEditarCategoria";
import ModalCrearCategoria from "../modales/modalCrearCategoria";
import { useAuth } from "../../auth/authContext.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function TablaCategoria({ categoriasData, onDataUpdate }) {
    const { auth } = useAuth();
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    console.log('categoriasDataaaaas', categoriasData)

    const handleDelete = async (id_categoria) => {
        
            try {
                const response = await axios.delete(`${RUTAJAVA}/api/CategoriaProductos/${id_categoria}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    }
                );
                onDataUpdate();
                console.log(response.data);
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("No se pudo eliminar la categoria. Intente nuevamente.");
            }
        
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
                        className="btn btn-danger btn-sm "
                        onClick={() => handleDelete(info.row.original.id_categoria)}
                        disabled={info.row.original.enUso}
                    >
                        Eliminar
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#ModalEditarTablaCategoria"
                        onClick={() => setCategoriaSeleccionada(info.row.original)}
                    >
                        Editar
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