import React, { useState } from 'react';
import api from '../../api/axios';
import Topbar from '../../components/TopBar';
import { useNavigate } from 'react-router-dom';

const RequestDocument: React.FC = () => {
  const [documentType, setDocumentType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [numberOfCopies, setNumberOfCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (numberOfCopies < 1 || numberOfCopies > 5) {
      setErrorMsg('Number of copies must be between 1 and 5.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/requests', {
        documentType,
        purpose,
        numberOfCopies,
      });

      setSuccessMsg('Document request submitted successfully!');
      setDocumentType('');
      setPurpose('');
      setNumberOfCopies(1);
    } catch (err: any) {
      console.error('Request error:', err);
      const backendMsg = err?.response?.data?.message;
      if (backendMsg?.includes('numberOfCopies')) {
        setErrorMsg('Number of copies must be between 1 and 5.');
      } else {
        setErrorMsg(backendMsg || 'Failed to submit request.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar title="Request Document" />

      <main className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">📄 Request a Document</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Document Type */}
          <div>
            <label htmlFor="documentType" className="block text-gray-700 font-medium mb-1">
              Document Type
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a document</option>
              <option value="Transcript">Transcript</option>
              <option value="Certificate of Enrollment">Certificate of Enrollment</option>
              <option value="Good Moral">Good Moral</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label htmlFor="purpose" className="block text-gray-700 font-medium mb-1">
              Purpose
            </label>
            <input
              id="purpose"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              placeholder="E.g., Job application, Scholarship, etc."
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Number of Copies */}
          <div>
            <label htmlFor="copies" className="block text-gray-700 font-medium mb-1">
              Number of Copies (Max 5)
            </label>
            <input
              id="copies"
              type="number"
              min={1}
              max={5}
              value={numberOfCopies}
              onChange={(e) => setNumberOfCopies(Math.min(Number(e.target.value), 5))}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Messages */}
          {errorMsg && <p className="text-red-600">{errorMsg}</p>}
          {successMsg && <p className="text-green-600">{successMsg}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default RequestDocument;