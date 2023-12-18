import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Page from './Page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Page />,
  },
  {
    path: '/:slug',
    element: <Page />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
