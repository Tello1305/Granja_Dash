import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
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
      Swal.fire("Error", "No hay una fecha válida para guardar.", "error");
      return;
    }

    const datosCalendario = {
      ...form,
      start: datosBase.start.toISOString(),
      end: datosBase.end.toISOString(),
      id_lote: parseInt(form.id_lote, 10),
    };

    try {
      if (esEdicion) {
        await axios.put(`${RUTAJAVA}/api/citasAnimales/${form.id}`, datosCalendario, { headers: { Authorization: `Bearer ${auth.token}` } });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Actualizada!',
          text: 'La cita ha sido actualizada correctamente.',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        await axios.post(`${RUTAJAVA}/api/citasAnimales`, datosCalendario, { headers: { Authorization: `Bearer ${auth.token}` } });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Creada!',
          text: 'La cita ha sido creada correctamente.',
          showConfirmButton: false,
          timer: 1500
        });
      }
      onCitaGuardada();
      closeModal();
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire("¡Error!", "Error al guardar la cita.", "error");
    }
  };

  const handleDelete = () => {
    if (!esEdicion) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡bórrala!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
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
    });
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