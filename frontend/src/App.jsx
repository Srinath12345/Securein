import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CVETable from "./cve_table";
import VulnerabilityDetail from "./cve_details";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CVETable />} />
        <Route path="/cve/:id" element={<VulnerabilityDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
