import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CaseRecords from "./components/CaseRecords";
import AddCase from "./components/AddCase";
import CreateCase from './components/CreateCase';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/caserecords" element={<CaseRecords />} />
        <Route path="/create-case" element={<CreateCase />} />
        <Route path="/AddCase" element={<AddCase />} />
      </Routes>
    </Router>
  );
};

export default App;
