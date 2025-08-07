import { useState, useEffect } from "react";
import Swal from "sweetalert2";
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

  const handleCrear = (e) => {
    e.preventDefault();

    if (!form.id_alimento || !form.tipo || !form.cantidad) {
      Swal.fire({ icon: 'error', title: 'Campos incompletos', text: 'Debes completar Alimento, Tipo y Cantidad.' });
      return;
    }
    if (form.tipo === "ENTRADA" && !form.costo) {
      Swal.fire({ icon: 'error', title: 'Campo requerido', text: 'El costo es obligatorio en una entrada.' });
      return;
    }
    if (form.tipo === "SALIDA" && !form.id_raza) {
      Swal.fire({ icon: 'error', title: 'Campo requerido', text: 'Debes seleccionar una raza en la salida.' });
      return;
    }

    const actionText = form.tipo === 'ENTRADA' ? 'agregar' : 'quitar';
    const confirmationTitle = `¿Estás seguro de ${actionText} ${form.cantidad} unidades?`;

    Swal.fire({
      title: confirmationTitle,
      text: "¡Esta acción afectará el inventario!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, ¡${actionText}!`, 
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = {
          id_alimento: form.id_alimento,
          tipo: form.tipo,
          cantidad: parseInt(form.cantidad),
          costo: form.tipo === "ENTRADA" ? parseFloat(form.costo) : null,
          id_raza: form.tipo === "SALIDA" ? form.id_raza : null
        };

        try {
          await axios.post(`${RUTAJAVA}/api/stockAlimentos`, data, {
            headers: { Authorization: `Bearer ${auth.token}` },
          });

          if (onUpdated) onUpdated();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Éxito!',
            text: 'El stock ha sido actualizado correctamente.',
            showConfirmButton: false,
            timer: 1500
          });

          setForm({ id_alimento: "", tipo: "ENTRADA", cantidad: "", costo: "", id_raza: "" });

          const closeButton = document.querySelector("#modalStockCrearAlimentos .btn-close");
          if (closeButton) closeButton.click();
          if (document.activeElement) document.activeElement.blur();

        } catch (error) {
          console.error(error);
          Swal.fire('¡Error!', error.response?.data?.message || 'Error al actualizar el stock.', 'error');
        }
      }
    });
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