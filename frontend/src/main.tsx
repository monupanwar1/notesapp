import { StrictMode } from 'react'
import Home from './pages/Home.tsx';
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './pages/Signup.tsx';
import Signin from './pages/Signin.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const router= createBrowserRouter([
  {
    path:"/",
    element:<Home/> 
  },
  {
    path:"/signup",
    element:<Signup/> 
  },
  {
    path:"/signin",
    element:<Signin/> 
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>
    )
  }
])
  

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
