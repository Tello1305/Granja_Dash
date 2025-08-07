export function FiltrarReporte() {
  return (
    <>
      <div
        className="modal fade"
        id="ModalFiltrarReporte"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Filtrar Reporte
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">

                <div>
                    <label className="form-label" htmlFor="fechaDesde">Fecha desde:</label>
                    <input className="form-control" type="date" id="fechaDesde" />
                </div>
                <div>
                    <label className="form-label" htmlFor="fechaHasta">Fecha hasta:</label>|
                    <input className="form-control" type="date" id="fechaHasta" />
                </div>

                
                <div className="modal-footer d-flex justify-content-between">
                    <button className="btn btn-reporte btn-pdf">PDF</button>
                    <button className="btn btn-reporte btn-excel">Excel</button>
                </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
