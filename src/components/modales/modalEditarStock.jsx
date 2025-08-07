import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../auth/authContext";
import Swal from "sweetalert2";
import FormStock from "../form/formStock";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalStockEditarAlimentos({ onUpdated, stockSeleccionado, alimentos }) {
  const { auth } = useAuth();
  const [formKey, setFormKey] = useState(0);

  const [stock, setStock] = useState({
    id_stockAlimento: "",
    id_alimento: "",
    tipo: "",
    id_raza: "",
    cantidad: "",
    costo: ""
  });

  useEffect(() => {
    if (stockSeleccionado) {
      setStock({
        id_stockAlimento: stockSeleccionado.id_stockAlimento || "",
        id_alimento: stockSeleccionado.id_alimento || "",
        tipo: stockSeleccionado.tipo || "",
        id_raza: stockSeleccionado.id_raza || "",
        cantidad: stockSeleccionado.cantidad || "",
        costo: stockSeleccionado.costo || ""
      });
    }
  }, [stockSeleccionado]);

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const field = id || name;  
    setStock((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    document.activeElement?.blur();

    const payload = {
      id_alimento: stock.id_alimento,
      id_raza: stock.id_raza || null,
      cantidad: parseInt(stock.cantidad),
      tipo: stock.tipo,
      costo: stock.costo === "" ? null : parseFloat(stock.costo)
    };

    try {
      const response = await axios.put(
        `${RUTAJAVA}/api/stockAlimentos/${stock.id_stockAlimento}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.log(response.data);

      if (onUpdated) onUpdated();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Stock actualizado con éxito',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error al editar stock:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: error.response?.data?.message || 'Hubo un problema al editar el stock.'
      });
    }

    const closeButton = document.querySelector("#modalStockEditarAlimentos .btn-close");
    if (closeButton) closeButton.click();
    if (document.activeElement) document.activeElement.blur();
    setFormKey((prevKey) => prevKey + 1); 
  };

  return (
    <div
      className="modal fade"
      id="modalStockEditarAlimentos"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Editar Stock
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
              onSubmit={handleEditar}
              mostrarCancelar={true}
              key={formKey}
              handleChange={handleChange}
              form={stock}
              alimentos={alimentos}
              modo="editar"        // Modo Edición
            />
          </div>
        </div>
      </div>
    </div>
  );
}
