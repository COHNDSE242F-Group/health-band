import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPage from './AdminPage';
import RegisterDoctor from './admin-reg-doc';  // make sure component name matches export
import AdminViewData from './AdminViewData';   // <-- import the view data component

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminPage />} />
      <Route path="/admin-reg-doc" element={<RegisterDoctor />} />
      <Route path="/view-doctors" element={<AdminViewData />} />  {/* add this */}
    </Routes>
  );
}
