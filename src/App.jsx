import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './app.css';
import routes, { renderRoutes } from '../src/routes';
import { Provider } from 'react-redux';
import store from './store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter basename={'/'}>{renderRoutes(routes)}</BrowserRouter>
    </Provider>
  );
};

export default App;
