import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../auth/authContext';
import FormCalendario from "../form/formCalendario";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function ModalEditarCalendario({ slotInfo, eventoSeleccionado, onCitaGuardada }) {
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
    const modalId = `#${esEdicion ? 'ModalEditarCita' : 'ModalCrearCita'}`;
    const closeButton = document.querySelector(`${modalId} .btn-close`);
    if (closeButton) {
      closeButton.click();
    }
  };

  const handleSubmit = async () => {
    const datosBase = esEdicion ? eventoSeleccionado : slotInfo;
    if (!datosBase || !datosBase.start) {
      alert("Error: No hay una fecha válida para guardar.");
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
        alert("Cita creada correctamente");
      }
      onCitaGuardada();
      closeModal();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar la cita.");
    }
  };

  const handleDelete = async () => {
    if (!esEdicion || !window.confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      return;
    }
    try {
      await axios.delete(`${RUTAJAVA}/api/citasAnimales/${eventoSeleccionado.id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      alert("Cita eliminada correctamente");
      onCitaGuardada();
      closeModal();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar la cita.");
    }
  };

  return (
    <div className="modal fade" id={esEdicion ? 'ModalEditarCita' : 'ModalCrearCita'} tabIndex="-1">
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