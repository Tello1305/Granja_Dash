import { useState } from "react";
import ModalBase from "./ModalBase";
import FormBoton from "../form/formBoton";
import { useCategoriaModal } from "../../hooks/useCategoriaModal";

export default function ModalCrearCategoria({ onUpdated }) {
    const { loading, crearCategoria } = useCategoriaModal(onUpdated);
    
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await crearCategoria(form);
            // Limpiar formulario después de crear exitosamente
            setForm({
                nombre: "",
                descripcion: "",
            });
        } catch (error) {
            // El error ya se maneja en el hook
        }
    };

    return (
        <ModalBase
            id="ModalCrearTablaCategoria"
            title="Crear Categoría"
            onSubmit={handleSubmit}
            submitText={loading ? "Creando..." : "Crear categoría"}
            isForm={true}
        >
            <FormBoton
                id="nombre"
                label="Nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ingrese el nombre"
                required
                disabled={loading}
            />
            
            <FormBoton
                id="descripcion"
                label="Descripción"
                type="text"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Ingrese la descripción"
                required
                disabled={loading}
            />
        </ModalBase>
    );
}

    