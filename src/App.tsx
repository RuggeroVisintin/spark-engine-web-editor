import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Editor } from './pages/Editor';

export const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Editor />} />
            {/* Add more routes as needed */}
        </Routes>
    );
}