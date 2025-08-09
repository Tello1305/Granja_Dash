import { useEffect, useState } from "react";
import ModalBase from "./ModalBase";
import FormBoton from "../form/formBoton";
import { useCategoriaModal } from "../../hooks/useCategoriaModal";

export default function ModalEditarCategoria({ categoria, onUpdated }) {
  const { loading, editarCategoria } = useCategoriaModal(onUpdated);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    if (categoria) {
      setForm({
        nombre: categoria.nombre || "",
        descripcion: categoria.descripcion || "",
      });
    }
  }, [categoria]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categoria?.id_categoria) {
      await editarCategoria(categoria.id_categoria, form);
    }
  };

  return (
    <ModalBase
      id="ModalEditarTablaCategoria"
      title="Editar Categoría"
      onSubmit={handleSubmit}
      submitText={loading ? "Guardando..." : "Guardar cambios"}
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