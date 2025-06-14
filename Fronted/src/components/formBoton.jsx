

export function FormBoton({id, label, type, value, onChange, placeholder}) {
    return (

        <div>
            <label 
            htmlFor={id} className="form-label">
                {label}
            </label><br />

            <input 
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="form-control"
             />
        </div>
        
    )
}  