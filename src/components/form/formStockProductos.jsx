

export default function FormStockProductos({ form, handleChange, onSubmit, mostrarCancelar, productos = [] }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <div className="mb-2">
        <label htmlFor="id_producto">Producto</label>
        <select
          className="form-select"
          id="id_producto"
          value={form.id_producto}
          onChange={handleChange}
          required
        >
          <option value="">--Seleccionar--</option>
          {productos.map((producto) => (
            <option key={producto.id_producto} value={producto.id_producto}>
              {producto.nombre}
            </option>
          ))}
        </select>
      </div>

      
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
            />
            <label className="form-check-label" htmlFor="salida">
              Salida
            </label>
          </div>
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
          Guardar
        </button>
      </div>
    </form>
  );
}
