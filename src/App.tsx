import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AssessmentPage } from './pages/AssessmentPage';
import { CriticalInformationPage } from './pages/CriticalInformationPage';
import { supabase } from './lib/supabase';
import './index.css';

// Mock data for development - replace with actual data fetching
const mockAssessments = [
  {
    id: '1',
    service_user_name: 'Peter Hamilton',
    status: 'draft',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
];

// Simple Assessments List Page
const AssessmentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: usersData, error } = await supabase
          .from('service_users')
          .select('id, full_name, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error);
        } else {
          setUsers(usersData || []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewCarePlan = (userId: string) => {
    // Navigate to critical information page with user ID as a query parameter
    navigate(`/critical-information?userId=${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Care Assessments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and review care needs assessments
            </p>
          </div>
          
          <div className="p-6">
            <div className="text-center py-12">
              <a
                href="/assessment"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Assessment
              </a>
            </div>
          </div>
        </div>

        {/* Care Plans Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Care Plans</h2>
            <p className="mt-1 text-sm text-gray-500">
              View care plans for all service users
            </p>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">No service users have been created yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {user.full_name || 'Unnamed User'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {user.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewCarePlan(user.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        View Care Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/assessments" replace />} />
          <Route path="/assessments" element={<AssessmentsListPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/assessment/:id" element={<AssessmentPage />} />
          <Route path="/critical-information" element={<CriticalInformationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
