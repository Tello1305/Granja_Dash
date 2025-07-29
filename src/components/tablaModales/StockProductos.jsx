import ModalStockCrearProducto from '../modales/modalCrearStockProducto.jsx'
import ModalStockEditarProducto from '../modales/modalEditarStockProductos.jsx'
import TablaGenerica from '../TablaGenerica'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/authContext.jsx';

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function StockpProductos({ onUpdated, productos }) {

    const [stock, setStock] = useState([])
    const { auth } = useAuth();
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    

    const fetchStock = async () => {
        try {
            const response = await axios.get(`${RUTAJAVA}/api/stockProductos`,
                
            );
            console.log('Stocks de la tabla: ' , response.data);
            setStock(response.data);

        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    }
    useEffect(() => {
        fetchStock();
    }, []);

    

    const columns = [
      {
        header: "N°",
        accessorKey: "id",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
        size: 50
      },
      {
        header: "PRODUCTO",
        accessorKey: "nombreProducto",
        enableSorting: true,

      },
      
      {
        header: "TIPO",
        accessorKey: "tipo",
        enableSorting: true,

      },
      {
        header: "CANTIDAD",
        accessorKey: "cantidad",
        enableSorting: true,
      },
      {
        header: "FECHA",
        accessorKey: "fecha",
        enableSorting: true,
        cell: (info) => {
            const date = new Date(info.getValue());
            return date.toLocaleString("es-PE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });
          }
    },
      {
        header: "ACCIÓN",
        enableSorting: false,
        cell: (info) => (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-warning btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#modalStockEditarProducto"
              onClick={() => setProductoSeleccionado(info.row.original)}
            >
              Editar
            </button>
          </div>
        )
      }
    ];

    return (
        <>
            <div className="modal fade" id="modalPrincipalStock" tabIndex="-1" aria-labelledby="modalPrincipalStockLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="modalPrincipalStockLabel">Gestión de Stock de Productos</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <TablaGenerica
                                     data={stock}
                                     columns={columns}
                                     showSearch={true}
                                     showPagination={true}
                                     showtock={false}
                                     stockModalId="#modalPrincipalStockProducto"
                                     onStock={() => document.activeElement.blur()}
                                     createModalId="#modalStockCrearProducto"
                                     onCreate={() => document.activeElement.blur()}
                            
                                     />
                        </div>
                        
                    </div>
                </div>
            </div>

            <ModalStockCrearProducto onUpdated={onUpdated} productos={productos} />
            <ModalStockEditarProducto onUpdated={onUpdated} stockSeleccionado={productoSeleccionado} productos={productos} />
           
        </>
    )
}