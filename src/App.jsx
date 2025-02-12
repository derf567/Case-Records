import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AddCase from "./components/AddCase";
import CreateCase from './components/CreateCase';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-case" element={<CreateCase />} />
        <Route path="/AddCase" element={<AddCase />} />
      </Routes>
    </Router>
  );
};

export default App;
