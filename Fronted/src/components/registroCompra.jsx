import { useState } from 'react'
import { FormBoton } from './formBoton.jsx'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // Estilos base del datepicker
import '../assets/css/DatePickerCustom.css' // Nuestros estilos personalizados
import '../assets/css/formCompra.css'

export function RegistroCompra() {
    const [formCompra, setFormCompra] = useState({
        comida: "",
        costo: "",
        tipo: "",
        foto: "",
        fecha: new Date()
    })
    const iptData = (e) => {
        const { id, value } = e.target;
        setFormCompra((prev) => ({ ...prev, [id]: value }));
    };
    const iptSubmit = (e) => {
        e.preventDefault();
        console.log(formCompra);
    };
    return (
        <>
        <main className="container mt-4">
            <section className="p-4 border formComprar rounded">
            <strong>Registro de compra - Alimento</strong>
                <form onSubmit={iptSubmit} className='d-flex  gap-5'>

                    <div>
                    
                    <br />
                   
                    <FormBoton
                    id="comida"
                    label="Cantida de Comida"
                    type="number"
                    value={formCompra.comida}
                    onChange={iptData}
                    placeholder="0"
                    />
                    <br />
                    
                    <FormBoton
                    id="costo"
                    label="Costo total"
                    type="number"
                    value={formCompra.costo}
                    onChange={iptData}
                    placeholder="0"
                    />
                    <br />
                    <label className="form-label" htmlFor="tipo">Seleccione el animal</label><br />
                    <select name="" id="tipo" className="form-select">
                        <option value="">
                            Seleccione
                        </option>
                        <option value="">
                            Carne
                        </option>
                        <option value="">
                            Pescado
                        </option>
                        <option value="">
                            Pollo
                        </option>
                        <option value="">
                            Vacuno
                        </option>
                    </select>
                    <br />
                    <label htmlFor="foto" className="form-label">Comprobante de compra</label>
                    <br />
                    <input type="file" id="foto" className='form-control' />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="fecha" className="form-label">Fecha de compra</label>
                        <div>
                            <div className="calendario-fijo">
                                <input
                                    id="fecha"
                                    type="text"
                                    className="form-control mb-2"
                                    value={formCompra.fecha.toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                    onChange={(e) => {
                                        // Intentar parsear la fecha ingresada
                                        const dateParts = e.target.value.split('/');
                                        if (dateParts.length === 3) {
                                            const day = parseInt(dateParts[0], 10);
                                            const month = parseInt(dateParts[1], 10) - 1; // Los meses en JS van de 0-11
                                            const year = parseInt(dateParts[2], 10);
                                            
                                            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                                                const newDate = new Date(year, month, day);
                                                if (!isNaN(newDate.getTime())) {
                                                    setFormCompra(prev => ({
                                                        ...prev,
                                                        fecha: newDate
                                                    }));
                                                }
                                            }
                                        }
                                    }}
                                    placeholder="DD/MM/AAAA"
                                />
                                <DatePicker
                                    selected={formCompra.fecha}
                                    onChange={(date) => setFormCompra(prev => ({ ...prev, fecha: date }))}
                                    inline
                                    dropdownMode="select"
                                    className="calendario-inline"
                                    minDate={new Date(new Date().getFullYear() - 10, 0, 1)}
                                    maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                                    yearDropdownItemNumber={15}
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary w-100" type="submit">Enviar</button>
                    </div>
                </form>
            </section>
        </main>
        
        </>
    )
}