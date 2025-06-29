import React, { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

const NLSearch: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Search (e.g. tasks duration > 2)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "60%", marginRight: 10, padding: 5 }}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default NLSearch;
