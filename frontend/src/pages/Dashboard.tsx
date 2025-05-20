import { useEffect, useState } from 'react';
import { useContent } from '../hooks/useContent'; // Custom hook to fetch content
import axios from 'axios'; // For HTTP requests
import Sidebar from '@/components/Sidebar';
import { CreateContentModel } from '@/components/CreateContentModel';
import { Button } from '@/components/Button';
import {Card} from '@/components/Card'; // Assuming you have a Card component
const BACKEND_URL = 'http://localhost:3000/api/v1/brain/share';

export  default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { content, refresh } = useContent();

  useEffect(() => {
    refresh();
  }, [modalOpen]);

  return (
    <div>
      <Sidebar />
      <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
        <CreateContentModel
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        <div className="flex justify-end gap-4">
          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            text="Add content"
          />

          <Button
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                if (!token) {
                  alert('You need to be logged in to share.');
                  return;
                }

                const response = await axios.post(
                  BACKEND_URL,
                  { share: true },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
                alert(`Share this link: ${shareUrl}`);
              } catch (error) {
                console.error('Error sharing brain:', error);
                alert('Failed to share brain content.');
              }
            }}
            variant="secondary"
            text="Share brain"
          />
        </div>
          

        <div className="flex gap-4 flex-wrap">
          {content.map(({ type, link, title }) => (
            <Card key={link} type={type} link={link} title={title} />
          ))}
        </div>
      </div>
    </div>
  );
}
