import { Button } from "@/components/Button";
import Input from "@/components/Input";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = 'http://localhost:3000/api/v1/signin';

export default function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  async function signinHandler() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
     const response= await axios.post(BACKEND_URL, {
        username,
        password, 
      });

      const jwt =response.data.token;
      localStorage.setItem("token" ,jwt)
      navigate('/dashboard');
      alert('You have signin up successfully!');
    } catch (error) {
      console.error('Signin failed:', error);
      alert('Signin failed. Please try again.');
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
           onClick={signinHandler}
            loading={false}
            variant="primary"
            text="Signin"
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}
