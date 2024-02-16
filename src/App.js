import React from 'react';
import './assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import UnidadesFuncionales from './components/UnidadesFuncionales';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/UF" element={<UnidadesFuncionales />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
