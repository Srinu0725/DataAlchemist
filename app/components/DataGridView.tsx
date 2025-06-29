"use client";

import React, { useState } from "react";
import { DataGrid, GridColDef, GridRowsProp, GridCellEditStopParams } from "@mui/x-data-grid";

interface Props {
  data: any[];
  title: string;
  onDataChange: (updatedData: any[]) => void;
}

export const DataGridView: React.FC<Props> = ({ data, title, onDataChange }) => {
  if (!data || data.length === 0) return null;

  // Convert data to rows with ID (required by DataGrid)
  const initialRows: GridRowsProp = data.map((row, index) => ({
    id: index,
    ...row,
  }));

  const [rows, setRows] = useState(initialRows);

  // Create column definitions
  const columns: GridColDef[] = Object.keys(data[0]).map((key) => ({
    field: key,
    headerName: key,
    width: 180,
    editable: true,
  }));

  const handleCellEditStop = (params: GridCellEditStopParams, event: any) => {
    const { id, field } = params;
    const value = event.target.value;

    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });

    setRows(updatedRows);
    onDataChange(updatedRows.map(({ id, ...rest }) => rest)); // remove id
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          onCellEditStop={handleCellEditStop}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};
