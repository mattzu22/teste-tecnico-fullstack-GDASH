import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeatherDashboard } from '../pages/Dashboard';
import Signin from '../pages/Auth/Signin';
import { PrivateRoute } from './PrivateRoute';
import Signup from '@/pages/Auth/Signup';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <WeatherDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
