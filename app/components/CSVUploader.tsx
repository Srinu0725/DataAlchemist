import React from "react";
import Papa from "papaparse";

interface Props {
  onDataParsed: (fileType: string, data: Record<string, string>[]) => void;
}

const CSVUploader: React.FC<Props> = ({ onDataParsed }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true, // Parse CSV with headers as keys
      skipEmptyLines: true,
      complete: (results) => {
        onDataParsed(fileType, results.data as Record<string, string>[]);
      },
      error: (err) => {
        alert(`Error parsing ${fileType} CSV: ${err.message}`);
      },
    });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label>Upload Clients CSV:</label>
      <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, "clients")} />

      <label>Upload Workers CSV:</label>
      <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, "workers")} />

      <label>Upload Tasks CSV:</label>
      <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, "tasks")} />
    </div>
  );
};

export default CSVUploader;
