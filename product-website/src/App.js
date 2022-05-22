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
import UploadLogPage from './pages/UploadLogPage';
import PersonalitySettings from './pages/PersonalitySettings';
import SelectGamePage from './pages/SelectGamePage';
import GameViewingPage from './pages/GameViewingPage';
import YourGamesPage from './pages/YourGamesPage';
import EditVideoPage from './pages/EditVideoPage';
import TTSTest from './pages/TTSTest';

export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/another_page" element={<Anotherpage />} />
          <Route path="/simulator" element={<ConnectToSimulatorPage />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/statistics" element={<GameStatistics/>}/>
          <Route path="/upload" element={<UploadLogPage/>}/>
          <Route path="/personality/:id" element={<PersonalitySettings/>}/>
          <Route path="/select_game" element={<SelectGamePage/>}/>
          <Route path="/game_viewing/:id" element={<GameViewingPage/>}/>
          <Route path="/your_games" element={<YourGamesPage/>}/>
          <Route path="/edit_video" element={<EditVideoPage/>}/>
          <Route path="/test_tts" element={<TTSTest/>}/>

        </Routes>
      </BrowserRouter>
    );
}

// export default App;
