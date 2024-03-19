import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Page from './Page';
// import SpaceSelector from './components/SpaceSelector';
import { ContentfulConfigProvider } from './utils/ContentfulConfigProvider';

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
  return (
    <ContentfulConfigProvider>
      <RouterProvider router={router} />
      {/* <SpaceSelector /> */}
    </ContentfulConfigProvider>
  );
}

export default App;
