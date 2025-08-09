import { useEffect } from "react";

export default function ModalBase({ 
    id, 
    title, 
    children, 
    onSubmit, 
    submitText = "Guardar", 
    cancelText = "Cancelar",
    showFooter = true,
    size = "modal-dialog",
    isForm = true 
}) {
    
    const handleSubmit = (e) => {
        if (onSubmit) {
            onSubmit(e);
        }
    };

    const closeModal = () => {
        const closeButton = document.querySelector(`#${id} .btn-close`);
        if (closeButton) {
            closeButton.click();
        }
        document.activeElement?.blur();
    };

    const ModalContent = () => (
        <>
            <div className="modal-header">
                <h1 className="modal-title fs-5">
                    {title}
                </h1>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </div>
            
            <div className="modal-body">
                {children}
            </div>
            
            {showFooter && (
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => document.activeElement?.blur()}
                    >
                        {cancelText}
                    </button>
                    <button 
                        type={isForm ? "submit" : "button"} 
                        className="btn btn-primary"
                        onClick={!isForm ? handleSubmit : undefined}
                    >
                        {submitText}
                    </button>
                </div>
            )}
        </>
    );

    return (
        <div
            className="modal fade"
            id={id}
            tabIndex="-1"
            aria-labelledby={`${id}Label`}
            aria-hidden="true"
        >
            <div className={size}>
                <div className="modal-content">
                    {isForm ? (
                        <form onSubmit={handleSubmit}>
                            <ModalContent />
                        </form>
                    ) : (
                        <ModalContent />
                    )}
                </div>
            </div>
        </div>
    );
}