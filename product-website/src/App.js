// React
import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// CSS
import './App.css';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import Homepage from './pages/Homepage';
import Anotherpage from './pages/Anotherpage';
import ConnectToSimulatorPage from './pages/ConnectToSimulatorPage';

export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/another_page" element={<Anotherpage />} />
          <Route path="/simulator" element={<ConnectToSimulatorPage />} />
        </Routes>
      </BrowserRouter>
    );
}

// export default App;
