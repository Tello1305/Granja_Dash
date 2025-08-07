import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '../../auth/authContext';
import FormCalendario from "../form/formCalendario";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalCita({ slotInfo, eventoSeleccionado, onCitaGuardada }) {
  const { auth } = useAuth();
  const [form, setForm] = useState({ id: null, titulo: "", descripcion: "", id_lote: "" });

  const esEdicion = !!eventoSeleccionado;

  useEffect(() => {
    if (esEdicion) {
      setForm({
        id: eventoSeleccionado.id,
        titulo: eventoSeleccionado.title || '',
        descripcion: eventoSeleccionado.description || '',
        id_lote: eventoSeleccionado.idLote || ''
      });
    } else {
      setForm({ id: null, titulo: "", descripcion: "", id_lote: "" });
    }
  }, [eventoSeleccionado, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    const closeButton = document.querySelector("#ModalCita .btn-close");
    if (closeButton) {
      closeButton.click();
    }
  };

  const handleSubmit = async () => {
    const datosBase = esEdicion ? eventoSeleccionado : slotInfo;
    if (!form.titulo || !form.id_lote) {
      alert("El título y el lote son obligatorios");
      return;
    }

    const datosParaEnviar = {
      ...form,
      start: datosBase.start.toISOString(),
      end: datosBase.end.toISOString(),
      id_lote: parseInt(form.id_lote, 10),
    };

    try {
      if (esEdicion) {
        await axios.put(`${RUTAJAVA}/api/citasAnimales/${form.id}`, datosParaEnviar, { headers: { Authorization: `Bearer ${auth.token}` } });
        alert("Cita actualizada correctamente");
      } else {
        await axios.post(`${RUTAJAVA}/api/citasAnimales`, datosParaEnviar, { headers: { Authorization: `Bearer ${auth.token}` } });
        alert("Cita guardada correctamente");
      }
      onCitaGuardada();
      closeModal();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("No se pudo guardar la cita.");
    }
  };

  const handleDelete = async () => {
    if (!esEdicion) return;

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡bórrala!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${RUTAJAVA}/api/citasAnimales/${eventoSeleccionado.id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        Swal.fire(
          '¡Eliminada!',
          'La cita ha sido eliminada.',
          'success'
        );
        onCitaGuardada();
        closeModal();
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire(
          '¡Error!',
          'No se pudo eliminar la cita.',
          'error'
        );
      }
    }
  };

  return (
    <div className="modal fade" id="ModalCita" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{esEdicion ? 'Editar Cita' : 'Crear Nueva Cita'}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <FormCalendario
              form={form}
              handleChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={closeModal}
            />
          </div>
          {esEdicion && (
            <div className="modal-footer justify-content-start">
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Eliminar Cita
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}