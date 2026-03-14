import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import FeaturesSection from './components/FeaturesSection'
import DonorSearch from './pages/DonorSearch'
import DonorRegistration from './pages/DonorRegistration'
import BloodRequest from './pages/BloodRequest'
import AdminDashboard from './pages/AdminDashboard'
import CompatibilityChecker from './pages/CompatibilityChecker'

function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<DonorSearch />} />
        <Route path="/register" element={<DonorRegistration />} />
        <Route path="/request" element={<BloodRequest />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/compatibility" element={<CompatibilityChecker />} />
      </Routes>
    </div>
  )
}