import React, { useState, useEffect } from "react";
import CSVUploader from "./components/CSVUploader";
import EditableTable from "./components/EditableTable";
import ValidationSummary from "./components/ValidationSummary";
import RuleInput, { Rule } from "./components/RuleInput";
import Prioritization from "./components/Prioritization";
import NLSearch from "./components/NLSearch";
import { validateClients, ValidationError } from "./utils/validateClients";
import { validateWorkers } from "./utils/validateWorkers";
import { validateTasks } from "./utils/validateTasks";
import { generateSchedule, Assignment } from "./utils/schedule";

export default function HomePage() {
  const [clientsData, setClientsData] = useState<Record<string, string>[]>([]);
  const [workersData, setWorkersData] = useState<Record<string, string>[]>([]);
  const [tasksData, setTasksData] = useState<Record<string, string>[]>([]);

  const [rules, setRules] = useState<Rule[]>([]);
  const [priorities, setPriorities] = useState<Record<string, number>>({
    clients: 5,
    workers: 5,
    tasks: 5,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [schedule, setSchedule] = useState<Assignment[]>([]);

  const handleDataParsed = (fileType: string, data: Record<string, string>[]) => {
    if (fileType === "clients") setClientsData(data);
    else if (fileType === "workers") setWorkersData(data);
    else if (fileType === "tasks") setTasksData(data);
  };

  const handleGenerateSchedule = () => {
    const result = generateSchedule({
      clients: clientsData,
      workers: workersData,
      tasks: tasksData,
      rules,
      priorities,
    });
    setSchedule(result);
  };

  const validateAll = () => {
    const clientErrors = validateClients(clientsData, tasksData);
    const workerErrors = validateWorkers(workersData, tasksData);
    const taskErrors = validateTasks(tasksData, workersData);

    setErrors([...clientErrors, ...workerErrors, ...taskErrors]);
  };

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = tasksData.filter((task) =>
      Object.values(task).some((val) => val.toLowerCase().includes(lowerQuery))
    );
    setTasksData(filtered);
  };

  

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Data Alchemist Scheduler</h2>

      <CSVUploader onDataParsed={handleDataParsed} />

      <EditableTable title="Clients" data={clientsData} onUpdate={setClientsData} />
      <EditableTable title="Workers" data={workersData} onUpdate={setWorkersData} />
      <EditableTable title="Tasks" data={tasksData} onUpdate={setTasksData} errors={errors} />

      <button onClick={validateAll}>Validate Data</button>

      <ValidationSummary errors={errors} />

      <RuleInput rules={rules} setRules={setRules} tasks={tasksData} />

      <Prioritization priorities={priorities} setPriorities={setPriorities} />

      <NLSearch onSearch={handleSearch} />

      <div style={{ marginTop: 20 }}>
        <button onClick={handleGenerateSchedule}>Generate Schedule</button>
      </div>

      {schedule.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>📅 Generated Schedule</h3>
          <table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Client ID</th>
                <th>Task ID</th>
                <th>Worker ID</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, i) => (
                <tr key={i}>
                  <td>{s.phase}</td>
                  <td>{s.clientId}</td>
                  <td>{s.taskId}</td>
                  <td>{s.workerId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 40 }}>
        <button
          onClick={() => {
            const exportData = {
              clients: clientsData,
              workers: workersData,
              tasks: tasksData,
              rules,
              priorities,
              schedule,
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
              type: "application/json",
            });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "schedule_config.json";
            a.click();
          }}
        >
          Export Config & Schedule as JSON
        </button>
      </div>
    </div>
  );
}