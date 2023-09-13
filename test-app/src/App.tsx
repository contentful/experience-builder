import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import './App.css';
import { Button } from '@contentful/experience-builder-components';

function App() {

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button>Test</Button>
      </div>
    </>
  );
}

export default App;
