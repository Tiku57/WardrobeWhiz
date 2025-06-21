// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddItemPage from './pages/AddItemPage';
import ViewItemsPage from './pages/ViewItemsPage';
// Removed: import EditItemPage from './pages/EditItemPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<ViewItemsPage />} /> {/* Home page */}
          <Route path="/add-item" element={<AddItemPage />} />
          <Route path="/view-items" element={<ViewItemsPage />} />
          {/* Removed: <Route path="/edit-item/:id" element={<EditItemPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;