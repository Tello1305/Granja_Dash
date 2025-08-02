import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import "../assets/css/modern-tables.css";

export default function TablaGenerica({
  data = [],
  columns = [],
  onDelete,
  onEdit,
  showSearch = true,
  showPagination = true,
  customSearch = null,
  showButton = true,
  onCreate = null,
  createModalId,
  showtock = false,
  stockModalId,
  onStock = null,
}) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  });



  return (
    <div className="modern-table-container">
      <div className="modern-table-controls">
        <div className={`search-section ${isSearchExpanded ? 'expanded' : ''}`}>
          {showSearch && !customSearch && (
            <div className="input-group">
              <span 
                className="input-group-text" 
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                onBlur={() => {
                  if (!globalFilter) {
                    setIsSearchExpanded(false);
                  }
                }}
              />
            </div>
          )}
          {customSearch && customSearch}
        </div>
        <div className="actions-section">
          {showtock && (
            <button
              className="btn btn-outline-warning btn-sm"
              style={{ '--bs-btn-hover-bg': 'var(--light-orange)', '--bs-btn-hover-border-color': 'var(--light-orange)' }}
              data-bs-toggle="modal"
              data-bs-target={stockModalId}
              onClick={onStock}
            >
              <i className="bi bi-box-seam me-1"></i> Stock
            </button>
          )}
          {showButton && (
            <button
              className="btn btn-primary btn-sm"
              data-bs-toggle="modal"
              data-bs-target={createModalId}
              onClick={onCreate}
            >
              <i className="bi bi-plus-lg me-1"></i> Nuevo
            </button>
          )}
        </div>
      </div>

      <div className="modern-table-responsive">
        <table className="table table-hover modern-table">
          <thead className="table-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="align-middle"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      minWidth: header.column.columnDef.minWidth || 'auto',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    <div className="d-flex align-items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === 'asc' && (
                        <i className="bi bi-arrow-up"></i>
                      )}
                      {header.column.getIsSorted() === 'desc' && (
                        <i className="bi bi-arrow-down"></i>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="align-middle">
                {row.getVisibleCells().map((cell) => (
                  <td 
                    key={cell.id} 
                    className="p-2"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px'
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell || cell.getValue(), {
                      ...cell.getContext(),
                      onDelete,
                      onEdit,
                    })}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && table.getPageCount() > 1 && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-3 p-3 bg-light rounded">
          <div className="text-muted small">
            Mostrando <strong>{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</strong> a{' '}
            <strong>
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </strong> de <strong>{table.getFilteredRowModel().rows.length}</strong> registros
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                title="Primera página"
              >
                <i className="bi bi-chevron-bar-left"></i>
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                title="Página anterior"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <span className="px-3 d-flex align-items-center">
                {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                title="Siguiente página"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                title="Última página"
              >
                <i className="bi bi-chevron-bar-right"></i>
              </button>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <span className="small">Ir a:</span>
            <input
              type="number"
              className="form-control form-control-sm"
              style={{ width: '70px' }}
              min={1}
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(Math.min(Math.max(0, page), table.getPageCount() - 1));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};


