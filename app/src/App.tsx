import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MainPage } from './views/mainPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <MainPage />
      <ToastContainer />
    </div>
  );
}

export default App;
