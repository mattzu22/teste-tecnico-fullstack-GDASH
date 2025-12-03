import { Routes, Route } from 'react-router-dom';
import { WeatherDashboard } from '../pages/Dashboard';
import LoginPage from '../pages/Login';
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<WeatherDashboard />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};
