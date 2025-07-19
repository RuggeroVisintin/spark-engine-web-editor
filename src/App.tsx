import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Editor } from './pages/Editor';
import { Scripting } from './pages';

export const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Editor />} />
            <Route path="/scripting" element={<Scripting />} />
            {/* Add more routes as needed */}
        </Routes>
    );
}