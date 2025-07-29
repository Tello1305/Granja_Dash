import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../auth/authContext';
import FormCalendario from "../form/formCalendario";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

// Recibe 'eventoSeleccionado' para saber si estamos editando
export default function ModalCita({ slotInfo, eventoSeleccionado, onCitaGuardada }) {
  const { auth } = useAuth();
  const [form, setForm] = useState({ id: null, titulo: "", descripcion: "", id_lote: "" });

  const esEdicion = !!eventoSeleccionado;
 
  // Este efecto carga los datos en el formulario si estamos editando
  useEffect(() => {
    if (esEdicion) {
      setForm({
        id: eventoSeleccionado.id,
        titulo: eventoSeleccionado.title || '',
        descripcion: eventoSeleccionado.description || '',
        id_lote: eventoSeleccionado.idLote || ''
      });
    }
  }, [eventoSeleccionado, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // ESTA ES LA VALIDACIÓN CORREGIDA
    if (!esEdicion && (!slotInfo || !slotInfo.start)) {
        alert("Error: No se seleccionó un espacio de tiempo válido en el calendario.");
        return;
    }

    const datosParaEnviar = {
        ...form,
        start: esEdicion ? eventoSeleccionado.start.toISOString() : slotInfo.start.toISOString(),
        end: esEdicion ? eventoSeleccionado.end.toISOString() : slotInfo.end.toISOString(),
        id_lote: parseInt(form.id_lote, 10),
    };

    try {
        if (esEdicion) {
            await axios.put(`${RUTAJAVA}/api/citasAnimales/${form.id}`, datosParaEnviar, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            alert("Cita actualizada correctamente");
        } else {
            await axios.post(`${RUTAJAVA}/api/citasAnimales`, datosParaEnviar, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            alert("Cita creada correctamente");
        }
        
        onCitaGuardada();

        const closeButton = document.querySelector(`#${esEdicion ? 'ModalEditarCita' : 'ModalCrearCita'} .btn-close`);
        if (closeButton) closeButton.click();

    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error al guardar la cita.");
    }
};

  return (
    // Ahora necesitas dos modales o uno cuyo ID cambie dinámicamente
    <div className="modal fade" id={esEdicion ? 'ModalEditarCita' : 'ModalCrearCita'} /* ... */>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{esEdicion ? 'Editar Cita' : 'Crear Cita'}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <FormCalendario
              form={form}
              handleChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}