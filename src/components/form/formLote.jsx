import { useState, useEffect } from "react";
import axios from "axios";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export function FormLote({ onSubmit, mostrarCancelar }) {
  const [form, setForm] = useState({
    nombre: "",
    cantidad: "",
    id_raza: "",
    imagen: null,
  });

  const [razas, setRazas] = useState([]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecciona una imagen valida");
        return;
      }
      setForm((prev) => ({ ...prev, imagen: file }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  useEffect(() => {
    const fetchRazas = async () => {
      try {
        const response = await axios.get(`${RUTAJAVA}/api/razaAnimales`);
        setRazas(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchRazas();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre del Lote</label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Lote Primavera 2024"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="cantidad" className="form-label">Cantidad</label>
            <input
              type="number"
              id="cantidad"
              className="form-control"
              value={form.cantidad}
              onChange={handleChange}
              placeholder="Número de animales"
              min="1"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="id_raza" className="form-label">Raza</label>
            <select
              className="form-select"
              id="id_raza"
              value={form.id_raza}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar raza</option>
              {razas.map((raza) => (
                <option key={raza.id_raza} value={raza.id_raza}>
                  {raza.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="imagen" className="form-label">Imagen del Lote</label>
            <input
              type="file"
              id="imagen"
              className="form-control"
              onChange={handleChange}
              accept="image/*"
            />
            <div className="form-text">Formatos permitidos: JPG, PNG, GIF</div>
          </div>

          {form.imagen && (
            <div className="mb-3">
              <label className="form-label">Vista previa:</label>
              <div className="text-center">
                <img
                  src={URL.createObjectURL(form.imagen)}
                  alt="Vista previa"
                  className="img-thumbnail"
                  style={{
                    maxWidth: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />
                <div className="mt-2">
                  <small className="text-muted">
                    {form.imagen.name} ({Math.round(form.imagen.size / 1024)} KB)
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="modal-footer">
        {mostrarCancelar && (
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            onClick={() => {
              document.activeElement?.blur();
            }}
          >
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </div>
    </form>
  )
}