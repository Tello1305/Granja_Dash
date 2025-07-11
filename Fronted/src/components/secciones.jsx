import "../assets/css/main.css"


export function Secciones({dataGeneral}) {

    const secciones = [
        {
            titulo: "Total de Categorias",          
        },
        {
            titulo: "Total de Ganado",
        },
        {
            titulo: "Total de Productos",
        },
        
    ]
    return (
        <>
        <main className="container">
        <section className=" d-flex justify-content-center gap-3 mt-4 flex-wrap">
            {secciones.map((seccion, index) => (
                <div key={index} className="rounded-5 border p-2 sections d-flex justify-content-center align-items-center">
                    <div className="circle circleTotal rounded-5 p-2">
                    <span>{dataGeneral }</span>
                    </div>
                    
                    <span>{seccion.titulo}</span>
                </div>
            ))}

            <br />
            
        </section>
        <br />
        
        </main>
        
        </>
    )
}