import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './app.css';
import routes, { renderRoutes } from '../src/routes';
import { Provider } from 'react-redux';
import store from './store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ToastContainer />
        <BrowserRouter basename={'/'}>{renderRoutes(routes)}</BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
