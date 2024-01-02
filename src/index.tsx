import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('container')
);



/* react 18 önceki sürümler için bu kodda çalıştırmaktadır.
import React from 'react';
import {createRoot } from 'react-dom/client';
import Tablo from './components/Tablo';
createRoot(document.getElementById('container')).render(<Tablo/>);
*/