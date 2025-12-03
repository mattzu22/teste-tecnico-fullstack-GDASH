import { BrowserRouter } from 'react-router';
import { AppRoutes } from './app.routes';

export const Routes = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
