import React, { useState } from 'react';
import api from '../../api/axios';
import TopBar from '../../components/TopBar';

const RegisterStudent: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerMsg, setRegisterMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterMsg('');

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        role: 'student', // Optional if API sets default, but safe to include
      });

      setRegisterMsg('✅ Student registered successfully.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setRegisterMsg(err.response?.data?.message || '❌ Failed to register student.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar title="Register Student" />
      <main className="p-4 max-w-xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Student</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Register Student
            </button>
          </form>
          {registerMsg && (
            <p
              className={`mt-4 text-sm ${
                registerMsg.includes('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {registerMsg}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default RegisterStudent;