
export function FormUsuario({form, handleChange, onSubmit, mostrarCancelar}) {

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label" htmlFor="nombre">
            Nombre
          </label>
          <input
            className="form-control"
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label" htmlFor="usuario">
            Usuario
          </label>
          <input
            className="form-control"
            type="text"
            id="usuario"
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label" htmlFor="password">
            Clave
          </label>
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label" htmlFor="id_rol">
            Rol
          </label>
          <select
            className="form-select"
            id="id_rol"
            name="id_rol"
            value={form.id_rol}
            onChange={handleChange}
            required
          >
            <option value="">--Seleccionar--</option>
            <option value="1">Administrador</option>
            <option value="2">Empleado</option>
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
    </>
  );
}
