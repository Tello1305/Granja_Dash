

import { useState } from "react";
import FormBoton from "./formBoton";

export default function FormularioCategoria({ 
    onSubmit, 
    initialData = { nombre: "", descripcion: "" },
    submitText = "Guardar",
    showFooter = true 
}) {
    const [form, setForm] = useState(initialData);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormBoton
                id="nombre"
                label="Nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ingrese el nombre"
                required
            />
            <FormBoton
                id="descripcion"
                label="Descripción"
                type="text"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Ingrese la descripción"
                required
            />

            {showFooter && (
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => document.activeElement?.blur()}
                    >
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {submitText}
                    </button>
                </div>
            )}
        </form>
    );
}