import React from 'react';

export default function UsersTable({ columns, data, renderCell }) {
  return (
    <div className="table-container-UP">
      <table className="table-UP">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((usuario) => (
              <tr key={usuario.uniqueKey}>
                {columns.map((col) => renderCell(usuario, col))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns?.length || 1} className="no-results-UP">No hay usuarios que coincidan con los filtros</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
