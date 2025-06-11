import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { LogOut, Menu, UserPlus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Request {
  _id: string;
  studentId: string;
  documentType: string;
  purpose: string;
  status: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<{ totalStudents: number; totalRequests: number } | null>(null);
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.stats);
        setRecentRequests(response.data.recentRequests);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
        <h1 className="text-xl font-bold text-blue-600">📋 Admin Dashboard</h1>

        {/* Mobile menu */}
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
            onClick={() => navigate('/admin/register')}
            className="block text-blue-600 font-medium hover:underline"
          >
            Register Student
          </button>
          <button
            onClick={() => navigate('/admin/requests')}
            className="block text-blue-600 font-medium hover:underline"
          >
            Manage Requests
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
          <p className="text-center">Loading...</p>
        ) : (
          <>
            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <h2 className="text-gray-600 font-medium">Total Students</h2>
                  <p className="text-2xl font-bold text-blue-700">{stats?.totalStudents}</p>
                </div>
                <UserPlus size={32} className="text-blue-600" />
              </div>

              <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <h2 className="text-gray-600 font-medium">Total Requests</h2>
                  <p className="text-2xl font-bold text-blue-700">{stats?.totalRequests}</p>
                </div>
                <FileText size={32} className="text-blue-600" />
              </div>
            </section>

            {/* Recent Requests Preview */}
            <section className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Recent Requests</h2>
                <button
                  onClick={() => navigate('/admin/requests')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>

              {recentRequests.length === 0 ? (
                <p>No recent requests</p>
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
                      {recentRequests.slice(0, 5).map((req) => (
                        <tr key={req._id} className="border-t">
                          <td className="p-2">{req.documentType}</td>
                          <td className="p-2">{req.purpose}</td>
                          <td className="p-2">{req.status}</td>
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

export default AdminDashboard;