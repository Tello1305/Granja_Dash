import {useState, useEffect} from "react";
import axios from "axios";
import "../../assets/css/login.css";

export function FormLogin({onSubmit}) {

    const [form, setForm] = useState({
        usuario: "",
        password: "",
    })

    const handleChange = (e) =>{
       setForm({
        ...form, [e.target.name]: e.target.value
       })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
        
    }

    return(
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="usuario" className="form-label">usuario</label>
                <input 
                className="form-control"
                type="text"
                id="usuario"
                name="usuario"
                value = {form.usuario} 
                onChange={handleChange}
                required/>
            </div>
            <br />
            <div>
                <label htmlFor="password" className="form-label">contraseña</label>
                <input 
                className="form-control"
                type="password"
                id="password"
                name="password"
                value = {form.password} 
                onChange={handleChange}
                required/>
            </div>
            <br />
            <button type="submit" className="btn btn-primary">Iniciar sesión</button>            
        </form>
    )
}