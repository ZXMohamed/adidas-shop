import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './redux/store';


import 'bootstrap/dist/css/bootstrap.min.css';

import 'swiper/css';
import 'swiper/css/navigation';

import "./css/screens.css"
import "./css/index.css"
import "./css/store.css"
import "./css/view.css"
import "./css/signup.css"
import "./css/saves.css"
import "./css/range.css"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Provider store={store}>
      <App />
    </Provider>

);


//reportWebVitals();