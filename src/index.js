import App from './App';
import { createRoot } from 'react-dom/client';
import { passiveSupport } from 'passive-events-support/src/utils'

passiveSupport(['mousewheel', 'touchstart']);

const root = createRoot(document.getElementById('root'));

root.render(<App />);
