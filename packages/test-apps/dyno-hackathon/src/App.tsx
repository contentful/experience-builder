import { BrowserRouter as Router, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
// import { ContentfulConfigProvider } from './providers/ContentfulConfig';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import HomePage from './pages/HomePage';
import { EditorMode as StudioExperiencesEditorMode } from './StudioExperiences/EditorMode';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/contentful-studio/editor/:slug',
    element: <StudioExperiencesEditorMode />,
  },
]);

function App() {
  // if (isExperienceEditorMode) {
  //   console.log('[Studio Experiences] editorMode enabled.');

  //   return (
  //     <ContentfulConfigProvider>
  //       <ExperienceRoot locale={localeCode} experience={experience} />;
  //     </ContentfulConfigProvider>
  //   );
  // }

  console.log('[ Dyno-hackathon ] <App> import.meta.env => ', import.meta.env);

  return (
    <Router>
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </Router>
  );
}

export default App;
