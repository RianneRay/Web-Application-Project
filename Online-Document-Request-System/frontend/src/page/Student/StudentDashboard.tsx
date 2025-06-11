import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { LogOut, Menu, FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Request {
  _id: string;
  documentType: string;
  purpose: string;
  status: string;
  createdAt: string;
}

interface User {
  name: string;
  email: string;
  role: string;
}

const StudentDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/requests/dashboard');
        setUser(res.data.user);
        setRecentRequests(res.data.recentRequests);
      } catch (err) {
        console.error('Error fetching student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          🎓 Student Dashboard
        </h1>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu />
        </button>

        {/* Navigation */}
        <nav
          className={`absolute md:static top-[64px] left-0 w-full md:w-auto bg-white border-t md:border-none md:flex ${
            menuOpen ? 'block' : 'hidden'
          } md:block px-6 md:px-0 py-4 md:py-0 space-y-4 md:space-y-0 md:space-x-6`}
        >
          <button
            onClick={() => navigate('/student/requests/new')}
            className="block text-blue-600 font-medium hover:underline flex items-center gap-1"
          >
            <Plus size={18} /> Make Request
          </button>
          <button
            onClick={() => navigate('/student/requests')}
            className="block text-blue-600 font-medium hover:underline flex items-center gap-1"
          >
            <FileText size={18} /> View Requests
          </button>
          <button
            onClick={handleLogout}
            className="block text-red-600 font-medium hover:underline flex items-center gap-1"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 mt-6 max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center">Loading dashboard...</p>
        ) : (
          <>
            {/* User Info */}
            <section className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Welcome, {user?.name} 👋</h2>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
            </section>

            {/* Recent Requests */}
            <section className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Recent Requests</h2>
                <button
                  onClick={() => navigate('/student/requests')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>

              {recentRequests.length === 0 ? (
                <p>No recent requests found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm md:text-base text-left border">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr>
                        <th className="p-2">Document</th>
                        <th className="p-2">Purpose</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map((req) => (
                        <tr key={req._id} className="border-t">
                          <td className="p-2">{req.documentType}</td>
                          <td className="p-2">{req.purpose}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                req.status === 'Approved'
                                  ? 'bg-green-100 text-green-700'
                                  : req.status === 'Declined'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {new Date(req.createdAt).toLocaleDateString()}
                            <br />
                            <span className="text-xs text-gray-500">
                              {new Date(req.createdAt).toLocaleTimeString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;