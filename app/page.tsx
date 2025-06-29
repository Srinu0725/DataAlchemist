"use client";

import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { DataGridView } from "./components/DataGridView";

export default function HomePage() {
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [workersData, setWorkersData] = useState<any[]>([]);
  const [tasksData, setTasksData] = useState<any[]>([]);

  const handleDataLoaded = (data: any[], fileName: string) => {
    if (fileName.toLowerCase().includes("client")) {
      setClientsData(data);
    } else if (fileName.toLowerCase().includes("worker")) {
      setWorkersData(data);
    } else if (fileName.toLowerCase().includes("task")) {
      setTasksData(data);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-white">
      <h1 className="text-4xl font-bold mb-10 text-purple-700">🧪 Data Alchemist</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <FileUpload label="Upload clients.csv" onDataLoaded={handleDataLoaded} />
        <FileUpload label="Upload workers.csv" onDataLoaded={handleDataLoaded} />
        <FileUpload label="Upload tasks.csv" onDataLoaded={handleDataLoaded} />
      </div>

      <DataGridView data={clientsData} title="Clients Data" onDataChange={setClientsData} />
      <DataGridView data={workersData} title="Workers Data" onDataChange={setWorkersData} />
      <DataGridView data={tasksData} title="Tasks Data" onDataChange={setTasksData} />
    </main>
  );
}
