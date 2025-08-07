import { useState, useEffect } from "react";
import axios from "axios";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function FormRaza({ onSubmit, mostrarCancelar }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    id_categoria: "",
  });
  const [categorias, setCategorias] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${RUTAJAVA}/api/CategoriaProductos`);
        setCategorias(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchCategorias();
  }, []);

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
        <label htmlFor="id_categoria">Categoria</label>
        <select
          className="form-control"
          id="id_categoria"
          value={form.id_categoria}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nombre}
            </option>
          ))}
        </select>
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
  );
}
