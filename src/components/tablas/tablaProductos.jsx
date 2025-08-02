import TablaGenerica from "../TablaGenerica";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../../auth/authContext';
import '../../assets/css/ToggleSwitch.css';
import { ModalCrearProducto } from "../modales/modalCrearProducto.jsx";
import { ModalEditarProducto } from "../modales/modalEditarProducto.jsx";
import StockProductos from "../tablaModales/StockProductos"

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function TablaProductos() {

    const [productos, setProductos] = useState([]);
    const { auth } = useAuth();
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const fetchProductos = async () => {

        try {
            const response = await axios.get(`${RUTAJAVA}/api/productoAnimales`)
            console.log(response.data)
            setProductos(response.data)
        } catch (error) {
            console.error("Error al obtener los datos:", error)
        }
    }
    useEffect(() => {

        fetchProductos();
    }, []);


    const handleDelete = async (id_producto) => {
        try {
            await axios.delete(`${RUTAJAVA}/api/productoAnimales/${id_producto}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            console.log("Producto eliminado correctamente: ", id_producto);
            setProductos(prev => prev.filter(p => p.id_producto !== id_producto));

        } catch (error) {

            console.error("Error al eliminar:", error);
            if (error.response && error.response.status === 400 && error.response.data.includes("historial de stock")) {
                if (confirm("Este producto tiene historial de stock y no puede ser eliminado. ¿Deseas inactivarlo en su lugar?")) {
                    handleToggleEstado(id_producto, "ACTIVO");
                }
            } else {
                alert("No se pudo eliminar el producto. Intente nuevamente.");
            }
        }
    };

    const handleToggleEstado = async (id_producto, estadoActual) => {
        const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";
        try {
            await axios.put(`${RUTAJAVA}/api/productoAnimales/${id_producto}/estado`,
                { estado: nuevoEstado },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }
            );
            setProductos(productos.map(p =>
                p.id_producto === id_producto ? { ...p, estado: nuevoEstado } : p
            ));
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            alert("No se pudo cambiar el estado. Inténtalo nuevamente.");
        }
    };

    const columns = [
        {
            header: "N°",
            accessorKey: "id_producto",
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
            header: "CANTIDAD",
            accessorKey: "cantidad",
            enableSorting: true
        },
        {
            header: "RAZA",
            accessorKey: "nombreRaza",
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
            header: "ESTADO",
            accessorKey: "estado",
            cell: (info) => {
                const producto = info.row.original;
                return (
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={producto.estado === "ACTIVO"}
                            onChange={() => handleToggleEstado(producto.id_producto, producto.estado)}
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
                const producto = info.row.original;
                const isInactive = producto.estado === "INACTIVO";
                return (
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-warning btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#modalEditarProducto"
                            onClick={() => setProductoSeleccionado(producto)}
                            disabled={isInactive}
                        >
                            Editar
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(producto.id_producto)}
                            disabled={isInactive}
                        >
                            Eliminar
                        </button>
                    </div>
                );
            }
        }
    ]

    return (
        <div className="container mt-0 mb-4 w-100">
            <div className="d-flex justify-content-between mb-2">
                <h2>Lista de Productos</h2>

            </div>
            <hr />
            <TablaGenerica
                data={productos}
                columns={columns}
                showSearch={true}
                showPagination={true}
                showtock={true}
                stockModalId="#modalPrincipalStock"
                onStock={() => document.activeElement.blur()}
                createModalId="#modalCrearProducto"
                onCreate={() => document.activeElement.blur()}
            />

            <ModalEditarProducto onUpdated={fetchProductos} producto={productoSeleccionado} />
            <ModalCrearProducto onUpdated={fetchProductos} />
            <StockProductos onUpdated={fetchProductos} productos={productos} />
        </div>
    );
}