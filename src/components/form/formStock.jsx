import axios from "axios";
import { useEffect, useState } from "react";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function FormStock({ form, handleChange, onSubmit, mostrarCancelar, modo = "crear", disabled = false, alimentos = [] }) {
  const [razas, setRazas] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ALIMENTO */}
      <div className="mb-2">
        <label htmlFor="id_alimento">Alimento</label>
        <select
          className="form-select"
          id="id_alimento"
          value={form.id_alimento}
          onChange={handleChange}
          required
          disabled={modo === "editar"}  // Solo seleccionable en crear
        >
          <option value="">--Seleccionar--</option>
          {alimentos.map((alimento) => (
            <option key={alimento.id_alimento} value={alimento.id_alimento}>
              {alimento.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* TIPO DE MOVIMIENTO */}
      {modo === "crear" && (
        <div className="mb-2">
          <label>Tipo de Movimiento</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="tipo"
              id="entrada"
              value="ENTRADA"
              checked={form.tipo === "ENTRADA"}
              onChange={handleChange}
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor="entrada">
              Entrada
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="tipo"
              id="salida"
              value="SALIDA"
              checked={form.tipo === "SALIDA"}
              onChange={handleChange}
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor="salida">
              Salida
            </label>
          </div>
        </div>
      )}

      {/* CANTIDAD */}
      <div className="mb-2">
        <label htmlFor="cantidad">Cantidad</label>
        <input
          type="number"
          className="form-control"
          id="cantidad"
          value={form.cantidad}
          onChange={handleChange}
          required
          disabled={modo === 'editar' ? false : disabled}
        />
      </div>

      {/* COSTO - Solo visible si es ENTRADA */}
      {form.tipo === "ENTRADA" && (
        <div className="mb-2">
          <label htmlFor="costo">Costo</label>
          <input
            type="number"
            className="form-control"
            id="costo"
            value={form.costo}
            onChange={handleChange}
            required
            disabled={modo === 'editar' ? form.tipo !== 'ENTRADA' : disabled}
          />
        </div>
      )}

      {/* RAZA - Solo visible si es SALIDA */}
      {form.tipo === "SALIDA" && (
        <div className="mb-2">
          <label htmlFor="id_raza">Raza</label>
          <select
            className="form-select"
            id="id_raza"
            value={form.id_raza}
            onChange={handleChange}
            required
            disabled={modo === 'editar' ? form.tipo !== 'SALIDA' : disabled}
          >
            <option value="">--Seleccionar--</option>
            {razas.map((raza) => (
              <option key={raza.id_raza} value={raza.id_raza}>
                {raza.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* BOTONES */}
      <div className="modal-footer">
        {mostrarCancelar && (
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
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
