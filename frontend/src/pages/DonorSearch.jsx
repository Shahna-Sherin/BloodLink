import { useState, useEffect } from 'react'
import { Search, MapPin, Star, RefreshCw, X } from 'lucide-react'
import client from '../api/client'

const bloodTypes = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

function RequestModal({ donor, onClose }) {
  const [form, setForm] = useState({
    requester_name: '',
    requester_contact: '',
    location: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  async function handleSubmit() {
    if (!form.requester_name || !form.requester_contact || !form.location) {
      setStatus({ success: false, message: 'Please fill all required fields.' })
      return
    }
    setLoading(true)
    try {
      const res = await client.post('/donors/request-donor', {
        donor_name: donor.name,
        requester_name: form.requester_name,
        requester_contact: form.requester_contact,
        blood_group: donor.blood_group,
        location: form.location,
        message: form.message
      })
      setStatus({ success: true, message: res.data.message })
    } catch (err) {
      setStatus({ success: false, message: 'Failed to send request. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request Donor</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sending request to <span className="text-red-500 font-medium">{donor.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors">
            <X size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Donor info - email and contact hidden for privacy */}
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900 rounded-xl p-4 mb-6">
          <div className="text-3xl font-bold text-red-500">{donor.blood_group}</div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{donor.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{donor.current_locality}, {donor.place_of_residence}</p>
          </div>
        </div>

        {/* Form */}
        {!status?.success && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.requester_name}
                onChange={e => setForm({ ...form, requester_name: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Contact Number *</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={form.requester_contact}
                onChange={e => setForm({ ...form, requester_contact: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Hospital / Location *</label>
              <input
                type="text"
                placeholder="Enter hospital or location"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Message (optional)</label>
              <textarea
                placeholder="Any additional information..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white outline-none focus:border-red-400 resize-none"
              />
            </div>

            {status && !status.success && (
              <p className="text-red-500 text-sm">{status.message}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {loading ? '📨 Sending...' : '🩸 Send Donation Request'}
            </button>
          </div>
        )}

        {/* Success */}
        {status?.success && (
          <div className="text-center py-6">
            <p className="text-5xl mb-4">✅</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">Request Sent!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{status.message}</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DonorSearch() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState(null)

  async function fetchDonors() {
    setLoading(true)
    setError(null)
    try {
      const res = await client.get('/donors/')
      setDonors(res.data)
    } catch (err) {
      setError('Failed to load donors. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDonors() }, [])

  const filtered = donors.filter(d => {
    const matchType = selectedType === 'All' || d.blood_group === selectedType
    const matchSearch =
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.place_of_residence?.toLowerCase().includes(search.toLowerCase()) ||
      d.current_locality?.toLowerCase().includes(search.toLowerCase())
    const matchAvail = showAvailableOnly ? d.availability : true
    return matchType && matchSearch && matchAvail
  })

  function scoreColor(score) {
    if (score >= 0.85) return 'text-green-500'
    if (score >= 0.65) return 'text-yellow-500'
    return 'text-red-400'
  }

  function scoreBg(score) {
    if (score >= 0.85) return 'bg-green-50 dark:bg-green-900'
    if (score >= 0.65) return 'bg-yellow-50 dark:bg-yellow-900'
    return 'bg-red-50 dark:bg-red-900'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      {selectedDonor && (
        <RequestModal donor={selectedDonor} onClose={() => setSelectedDonor(null)} />
      )}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Find a Donor</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {loading ? 'Loading...' : `${donors.length} donors — AI-ranked by health score, donation history & weight`}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none text-gray-700 dark:text-white w-full text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={e => setShowAvailableOnly(e.target.checked)}
              className="accent-red-500"
            />
            Available only
          </label>
          <button
            onClick={fetchDonors}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {bloodTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-red-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-xl p-4 mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-gray-400">
            <RefreshCw size={32} className="animate-spin mx-auto mb-4" />
            Loading donors...
          </div>
        )}

        {!loading && <p className="text-sm text-gray-400 mb-4">{filtered.length} donors found</p>}

        <div className="grid gap-4">
          {!loading && filtered.length === 0 && (
            <div className="text-center text-gray-400 py-20">No donors found.</div>
          )}
          {filtered.map((donor, i) => (
            <div
              key={donor.id || i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-500 font-bold text-sm flex-shrink-0">
                  #{i + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{donor.name}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin size={11} /> {donor.current_locality}, {donor.place_of_residence}
                    </span>
                    {/* contact number removed for privacy */}
                  </div>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-400">Age: {donor.age}</span>
                    <span className="text-xs text-gray-400">Weight: {donor.weight}kg</span>
                    <span className="text-xs text-gray-400">Donations: {donor.total_donations}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">{donor.blood_group}</p>
                  <p className="text-xs text-gray-400">Blood Type</p>
                </div>

                <div className={`text-center px-3 py-2 rounded-xl ${scoreBg(donor.ml_score)}`}>
                  <div className="flex items-center gap-1 justify-center">
                    <Star size={13} className={scoreColor(donor.ml_score)} />
                    <p className={`text-lg font-bold ${scoreColor(donor.ml_score)}`}>
                      {Math.round((donor.ml_score || 0) * 100)}%
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">ML Score</p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  donor.availability
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {donor.availability ? '✅ Available' : '❌ Unavailable'}
                </span>

                <button
                  onClick={() => setSelectedDonor(donor)}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  🩸 Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}