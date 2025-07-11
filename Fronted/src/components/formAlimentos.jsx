import { useState } from "react";
import "../assets/css/formCompra.css";


export default function FormularioAlimento({ onSubmit, mostrarCancelar }) {
  const [form, setForm] = useState({
    nombre: "",
    cantidad: "",
    costo: "",
    id_categoria: "",
    imagen: null,
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecciona una imagen válida");
        return;
      }

      setForm((prev) => ({ ...prev, imagen: file }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          className="form-control"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label htmlFor="cantidad">Cantidad</label>
        <input
          type="number"
          id="cantidad"
          className="form-control"
          value={form.cantidad}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label htmlFor="costo">Costo</label>
        <input
          type="number"
          id="costo"
          className="form-control"
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
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="imagen">Imagen</label>
        <input
          type="file"
          id="imagen"
          className="form-control"
          onChange={handleChange}
        />
      </div>

      {form.imagen && (
        <div className="mb-1 ">
          <label className="form-label">Vista previa:</label>
          <div>
            <img
              src={URL.createObjectURL(form.imagen)}
              alt="Vista previa"
              style={{
                maxWidth: "200px",
                height: "200px",
              }}
            />
          </div>
        </div>
      )}

      {/* Botones del footer (tú puedes moverlos o personalizarlos) */}
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
  );
}
