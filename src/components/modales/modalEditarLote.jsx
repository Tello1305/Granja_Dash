

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../auth/authContext.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalEditarLote({ lote, onUpdated }) {
    const [preview, setPreview] = useState(null);
    const [razas, setRazas] = useState([]);
    const { auth } = useAuth();

    const [form, setForm] = useState({
        nombre: "",
        cantidad: "",
        id_raza: "",
        imagen: null,
    });

    // --- NUEVOS ESTADOS PARA LA LÓGICA DE CANTIDAD ---
    const [cantidadBase, setCantidadBase] = useState(0);
    const [sumar, setSumar] = useState("");
    const [restar, setRestar] = useState("");

    // --- LÓGICA DE INICIALIZACIÓN ---
    useEffect(() => {
        if (lote) {
            setForm({
                nombre: lote.nombre || "",
                cantidad: lote.cantidad || "",
                id_raza: lote.id_raza || "",
                imagen: null, // La imagen se maneja por separado
            });
            // Establece la cantidad original del lote que se está editando
            setCantidadBase(lote.cantidad || 0);
            // Muestra la imagen existente
            setPreview(`${RUTAJAVA}/uploads/${lote.imagen}`);
            // Resetea los campos de ajuste cada vez que se abre el modal
            setSumar("");
            setRestar("");
        }
    }, [lote]);

    // --- LÓGICA DE CÁLCULO AUTOMÁTICO ---
    useEffect(() => {
        const valorSumar = Number(sumar) || 0;
        const valorRestar = Number(restar) || 0;
        const nuevoTotal = cantidadBase + valorSumar - valorRestar;

        // Actualiza el campo 'cantidad' en el estado principal del formulario
        setForm((prev) => ({ ...prev, cantidad: nuevoTotal }));
    }, [sumar, restar, cantidadBase]);

    const handleChange = (e) => {
        const { id, value, files } = e.target;
        if (id === "imagen" && files && files.length > 0) {
            const imagenFile = files[0];
            setForm((prev) => ({ ...prev, imagen: imagenFile }));
            setPreview(URL.createObjectURL(imagenFile));
        } else {
            setForm((prev) => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        document.activeElement?.blur();

        const data = new FormData();
        data.append("nombre", form.nombre);
        data.append("cantidad", form.cantidad); // Ya tiene el valor final calculado
        data.append("id_raza", form.id_raza);
        if (form.imagen) {
            data.append("imagen", form.imagen);
        }

        try {
            const response = await axios.put(`${RUTAJAVA}/api/lotesDeAnimales/${lote.id_lote}`, data, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });

            if (onUpdated) onUpdated();

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Lote actualizado con éxito',
                showConfirmButton: false,
                timer: 1500
            });

            const closeButton = document.querySelector("#ModalEditarTablaLote .btn-close");
            if (closeButton) closeButton.click();
        } catch (error) {
            console.error("Error al actualizar:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: `Ocurrió un error: ${error?.response?.data?.message || error.message}`
            });
        }
    };

    useEffect(() => {
        const fetchRazas = async () => {
            try {
                const response = await axios.get(`${RUTAJAVA}/api/razaAnimales`);
                setRazas(response.data);
            } catch (error) {
                console.error("Error al obtener las razas:", error);
            }
        };
        fetchRazas();
    }, []);

    return (
        <div className="modal fade" id="ModalEditarTablaLote" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Editar Lote</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body row gx-5">
                            <div className="col-md-6">
                                {/* Campo Nombre */}
                                <div className="mb-3">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input type="text" className="form-control" id="nombre" value={form.nombre} onChange={handleChange} required />
                                </div>
                                {/* Campo Raza */}
                                <div className="mb-3">
                                    <label htmlFor="id_raza">Raza</label>
                                    <select className="form-control" id="id_raza" value={form.id_raza} onChange={handleChange} required>
                                        <option value="">Seleccionar</option>
                                        {razas.map((raza) => (
                                            <option key={raza.id_raza} value={raza.id_raza}>{raza.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Campo Cantidad */}
                                <div className="mb-3">
                                    <label>Cantidad</label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="sumar"
                                            value={sumar}
                                            onChange={(e) => { setSumar(e.target.value); if (Number(e.target.value) > 0) setRestar(""); }}
                                            min="0"
                                            placeholder="Añadir (+)"
                                        />
                                        <span className="input-group-text">+</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="restar"
                                            value={restar}
                                            onChange={(e) => { setRestar(e.target.value); if (Number(e.target.value) > 0) setSumar(""); }}
                                            min="0"
                                            max={cantidadBase}
                                            placeholder="Quitar (-)"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 text-center">
                                {/* Campo Imagen y Vista Previa */}
                                <label htmlFor="imagen">Cambiar Imagen</label>
                                <input type="file" id="imagen" className="form-control" onChange={handleChange} />
                                {preview && (
                                    <div className="mt-3">
                                        <img src={preview} alt="Vista previa" style={{ width: "300px", height: "200px", objectFit: "cover" }} className="img-fluid rounded" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" className="btn btn-primary">Guardar cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}