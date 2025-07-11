import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Mantén esta línea si Bootstrap está funcionando en otros lugares

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalEditarTablaAlimentos({ alimento, onUpdated }) {
  const [form, setForm] = useState({
    nombre: "",
    cantidad: "",
    costo: "",
    id_categoria: "",
    imagen: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (alimento) {
      setForm({
        nombre: alimento.nombre || "",
        cantidad: alimento.cantidad || "",
        costo: alimento.costo || "",
        id_categoria: alimento.id_categoria || "",
        imagen: alimento.image,
      });
      setPreview(`${RUTAJAVA}/uploads/${alimento.image}`);
    }
  }, [alimento]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files && files.length > 0) {
      const imagen = files[0];
      setForm((prev) => ({ ...prev, imagen }));
      setPreview(URL.createObjectURL(imagen));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    document.activeElement?.blur();

    const data = new FormData();
    console.log(alimento.id);
    data.append("nombre", form.nombre);
    data.append("cantidad", form.cantidad);
    data.append("costo", form.costo);
    data.append("id_categoria", form.id_categoria);
    if (form.imagen) {
      data.append("imagen", form.imagen);
    }

    try {
      const response = await axios.put(`${RUTAJAVA}/api/alimentacion/${alimento.id}`,data);
      console.log(response.data);
      if (onUpdated) onUpdated();

      // Cerrar el modal simulando un clic en el botón de cerrar
      const closeButton = document.querySelector(
        "#ModalEditarTablaAlimentos .btn-close"
      );
      if (closeButton) {
        closeButton.click(); // Dispara el evento de cerrar
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert(
        `Ocurrió un error al actualizar:\n${
          error?.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div
      className="modal fade"
      id="ModalEditarTablaAlimentos"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Editar Alimento
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
                <label htmlFor="cantidad">Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  id="cantidad"
                  value={form.cantidad}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="costo">Costo</label>
                <input
                  type="number"
                  className="form-control"
                  id="costo"
                  value={form.costo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="id_categoria">Categoría</label>
                <select
                  id="id_categoria"
                  className="form-select"
                  value={form.id_categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="1">Carne</option>
                  <option value="2">Maíz</option>
                  {/* Agrega más si es necesario */}
                </select>
              </div>
              <div className="mb-2">
                <label htmlFor="imagen">Nueva imagen (opcional)</label>
                <input
                  type="file"
                  className="form-control"
                  id="imagen"
                  onChange={handleChange}
                />
              </div>
              {preview ? (
                <img
                  src={preview}
                  alt="Vista previa"
                  className="img-fluid mt-2"
                  style={{ maxHeight: "200px" }}
                />
              ) : alimento?.imagen_url ? (
                <img
                  src={`http://localhost:8000/uploads/${alimento.image}`}
                  alt="Imagen actual"
                  className="img-fluid mt-2"
                  style={{ maxHeight: "200px" }}
                />
              ) : null}
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
          </form>
        </div>
      </div>
    </div>
  );
}
