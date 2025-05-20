import { Button } from '@/components/Button';
import Input from '@/components/Input';
import { useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:3000/api/v1/signup';

export default function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  async function signupHandler() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post(BACKEND_URL, {
        username,
        password, // Changed from Password to password (convention)
      });
      navigate('/signin');
      alert('You have signed up successfully!');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-8">
        <Input reference={usernameRef} placeholder="Username" />

        <Input reference={passwordRef} placeholder="Password" />

        {/* Submit button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={signupHandler}
            loading={false}
            variant="primary"
            text="Sign Up" // Changed from "Signin" to "Sign Up"
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}
