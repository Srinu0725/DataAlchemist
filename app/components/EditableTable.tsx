import React, { useState } from "react";

interface Props {
  title: string;
  data: Record<string, string>[];
  onUpdate: (updatedData: Record<string, string>[]) => void;
  errors?: { rowIndex: number; columnKey: string; message: string }[];
}

const EditableTable: React.FC<Props> = ({ title, data, onUpdate, errors = [] }) => {
  const headers = Object.keys(data[0] || {});
  const [editRow, setEditRow] = useState<number | null>(null);
  const [editCol, setEditCol] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleCellClick = (rowIndex: number, header: string) => {
    setEditRow(rowIndex);
    setEditCol(header);
    setInputValue(data[rowIndex][header]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editRow !== null && editCol !== null) {
      const updated = [...data];
      updated[editRow] = { ...updated[editRow], [editCol]: inputValue };
      onUpdate(updated);
      setEditRow(null);
      setEditCol(null);
    }
  };

  // Check if this cell has an error
  const hasError = (rowIndex: number, header: string) =>
    errors.some((err) => err.rowIndex === rowIndex && err.columnKey === header);

  return (
    <div style={{ marginBottom: 40 }}>
      <h3>{title}</h3>
      <table border={1} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={{ padding: 8 }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td
                  key={header}
                  onClick={() => handleCellClick(rowIndex, header)}
                  style={{
                    padding: 8,
                    backgroundColor: hasError(rowIndex, header) ? "#fdd" : undefined,
                    cursor: "pointer",
                  }}
                >
                  {editRow === rowIndex && editCol === header ? (
                    <input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  ) : (
                    row[header]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;
