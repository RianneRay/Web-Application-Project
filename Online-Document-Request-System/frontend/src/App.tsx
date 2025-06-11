import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './page/Login';
import AdminDashboard from './page/Admin/AdminDashboard';
import AdminRequests from './page/Admin/AdminRequests';
import RegisterStudent from './page/Admin/RegisterStudent';
import StudentDashboard from './page/Student/StudentDashboard';
import ViewRequest from './page/Student/ViewRequest';
import RequestDocument from './page/Student/RequestDocument';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboards */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/requests" element={<ViewRequest />} />
      <Route path="/student/requests/new" element={<RequestDocument />} />
      
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/requests" element={<AdminRequests />} />
      <Route path="/admin/register" element={<RegisterStudent />} />

      {/* 404 fallback */}
      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
}

export default App;