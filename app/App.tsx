import React, { useState, useEffect } from "react";
import CSVUploader from "./components/CSVUploader";
import EditableTable from "./components/EditableTable";
import RuleInput, { Rule } from "./components/RuleInput";
import Prioritization from "./components/Prioritization";
import ValidationSummary from "./components/ValidationSummary";

import { validateClients, ValidationError } from "./utils/validateClients";
import { validateWorkers } from "./utils/validateWorkers";
import { validateTasks } from "./utils/validateTasks";

const App: React.FC = () => {
  // Data states
  const [clientsData, setClientsData] = useState<Record<string, string>[]>([]);
  const [workersData, setWorkersData] = useState<Record<string, string>[]>([]);
  const [tasksData, setTasksData] = useState<Record<string, string>[]>([]);

  // Validation errors
  const [clientsErrors, setClientsErrors] = useState<ValidationError[]>([]);
  const [workersErrors, setWorkersErrors] = useState<ValidationError[]>([]);
  const [tasksErrors, setTasksErrors] = useState<ValidationError[]>([]);

  // Business rules and priorities
  const [rules, setRules] = useState<Rule[]>([]);
  const [priorities, setPriorities] = useState<Record<string, number>>({
    PriorityLevel: 5,
    RequestedTaskFulfillment: 5,
    Fairness: 5,
  });

  // Run validations on data changes
  useEffect(() => {
    setClientsErrors(validateClients(clientsData, tasksData));
  }, [clientsData, tasksData]);

  useEffect(() => {
    setWorkersErrors(validateWorkers(workersData, tasksData));
  }, [workersData, tasksData]);

  useEffect(() => {
    setTasksErrors(validateTasks(tasksData, workersData));
  }, [tasksData, workersData]);

  // Handle parsed CSV data
  const handleDataParsed = (type: string, data: Record<string, string>[]) => {
    if (type === "clients") setClientsData(data);
    else if (type === "workers") setWorkersData(data);
    else if (type === "tasks") setTasksData(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Data Alchemist</h2>

      <CSVUploader onDataParsed={handleDataParsed} />

      {/* Editable tables + validation */}
      {clientsData.length > 0 && (
        <>
          <EditableTable
            title="Clients"
            data={clientsData}
            onUpdate={setClientsData}
          />
          <ValidationSummary errors={clientsErrors} />
        </>
      )}

      {workersData.length > 0 && (
        <>
          <EditableTable
            title="Workers"
            data={workersData}
            onUpdate={setWorkersData}
          />
          <ValidationSummary errors={workersErrors} />
        </>
      )}

      {tasksData.length > 0 && (
        <>
          <EditableTable
            title="Tasks"
            data={tasksData}
            onUpdate={setTasksData}
          />
          <ValidationSummary errors={tasksErrors} />
        </>
      )}

      {/* Business Rules Input */}
      <RuleInput rules={rules} setRules={setRules} tasks={tasksData} />

      {/* Prioritization */}
      <Prioritization priorities={priorities} setPriorities={setPriorities} />
    </div>
  );
};

export default App;
