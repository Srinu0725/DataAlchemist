import React, { useState } from "react";

export interface Rule {
  type: string;
  tasks?: string[];
  clientGroup?: string;
  workerGroup?: string;
  minCommonSlots?: number;
  maxSlotsPerPhase?: number;
  allowedPhases?: number[];
  regex?: string;
  priority?: number;
}

interface Props {
  rules: Rule[];
  setRules: (rules: Rule[]) => void;
  tasks: Record<string, string>[];
}

const RuleInput: React.FC<Props> = ({ rules, setRules, tasks }) => {
  const [ruleType, setRuleType] = useState("coRun");

  const addRule = () => {
    if (ruleType === "coRun") {
      if (tasks.length < 2) {
        alert("Need at least 2 tasks to add coRun rule.");
        return;
      }
      setRules([...rules, { type: "coRun", tasks: [tasks[0].TaskID, tasks[1].TaskID] }]);
    }
    // Extend for other rule types as needed
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Business Rules</h3>
      <select value={ruleType} onChange={(e) => setRuleType(e.target.value)}>
        <option value="coRun">Co-Run Tasks</option>
        <option value="slotRestriction">Slot Restriction</option>
        <option value="loadLimit">Load Limit</option>
      </select>
      <button onClick={addRule} style={{ marginLeft: 10 }}>
        Add Rule
      </button>
      <ul style={{ marginTop: 10 }}>
        {rules.map((rule, idx) => (
          <li key={idx}>
            Type: {rule.type}{" "}
            {rule.tasks && <>Tasks: {rule.tasks.join(", ")}</>}
            {rule.clientGroup && <> ClientGroup: {rule.clientGroup}</>}
            {rule.workerGroup && <> WorkerGroup: {rule.workerGroup}</>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RuleInput;
