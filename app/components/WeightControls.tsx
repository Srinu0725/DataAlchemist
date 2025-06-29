import React from "react";

interface Props {
  weights: {
    priorityLevel: number;
    maxLoadPerPhase: number;
    [key: string]: number;
  };
  onChange: (weights: { [key: string]: number }) => void;
}

const WeightControls: React.FC<Props> = ({ weights, onChange }) => {
  const handleSliderChange = (key: string, value: number) => {
    onChange({ ...weights, [key]: value });
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Set Priorities / Weights</h3>

      <label>
        Priority Level Weight: {weights.priorityLevel}
        <input
          type="range"
          min={1}
          max={10}
          value={weights.priorityLevel}
          onChange={(e) => handleSliderChange("priorityLevel", Number(e.target.value))}
        />
      </label>

      <br />

      <label>
        Max Load Per Phase Weight: {weights.maxLoadPerPhase}
        <input
          type="range"
          min={1}
          max={10}
          value={weights.maxLoadPerPhase}
          onChange={(e) => handleSliderChange("maxLoadPerPhase", Number(e.target.value))}
        />
      </label>

      {/* Add more sliders as needed */}
    </div>
  );
};

export default WeightControls;
