import { useRef, useState } from 'react';
import axios from 'axios';

import { CrossIcon } from '../icons/CrossIcon';
import { Button } from './Button';
import Input from './Input';
import { useContent } from '@/hooks/useContent';

const BACKEND_URL = 'http://localhost:3000/api/v1/addContent';

enum ContentType {
  Youtube = 'youtube',
  Twitter = 'twitter',
}

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModel({ open, onClose }: CreateContentModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ContentType>(ContentType.Youtube);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    const token = localStorage.getItem('token');

    if (!token || !title || !link) {
      alert(token ? 'Please fill all fields' : 'You are not logged in!');
      return;
    }

    try {
      const response = await axios.post(
        BACKEND_URL,
        { title, link, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Added content:', response.data.content); // Debug
      onClose();
      // Trigger a refetch here if using a state manager
    } catch (error) {
      console.error('Failed to add content:', error);
      alert('Failed to add content. Please try again.');
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-slate-500 opacity-60 z-40"></div>

      {/* Modal box */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded p-6 w-96 relative">
          {/* Close button */}
          <div className="flex justify-end cursor-pointer" onClick={onClose}>
            <CrossIcon />
          </div>

          {/* Form inputs */}
          <div className="flex flex-col gap-4">
            <Input reference={titleRef} placeholder="Title" />
            <Input reference={linkRef} placeholder="Link" />

            <div>
              <h2 className="mb-2 font-semibold">Content Type</h2>
              <div className="flex gap-2">
                <Button
                  variant={
                    type === ContentType.Youtube ? 'primary' : 'secondary'
                  }
                  text="YouTube"
                  onClick={() => setType(ContentType.Youtube)}
                />
                <Button
                  variant={
                    type === ContentType.Twitter ? 'primary' : 'secondary'
                  }
                  text="Twitter"
                  onClick={() => setType(ContentType.Twitter)}
                />
              </div>
            </div>

            <Button onClick={addContent} variant="primary" text="Submit" />
          </div>
        </div>
      </div>
    </>
  );
}
