// React
// import React, { Component } from 'react';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// CSS
import './App.css';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import Homepage from './pages/Homepage';
import Anotherpage from './pages/Anotherpage';
import ConnectToSimulatorPage from './pages/ConnectToSimulatorPage';
import Login from './pages/Login';
import GameStatistics from './pages/GameStatistics';

export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/another_page" element={<Anotherpage />} />
          <Route path="/simulator" element={<ConnectToSimulatorPage />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/statistics" element={<GameStatistics/>}/>
        </Routes>
      </BrowserRouter>
    );
}

// export default App;
