

import { useState, useEffect, useRef, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay, differenceInCalendarDays } from "date-fns";
import esES from "date-fns/locale/es";
import axios from "axios";
import ModalCita from "./modales/modalCita.jsx";
import '../assets/css/Calendario.css'; // Importa los nuevos estilos

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;
const locales = { es: esES };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const messages = {
  allDay: "Todo el día", previous: "Anterior", next: "Siguiente", today: "Hoy",
  month: "Mes", week: "Semana", day: "Día", agenda: "Agenda", date: "Fecha",
  time: "Hora", event: "Evento", noEventsInRange: "Sin eventos"
};

// --- Lógica de proximidad y componente personalizado ---

const getProximityClass = (eventDate) => {
  const hoy = new Date();
  const diasFaltantes = differenceInCalendarDays(eventDate, hoy);

  if (diasFaltantes < 0) return 'prox-pasada';
  if (diasFaltantes <= 2) return 'prox-urgente';
  if (diasFaltantes <= 5) return 'prox-cercana';
  if (diasFaltantes <= 10) return 'prox-media';
  if (diasFaltantes <= 15) return 'prox-lejana';
  
  return 'prox-muy-lejana';
};

const CustomEvent = ({ event }) => {
  const proximityClass = getProximityClass(event.start);

  return (
    <div className="custom-event-container">
      <span className={`event-dot ${proximityClass}`}></span>
      <span className="event-title">{event.title}</span>
    </div>
  );
};

// --- Componente principal del Calendario ---

export function Calendario() {
  const [events, setEvents] = useState([]);
  const [slotInfo, setSlotInfo] = useState(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const triggerModal = useRef(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(`${RUTAJAVA}/api/citasAnimales`);
      const citas = response.data.map((cita) => ({
        ...cita,
        id: cita.id_cita,
        title: cita.titulo,
        start: new Date(cita.start),
        end: new Date(cita.end),
        description: cita.descripcion,
        idLote: cita.id_lote
      }));
      setEvents(citas);
    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (slotInfo || eventoSeleccionado) {
      triggerModal.current.click();
    }
  }, [slotInfo, eventoSeleccionado]);

  const handleSelectSlot = (slot) => {
    setEventoSeleccionado(null);
    setSlotInfo(slot);
  };

  const handleSelectEvent = (event) => {
    setSlotInfo(null);
    setEventoSeleccionado(event);
  };
  
  const components = {
    event: CustomEvent,
  };

  return (
    <div className="calendar-container" style={{ width: '100%', height: '100%', minHeight: '600px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture="es"
        messages={messages}
        views={["month", "week", "day", "agenda"]}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        date={date}
        onNavigate={setDate}
        view={view}
        onView={setView}
        components={components} // Prop para personalizar el renderizado
        style={{
          height: '100%',
          width: '100%',
          margin: '0 auto'
        }}
      />

      <button ref={triggerModal} style={{ display: "none" }} data-bs-toggle="modal" data-bs-target="#ModalCita"></button>

      <ModalCita
        slotInfo={slotInfo}
        eventoSeleccionado={eventoSeleccionado}
        onCitaGuardada={fetchEvents}
      />
    </div>
  );
}