import "../assets/css/main.css"
import Graficos from './graficos.jsx'

export function Secciones({dataGeneral}) {

    const secciones = [
        {
            titulo: "Total de ventas",      
        },
        {
            titulo: "Total de productos",
        },
        {
            titulo: "Total de servicios",
        },
        {
            titulo: "Total de categorias",
        },
    ]
    return (
        <>
        <main className="container">
        <section className=" d-flex justify-content-center gap-3 mt-4 flex-wrap">
            {secciones.map((seccion, index) => (
                <div key={index} className="rounded-5 border p-2 sections d-flex justify-content-center align-items-center">
                    <span>{"$" + dataGeneral + " - "}</span>
                    
                    <span>{seccion.titulo}</span>
                </div>
            ))}

            <br />
            
        </section>
        <br />
        <section className="d-flex justify-content-center align-items-center gap-2">
            <Graficos/>
        </section>
        </main>
        
        </>
    )
}