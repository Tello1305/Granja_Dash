import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../auth/authContext.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalEditarRaza({raza, onUpdated}) {

    const [categoria, setCategoria] = useState([]);
    const { auth } = useAuth();

    const [form, setForm] = useState({
        nombre: "",
        id_categoria: "",
        id_raza: "",
    });

    useEffect(() => {
        if (raza) {
          setForm({
            nombre: raza.nombre || "",
            id_categoria: raza.id_categoria || "",
            id_raza: raza.id_raza || "",
          });
        }
      }, [raza]);

      const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    }; 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        document.activeElement?.blur();

        try{

            const response = await axios.put(`${RUTAJAVA}/api/razaAnimales/${raza.id_raza}`,
                {
                    nombre: form.nombre,
                    id_categoria: form.id_categoria,
                },
                {
                    headers: { 
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );
            console.log(response.data);
            if (onUpdated) onUpdated();

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Raza actualizada con éxito',
                showConfirmButton: false,
                timer: 1500
            });

            // Cerrar el modal simulando un clic en el botón de cerrar
            const closeButton = document.querySelector(
              "#ModalEditarRaza .btn-close"
            );
            if (closeButton) {
              closeButton.click(); // Dispara el evento de cerrar
            }
          } catch (error) {
            console.error("Error al actualizar:", error);
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar',
              text: `Ocurrió un error al actualizar: ${error?.response?.data?.message || error.message}`,
            });
          }
        
    }

    useEffect (() => {

        const fetchCategorias = async () => {
            try{
                const response = await axios.get(`${RUTAJAVA}/api/CategoriaProductos`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                setCategoria(response.data);
                console.log(response.data);
            }catch (error){
                console.error("Error al obtener los datos:", error);
            }
        }
        fetchCategorias();
    }, [])

    return (
        <div
            className="modal fade"
            id="ModalEditarRaza"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Editar Raza
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <div className="mb-2">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="mb-2">
                                <label htmlFor="id_categoria">Categoria</label>
                                <select
                                    className="form-control"
                                    id="id_categoria"
                                    value={form.id_categoria}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar categoria</option>
                                    {
                                        categoria.map((categoria) => (
                                            <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                                {categoria.nombre}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>


                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => document.activeElement.blur()}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar cambios
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}