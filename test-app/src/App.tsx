import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Page from './Page';
import { StaticPage } from './StaticPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Page />,
  },
  {
    path: '/static-page',
    element: <StaticPage />
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
