import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../auth/authContext.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export const useCategoriaModal = (onUpdated) => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);

    const showSuccessMessage = (message) => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    const showErrorMessage = (error, defaultMessage) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.response?.data?.message || error.message || defaultMessage
        });
    };

    const closeModal = (modalId) => {
        const closeButton = document.querySelector(`#${modalId} .btn-close`);
        if (closeButton) {
            closeButton.click();
        }
        document.activeElement?.blur();
    };

    const crearCategoria = async (formData, modalId = "ModalCrearTablaCategoria") => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${RUTAJAVA}/api/CategoriaProductos`,
                {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }
            );

            if (onUpdated) onUpdated();
            showSuccessMessage('Categoría creada con éxito');
            closeModal(modalId);
            
            return response.data;
        } catch (error) {
            console.error("Error al crear:", error);
            showErrorMessage(error, 'Hubo un problema al crear la categoría.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const editarCategoria = async (id, formData, modalId = "ModalEditarTablaCategoria") => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${RUTAJAVA}/api/CategoriaProductos/${id}`,
                {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }
            );

            if (onUpdated) onUpdated();
            showSuccessMessage('Categoría actualizada con éxito');
            closeModal(modalId);
            
            return response.data;
        } catch (error) {
            console.error("Error al actualizar:", error);
            showErrorMessage(error, 'Ocurrió un error al actualizar la categoría.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        crearCategoria,
        editarCategoria,
        closeModal
    };
};