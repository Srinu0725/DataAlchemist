import React from "react";

interface ValidationError {
  rowIndex: number;
  columnKey: string;
  message: string;
}

interface Props {
  errors: ValidationError[];
}

const ValidationSummary: React.FC<Props> = ({ errors }) => {
  if (errors.length === 0) {
    return <div style={{ color: "green" }}>No validation errors found.</div>;
  }

  return (
    <div style={{ color: "red", marginTop: 10 }}>
      <h4>Validation Errors:</h4>
      <ul>
        {errors.map((err, idx) => (
          <li key={idx}>
            Row {err.rowIndex + 1}, Column "{err.columnKey}": {err.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationSummary;
