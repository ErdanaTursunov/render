import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './store/authContext';
import { TestProvider } from './store/testContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <TestProvider>
        <App />
      </TestProvider>
    </AuthProvider>  
  </React.StrictMode>
);


