import React from 'react';
import ReactDOM from 'react-dom/client';
import './components/css/index.css';
import App from './App';
import reportWebVitals from './utils/reportWebVitals';
import 'primeicons/primeicons.css'; // Import PrimeIcons CSS
import 'primereact/resources/themes/saga-blue/theme.css'; // Import PrimeReact theme CSS
import 'primereact/resources/primereact.min.css'; // Import PrimeReact CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
