import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PendingApproval() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Under Review</h2>
          <p className="text-gray-500 mb-6">
            Your publisher account is currently under review. We'll notify you once it's approved.
            This typically takes 1–2 business days.
          </p>

          {user && (
            <div className="bg-gray-50 rounded-lg p-4 text-left mb-6 space-y-2 text-sm">
              <div><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-600">{user.name}</span></div>
              <div><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-600">{user.email}</span></div>
              {user.website && <div><span className="font-medium text-gray-700">Website:</span> <span className="text-gray-600">{user.website}</span></div>}
              {user.category && <div><span className="font-medium text-gray-700">Category:</span> <span className="text-gray-600 capitalize">{user.category}</span></div>}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
