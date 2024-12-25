import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import GoogleLoginButton from './components/GoogleLoginButton';
import Dashboard from './components/Dashboard';

function App() {
  return (
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <header className="App-header">
              <img src="./logo.svg" className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
              <GoogleLoginButton />
            </header>
          }
        />
        {/* Dashboard Route */}
        <Route path="dashboard/*" element={<Dashboard />} />
      </Routes>
  );
}

export default App;


