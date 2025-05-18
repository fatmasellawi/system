import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Redux & RTK Query
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import globalReducer from './state';
import { api } from './state/api'; // ✅ Assure-toi que ce fichier existe et contient une exportation nommée `api`

import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer, // ✅ api.reducerPath est bien défini dans ton fichier ./state/api.js
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// RTK Query: active refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
