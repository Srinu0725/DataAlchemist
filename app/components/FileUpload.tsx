"use client";

import React, { useState } from "react";
import Papa from "papaparse";

interface FileUploadProps {
  label: string;
  onDataLoaded: (data: any[], filename: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onDataLoaded(results.data, file.name);
      },
      error: (err) => {
        setError(err.message);
      },
    });
  };

  return (
    <div className="flex flex-col items-center p-4 border border-dashed rounded-lg border-gray-400">
      <label className="mb-2 font-semibold text-gray-700">{label}</label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full cursor-pointer rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900"
      />
      {filename && <p className="mt-2 text-green-600 text-sm">Loaded: {filename}</p>}
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
};
