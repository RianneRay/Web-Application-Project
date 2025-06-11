import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import TopBar from '../../components/TopBar';

interface Request {
  _id: string;
  studentId: string;
  documentType: string;
  purpose: string;
  status: string;
  createdAt: string;
}

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, action: 'approve' | 'decline' | 'ready') => {
    try {
      await api.patch(`/admin/requests/${id}/${action}`);
      fetchRequests(); // Refresh
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar title="Manage Requests" />
      <main className="p-4 max-w-5xl mx-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Document</th>
                  <th className="p-2">Purpose</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Created</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} className="border-t">
                    <td className="p-2">{req.documentType}</td>
                    <td className="p-2">{req.purpose}</td>
                    <td className="p-2">{req.status}</td>
                    <td className="p-2">{new Date(req.createdAt).toLocaleString()}</td>
                    <td className="p-2 flex flex-wrap gap-2">
                      <button onClick={() => handleUpdateStatus(req._id, 'approve')} className="text-green-600 hover:underline">Approve</button>
                      <button onClick={() => handleUpdateStatus(req._id, 'decline')} className="text-red-600 hover:underline">Decline</button>
                      <button onClick={() => handleUpdateStatus(req._id, 'ready')} className="text-blue-600 hover:underline">Ready</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminRequests;