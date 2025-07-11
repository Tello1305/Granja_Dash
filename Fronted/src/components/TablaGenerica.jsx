import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

const TablaGenerica = ({
  data = [],
  columns = [],
  onDelete,
  onEdit,
  showSearch = true,
  showPagination = true,
  itemsPerPage = 10,
  customSearch = null
}) => {
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
        pageSize: itemsPerPage,
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
    <div className="table-responsive">
      {showSearch && !customSearch && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Buscar..."
            className="form-search"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      )}

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th 
                  key={header.id} 
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
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
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

      {showPagination && table.getPageCount() > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Mostrando {table.getRowModel().rows.length} de {data.length} registros
          </div>
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              «
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ‹
            </button>
            <span className="px-3 d-flex align-items-center">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              ›
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              »
            </button>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span>Ir a página:</span>
            <input
              type="number"
              className="form-control form-control-sm"
              style={{ width: '70px' }}
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

export default TablaGenerica;
