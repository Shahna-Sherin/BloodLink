import { useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import client from '../api/client'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const urgencyLevels = ['Normal', 'Urgent', 'Emergency']

export default function BloodRequest() {
  const [form, setForm] = useState({
    patient_name: '', contact: '', hospital: '', location: '',
    blood_group: '', units_needed: '1', urgency: 'Normal', notes: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function urgencyColor(u) {
    if (u === 'Emergency') return 'bg-red-500 text-white border-red-500'
    if (u === 'Urgent') return 'bg-orange-400 text-white border-orange-400'
    return 'bg-green-500 text-white border-green-500'
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await client.post('/requests/create', {
        ...form,
        units_needed: parseInt(form.units_needed)
      })
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center max-w-md w-full shadow-sm">
          <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Blood request for <span className="font-semibold text-red-500">{form.blood_group}</span> has been submitted.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Urgency: <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              form.urgency === 'Emergency' ? 'bg-red-100 text-red-600' :
              form.urgency === 'Urgent' ? 'bg-orange-100 text-orange-600' :
              'bg-green-100 text-green-600'
            }`}>{form.urgency}</span>
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Nearby donors are being notified. You will receive a call shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm({ patient_name: '', contact: '', hospital: '', location: '', blood_group: '', units_needed: '1', urgency: 'Normal', notes: '' })
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Request Blood</h1>
          <p className="text-gray-500 dark:text-gray-400">Fill in the details and we'll find matching donors near you</p>
        </div>

        {/* Urgency selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Urgency Level</p>
          <div className="flex gap-3">
            {urgencyLevels.map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setForm({ ...form, urgency: u })}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                  form.urgency === u
                    ? urgencyColor(u)
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                {u === 'Emergency' ? '🚨' : u === 'Urgent' ? '⚡' : '✓'} {u}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient Name *</label>
              <input name="patient_name" value={form.patient_name} onChange={handle} required placeholder="Patient full name"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number *</label>
              <input name="contact" value={form.contact} onChange={handle} required placeholder="10-digit number"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group Needed *</label>
              <select name="blood_group" value={form.blood_group} onChange={handle} required
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400">
                <option value="">Select blood group</option>
                {bloodTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Units Needed *</label>
              <input name="units_needed" type="number" min="1" max="10" value={form.units_needed} onChange={handle} required
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hospital Name *</label>
              <input name="hospital" value={form.hospital} onChange={handle} required placeholder="Hospital name"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
              <input name="location" value={form.location} onChange={handle} required placeholder="City / District"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Notes</label>
            <textarea name="notes" value={form.notes} onChange={handle} rows={3} placeholder="Any additional information..."
              className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400 resize-none" />
          </div>

          <button type="submit" disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 ${
              form.urgency === 'Emergency' ? 'bg-red-500 hover:bg-red-600' :
              form.urgency === 'Urgent' ? 'bg-orange-400 hover:bg-orange-500' :
              'bg-green-500 hover:bg-green-600'
            }`}>
            {loading ? 'Submitting...' :
              form.urgency === 'Emergency' ? '🚨 Send Emergency Alert' :
              form.urgency === 'Urgent' ? '⚡ Submit Urgent Request' :
              '✓ Submit Blood Request'}
          </button>

        </form>
      </div>
    </div>
  )
}