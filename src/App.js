import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Contract from './components/Contract';
import Interaction from './components/Interaction';
import './App.css';

const App = () => {
  return (
    <Router>
          <Header />
            <Routes>
            <Route path="/" element={<Home />} />
              <Route path="/contract/:id" element={<Contract />} />
              <Route path="/contract/:id/:inx" element={<Contract />} />
              <Route path="/allinteraction/" element={<Interaction />} />
            </Routes>
    </Router>
  );
};

export default App;
