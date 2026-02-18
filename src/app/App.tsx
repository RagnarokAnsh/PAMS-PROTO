import { Toaster } from 'sonner';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { UserProvider } from './context/UserContext';
import { MockDataProvider } from './context/MockDataContext';

function App() {
  return (
    <UserProvider>
      <MockDataProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </MockDataProvider>
    </UserProvider>
  );
}

export default App;
