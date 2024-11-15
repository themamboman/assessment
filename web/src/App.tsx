import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Theme from "./theme";
import RFPList from "./components/RFPList";
import RFPForm from "./components/RFPForm";
import RFPDetails from "./components/RFPDetails";

// Create the main app using the routes wrapped in the color theme - had to do dark mode
const App: React.FC = () => {
  return (
    <Theme>
      <Router>
        <Routes>
          <Route path="/" element={<RFPList />} />
          <Route path="/add" element={<RFPForm />} />
          <Route path="/edit/:id" element={<RFPForm />} />
          <Route path="/details/:id" element={<RFPDetails />} />
        </Routes>
      </Router>
    </Theme>
  );
};

export default App;

