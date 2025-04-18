import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from './components/DashBoard';
import CaseRecords from "./components/CaseRecords";
import CreateCase from './components/CreateCase';
import EditCase from './components/EditCase';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Settings from './components/Settings';
import CaseOverview from './components/CaseOverview';
import ResolvedCases from './components/ResolvedCases';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/caserecords" element={<CaseRecords />} />
        <Route path="/caseoverview" element={<CaseOverview />} />
        <Route path="/create-case" element={<CreateCase />} />
        <Route path="/edit-case/:id" element={<EditCase />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/case-overview/:id" element={<CaseOverview />} />
        <Route path="/resolved-cases" element={<ResolvedCases />} />
      </Routes>
    </Router>
  );
};

export default App;
