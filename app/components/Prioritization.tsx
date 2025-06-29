import React from "react";

interface Props {
  priorities: Record<string, number>;
  setPriorities: (priorities: Record<string, number>) => void;
}

const Prioritization: React.FC<Props> = ({ priorities, setPriorities }) => {
  const handleChange = (key: string, value: number) => {
    setPriorities({ ...priorities, [key]: value });
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Prioritization & Weights</h3>
      {Object.keys(priorities).map((key) => (
        <div key={key} style={{ marginBottom: 10 }}>
          <label>
            {key}: {priorities[key]}
            <input
              type="range"
              min={1}
              max={10}
              value={priorities[key]}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              style={{ marginLeft: 10 }}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default Prioritization;
