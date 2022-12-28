import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Profile from './components/Profile';
import CUReview from './components/review/CUReview';
import ReviewDetail from './components/review/ReviewDetail';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/review/add" element={<CUReview edit={false} />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
        <Route path="/review/edit/:id" element={<CUReview edit={true} />} />
      </Routes>
    </ScrollToTop>
  );
}

export default App;
