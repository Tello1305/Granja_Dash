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
        <div className="search-section">
          {showSearch && !customSearch && (
            <input
              type="text"
              placeholder="Buscar..."
              className="modern-search-input"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          )}
        </div>
        <div className="actions-section">
          {showtock && (
            <button
              className="modern-btn modern-btn-primary"
              data-bs-toggle="modal"
              data-bs-target={stockModalId}
              onClick={onStock}
            >
              Ver Stock
            </button>
          )}
          {showButton && (
            <button
              className="modern-btn modern-btn-primary"
              data-bs-toggle="modal"
              data-bs-target={createModalId}
              onClick={onCreate}
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          )}
        </div>
      </div>

      <div className="modern-table-responsive">
        <table className="modern-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="modern-table-header"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
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
              <tr key={row.id} className="modern-table-row">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="modern-table-cell">
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
        <div className="modern-pagination">
          <div className="modern-pagination-info">
            Mostrando {table.getRowModel().rows.length} de {data.length} registros
          </div>
          <div className="modern-pagination-controls">
            <button
              className="modern-pagination-btn"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              «
            </button>
            <button
              className="modern-pagination-btn"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ‹
            </button>
            <span className="modern-pagination-current">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <button
              className="modern-pagination-btn"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              ›
            </button>
            <button
              className="modern-pagination-btn"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              »
            </button>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-light)' }}>Ir a página:</span>
            <input
              type="number"
              className="modern-pagination-input"
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};


