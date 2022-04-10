// React
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// CSS
import './App.css';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import Homepage from './pages/homepage';

class App extends Component {
  render() {
    return <Homepage></Homepage>
  }
}

export default App;
