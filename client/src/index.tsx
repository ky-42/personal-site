import ReactDOM from 'react-dom/client';
import App from './App';

// Adds fonts used on site
import './fonts/fonts.css';
import './fonts/JetBrainsMono.ttf';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
