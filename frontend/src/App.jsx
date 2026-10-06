import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <AppRoutes />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
