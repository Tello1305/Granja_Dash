import { useState, useEffect } from 'react';
import axios from 'axios';

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

// Recibe el estado 'form' y el manejador 'handleChange' desde las props
export default function FormCalendario({ form, handleChange, onSubmit }) {
  const [lotes, setLotes] = useState([]);

  // La carga de lotes no cambia, sigue siendo responsabilidad del formulario
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axios.get(`${RUTAJAVA}/api/lotesDeAnimales`);
        console.log(response.data);
        setLotes(response.data);
      } catch (error) {
        console.error("Error al obtener los lotes:", error);
      }
    };
    fetchLotes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); // Simplemente notifica al padre que se envió el formulario
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="titulo" className="form-label">Título</label>
        <input
          type="text"
          name="titulo"
          className="form-control"
          value={form.titulo} 
          onChange={handleChange} 
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">Descripción</label>
        <textarea
          name="descripcion"
          className="form-control"
          value={form.descripcion} 
          onChange={handleChange} 
          required
        ></textarea>
      </div>
      {/* ... Repetir para los otros campos (descripcion, id_lote) ... */}
      <div className="mb-3">
        <label htmlFor="id_lote" className="form-label">Lote de Animales</label>
        <select
          name="id_lote"
          className="form-select"
          value={form.id_lote} // El valor viene de las props
          onChange={handleChange}
          required
        >
          <option value="">-- Seleccione un Lote --</option>
          {lotes.map((lote) => (
            <option key={lote.id_lote} value={lote.id_lote}>
              {lote.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
}