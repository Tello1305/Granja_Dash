import FormularioAlimento from "./formAlimentos.jsx";
import axios from "axios";

export default function ModalAlimentos({ onUpdated, mostrarCancelar = true }) {
  const handleCrear = async (form) => {
    const data = new FormData();
    data.append("nombre", form.nombre);
    data.append("cantidad", form.cantidad);
    data.append("costo", form.costo);
    data.append("id_categoria", form.id_categoria);

    if (form.imagen) {
      data.append("imagen", form.imagen);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/alimentacion",
        data
      );
      if (onUpdated) onUpdated();
      console.log(response.data);
      alert("Alimento creado correctamente");

      
      const closeButton = document.querySelector(
        "#ModalCrearTablaAlimentos .btn-close"
      );
      if (closeButton) {
        closeButton.click(); // Dispara el evento de cerrar
      }
      if (document.activeElement) {
        document.activeElement.blur();
      }

    } catch (error) {
      console.log(error);
      alert("Error al crear el alimento");
    }
  };

  return (
    <div
      className="modal fade"
      id="ModalCrearTablaAlimentos"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Crear Alimento
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <FormularioAlimento onSubmit={handleCrear} mostrarCancelar={mostrarCancelar} />
          </div>
        </div>
      </div>
    </div>
  );
}
