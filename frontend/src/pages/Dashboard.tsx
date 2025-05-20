import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="w-64 fixed h-full bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content - offset by sidebar width */}
      <div className="ml-64 flex-1 p-8">
        {/* Header with Actions */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setModalOpen(true)}
              variant="primary"
              text="Add Content"
              className="px-6 py-3 text-lg"
            />
            <Button
              onClick={() => setModalOpen(true)}
              variant="secondary"
              text="Share Content"
              className="px-6 py-3 text-lg border-2 border-gray-300"
            />
          </div>
        </div>

        {/* Larger Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <Card className="h-96" /> {/* Increased height */}
          <Card className="h-96" />
          <Card className="h-96" />
          <Card className="h-96" />
          <Card className="h-96" />
          <Card className="h-96" />
        </div>

        {/* Floating Logout Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg text-lg font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Add New Content</h2>
            {/* Form content would go here */}
            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={() => setModalOpen(false)}
                variant="secondary"
                text="Cancel"
                className="px-6 py-3 text-lg"
              />
              <Button
                onClick={() => setModalOpen(false)}
                variant="primary"
                text="Submit"
                className="px-6 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
