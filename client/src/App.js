import React from 'react';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Masthead from './components/Masthead';
import Chatbot from './components/Chatbot';
import Service1 from './pages/Service1';
import Service2 from './pages/Service2';
import Project1 from './pages/Project1';
import Project2 from './pages/Project2';

function App() {
    return (
        <Router>
            <Header />
            <Masthead />
            <Chatbot />
            <Routes>
                <Route path="/service1" element={<Service1 />} />
                <Route path="/service2" element={<Service2 />} />
                <Route path="/project1" element={<Project1 />} />
                <Route path="/project2" element={<Project2 />} />
            </Routes>
        </Router>
    );
}

export default App;