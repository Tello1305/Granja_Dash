import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../auth/authContext";
import FormStockProductos from "../form/formStockProductos";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalStockEditarProducto({ onUpdated, stockSeleccionado, productos }) {
  const { auth } = useAuth();
  const [formKey, setFormKey] = useState(0);

  const [stock, setStock] = useState({
    id_stock: "",
    id_producto: "",
    tipo: "",
    cantidad: "",
  });

  useEffect(() => {
    if (stockSeleccionado) {
      setStock({
        id_stock: stockSeleccionado.id_stock || "",
        id_producto: stockSeleccionado.id_producto || "",
        tipo: stockSeleccionado.tipo || "",
        cantidad: stockSeleccionado.cantidad || ""
      });
    }
  }, [stockSeleccionado]);

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const field = id || name;  // Para inputs tipo radio (name="tipo") y otros
    setStock((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    document.activeElement?.blur();

    const payload = {
      id_producto: stock.id_producto,
      cantidad: parseInt(stock.cantidad),
      tipo: stock.tipo,
    };

    try {
      const response = await axios.put(`${RUTAJAVA}/api/stockProductos/${stock.id_stock}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.log(response.data);

      if (onUpdated) onUpdated();
      alert("Stock editado correctamente");
    } catch (error) {
      console.error("Error al editar stock:", error);
      alert("Error al editar el stock");
    }

    const closeButton = document.querySelector("#modalStockEditarProducto .btn-close");
    if (closeButton) closeButton.click();
    if (document.activeElement) document.activeElement.blur();
    setFormKey((prevKey) => prevKey + 1);  // Resetear formulario (si es necesario)
  };

  return (
    <div
      className="modal fade"
      id="modalStockEditarProducto"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Editar Stock Producto
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
              onSubmit={handleEditar}
              mostrarCancelar={true}
              key={formKey}
              handleChange={handleChange}
              form={stock}
              productos={productos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
