import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import StudioExperiencePage from './src/pages/StudioExperiencePage';
import Index from './src/pages/index';

export const wrapRootElement = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:localeCode/:slug" element={<StudioExperiencePage />} />
        {/* Add more routes here to connect more components to Experiences */}
        {/* <Route path="homepage/:localeCode/:slug" element={<HomePage />} /> */}
        {/* <Route path="about/:localeCode/:slug" element={<AboutPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};
