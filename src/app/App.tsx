import { BrowserRouter, Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { NightlifePage } from './pages/NightlifePage';
import { WhosReadyPage } from './pages/WhosReadyPage';
import { PhotoAlbumPage } from './pages/PhotoAlbumPage';
import { SplitPaymentPage } from './pages/SplitPaymentPage';
import { FloatingNav } from './components/FloatingNav';

export default function App() {
  return (
    <BrowserRouter>
      <FloatingNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/nightlife" element={<NightlifePage />} />
        <Route path="/whos-ready" element={<WhosReadyPage />} />
        <Route path="/photo-album" element={<PhotoAlbumPage />} />
        <Route path="/split-payment" element={<SplitPaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}