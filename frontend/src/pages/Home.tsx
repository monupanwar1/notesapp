import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => (
  <main className="min-h-screen flex flex-col justify-center items-center">
    <h1 className="text-4xl font-bold mb-4">Welcome to SecondBrain</h1>
    <p className="text-lg mb-6">Manage and share your brain.</p>
    <Link
      to="/signin"
      className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Sign In
    </Link>
  </main>
);

export default Home;