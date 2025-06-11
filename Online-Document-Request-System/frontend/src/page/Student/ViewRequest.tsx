import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Topbar from '../../components/TopBar';
import { Pencil, Trash2, Save, X } from 'lucide-react';

interface Request {
  _id: string;
  documentType: string;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Ready';
  createdAt: string;
}

const ViewRequest: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ documentType: '', purpose: '' });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/requests');
        setRequests(res.data || []);
      } catch (err: any) {
        console.error('Error loading requests:', err);
        setErrorMsg('Failed to load requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const startEdit = (req: Request) => {
    setEditId(req._id);
    setEditForm({ documentType: req.documentType, purpose: req.purpose });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ documentType: '', purpose: '' });
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await api.put(`/requests/${id}`, editForm);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...res.data } : r))
      );
      cancelEdit();
    } catch (err: any) {
      console.error('Update failed:', err);
      alert(err.response?.data?.message || 'Failed to update request.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      await api.delete(`/requests/${id}`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.message || 'Failed to delete request.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar title="My Document Requests" />
      <main className="max-w-4xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">📁 My Document Requests</h1>

        {loading ? (
          <p>Loading...</p>
        ) : errorMsg ? (
          <p className="text-red-600">{errorMsg}</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-600">You have not made any document requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow text-sm md:text-base">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Document</th>
                  <th className="p-3 text-left">Purpose</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Requested On</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const isEditing = editId === req._id;

                  return (
                    <tr key={req._id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        {isEditing ? (
                          <select
                            value={editForm.documentType}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, documentType: e.target.value }))
                            }
                            className="border rounded px-2 py-1 w-full"
                          >
                            <option value="Transcript">Transcript</option>
                            <option value="Certificate of Enrollment">
                              Certificate of Enrollment
                            </option>
                            <option value="Good Moral">Good Moral</option>
                            <option value="Diploma">Diploma</option>
                          </select>
                        ) : (
                          req.documentType
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            value={editForm.purpose}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, purpose: e.target.value }))
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          req.purpose
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            req.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : req.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : req.status === 'Declined'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleDateString()}{' '}
                        <span className="text-xs text-gray-500">
                          {new Date(req.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="p-3 space-x-2">
                        {req.status === 'Pending' &&
                          (isEditing ? (
                            <>
                              <button
                                onClick={() => handleUpdate(req._id)}
                                className="text-green-600 hover:text-green-800"
                                title="Save"
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-600 hover:text-gray-800"
                                title="Cancel"
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(req)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(req._id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewRequest;