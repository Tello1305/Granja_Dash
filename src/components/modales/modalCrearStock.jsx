import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../auth/authContext.jsx";
import FormStock from "../form/formStock.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalStockCrearAlimentos({ onUpdated, onUpdateStock, alimentos }) {
  const [form, setForm] = useState({
    id_alimento: "",
    tipo: "ENTRADA",
    cantidad: "",
    costo: "",
    id_raza: ""
  });

  const { auth } = useAuth();

  const handleChange = (e) => {
    const { name, value, id } = e.target;
    const key = name === 'tipo' ? 'tipo' : id;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCrear = async (e) => {
    e.preventDefault();

    // VALIDACIONES FRONTEND
    if (!form.id_alimento || !form.tipo || !form.cantidad) {
      alert("Debes completar Alimento, Tipo y Cantidad");
      return;
    }

    if (form.tipo === "ENTRADA" && !form.costo) {
      alert("El costo es obligatorio en una entrada.");
      return;
    }

    if (form.tipo === "SALIDA" && !form.id_raza) {
      alert("Debes seleccionar una raza en la salida.");
      return;
    }

    // ARMAR JSON según el tipo
    const data = {
      id_alimento: form.id_alimento,
      tipo: form.tipo,
      cantidad: parseInt(form.cantidad),
      costo: form.tipo === "ENTRADA" ? parseFloat(form.costo) : null,
      id_raza: form.tipo === "SALIDA" ? form.id_raza : null
    };

    try {
      const response = await axios.post(`${RUTAJAVA}/api/stockAlimentos`, data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (onUpdated) onUpdated();

      alert("Stock creado correctamente");
      console.log(response.data);

      // Limpiar formulario
      setForm({
        id_alimento: "",
        tipo: "ENTRADA",
        cantidad: "",
        costo: "",
        id_raza: ""
      });

    } catch (error) {
      console.error(error);
      alert("Error al crear el stock");
    }

    const closeButton = document.querySelector(
      "#modalStockCrearAlimentos .btn-close"
    );
    if (closeButton) {
      closeButton.click();
    }
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div
      className="modal fade"
      id="modalStockCrearAlimentos"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Crear Stock
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <FormStock
              onSubmit={handleCrear}
              mostrarCancelar={true}
              form={form}
              handleChange={handleChange}
              disabled={false}
              alimentos={alimentos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}