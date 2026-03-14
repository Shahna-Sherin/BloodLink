import { Link } from 'react-router-dom'
import { Droplets, ArrowRight, Heart } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Heart size={14} />
            AI-Powered Blood Donation Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Save Lives with
            <span className="text-red-500"> BloodLink</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Connect blood donors with patients in need using AI-powered matching,
            real-time alerts, and smart donor ranking. Every drop counts.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Become a Donor <ArrowRight size={18} />
            </Link>
            <Link
              to="/request"
              className="flex items-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Request Blood <Droplets size={18} />
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex gap-8 mt-12">
            <div>
              <p className="text-3xl font-bold text-red-500">10K+</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Donors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">5K+</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lives Saved</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">50+</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cities</p>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="flex justify-center">
          <div className="relative w-80 h-80">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-red-100 dark:border-red-900 animate-pulse"></div>
            {/* Middle ring */}
            <div className="absolute inset-8 rounded-full border-4 border-red-200 dark:border-red-800"></div>
            {/* Center */}
            <div className="absolute inset-16 rounded-full bg-red-500 flex items-center justify-center shadow-2xl">
              <Droplets size={64} className="text-white" />
            </div>
            {/* Floating badges */}
            <div className="absolute top-4 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              🧬 AI Matched
            </div>
            <div className="absolute bottom-8 left-0 bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              ⚡ Emergency Alerts
            </div>
            <div className="absolute bottom-0 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              📍 Near You
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}