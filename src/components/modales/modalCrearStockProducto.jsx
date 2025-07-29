import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../auth/authContext.jsx";
import FormStockProductos from "../form/formStockProductos.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalStockCrearProducto({ onUpdated, productos }) {
  const [form, setForm] = useState({
    id_producto: "",
    tipo: "ENTRADA",
    cantidad: "",
    
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
    if (!form.id_producto || !form.tipo || !form.cantidad) {
      alert("Debes completar Producto, Tipo y Cantidad");
      return;
    }

    // ARMAR JSON según el tipo
    const data = {
      id_producto: form.id_producto,
      tipo: form.tipo,
      cantidad: parseInt(form.cantidad),
    };

    try {
      const response = await axios.post(`${RUTAJAVA}/api/stockProductos`, data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (onUpdated) onUpdated();

      alert("Stock creado correctamente");
      console.log(response.data);

      // Limpiar formulario
      setForm({
        id_producto: "",
        tipo: "ENTRADA",
        cantidad: "",
      });

    } catch (error) {
      console.error(error);
      alert("Error al crear el stock");
    }

    const closeButton = document.querySelector(
      "#modalStockCrearProducto .btn-close"
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
      id="modalStockCrearProducto"
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
            <FormStockProductos
              onSubmit={handleCrear}
              mostrarCancelar={true}
              form={form}
              handleChange={handleChange}
              disabled={false}
              productos={productos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}