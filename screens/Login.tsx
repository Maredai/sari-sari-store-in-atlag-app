
import React, { useState } from 'react';
import { useApp } from '../store';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const { login, register } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(id.trim());
    if (!success) alert("Invalid ID. Check the examples below.");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = await register(regName);
    alert(`Registration successful! Your ID is: ${newUser.id}\nPlease use this to login.`);
    setId(newUser.id);
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FDF7F5]">
      <div className="w-full max-w-sm space-y-8 text-center bg-white p-8 rounded-[2rem] shadow-xl shadow-orange-100">
        <div className="space-y-2">
          <div className="w-20 h-20 bg-orange-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-orange-200 mb-4 transition-transform hover:scale-105">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {isRegistering ? 'Join Store' : 'Welcome'}
          </h2>
          <p className="text-slate-500 text-sm">
            {isRegistering ? 'Enter your name to generate an ID' : 'Sign in to order your favorites'}
          </p>
        </div>

        {isRegistering ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-center font-medium"
              required
            />
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-lg">
              Create Account
            </button>
            <button type="button" onClick={() => setIsRegistering(false)} className="text-sm text-orange-600 font-bold">Back to Login</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value.toUpperCase())}
              placeholder="CUST-001"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-center tracking-widest font-mono text-lg"
              required
            />
            <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-200">
              Enter Store
            </button>
            <div className="pt-4 space-y-2">
              <button type="button" onClick={() => setIsRegistering(true)} className="text-sm text-slate-400 hover:text-orange-600 font-medium">New customer? Sign up here</button>
              <div className="text-[10px] text-slate-300 uppercase tracking-widest font-bold pt-4 border-t border-slate-50">Demo IDs</div>
              <div className="flex justify-center gap-4 text-xs font-mono font-bold text-slate-400">
                <span>CUST-001</span>
                <span>ADMIN-001</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
