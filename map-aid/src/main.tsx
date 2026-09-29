import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import MapAidScenes from './MapAidScenes.tsx';
import './index.css';

const scene = new URLSearchParams(window.location.search).get('scene');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {scene ? <MapAidScenes scene={scene} /> : <App />}
  </StrictMode>,
);
