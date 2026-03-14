import { useState } from 'react'
import { Droplets, CheckCircle } from 'lucide-react'
import client from '../api/client'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function DonorRegistration() {
  const [form, setForm] = useState({
    name: '', email: '', contact: '', place_of_residence: '',
    current_locality: '', age: '', weight: '', blood_group: '', availability: 'yes'
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await client.post('/donors/register', {
        ...form,
        age: parseInt(form.age),
        weight: parseFloat(form.weight),
        availability: form.availability === 'yes',
        months_since_last_donation: 0,
        total_donations: 0
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Thank you <span className="font-semibold text-red-500">{form.name}</span>, you are now registered as a donor!
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm({ name: '', email: '', contact: '', place_of_residence: '', current_locality: '', age: '', weight: '', blood_group: '', availability: 'yes' })
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full transition-colors"
          >
            Register Another
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
            <Droplets size={32} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Become a Donor</h1>
          <p className="text-gray-500 dark:text-gray-400">Fill in your details to join the BloodLink donor network</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <input name="name" value={form.name} onChange={handle} required placeholder="Your full name"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@email.com"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number *</label>
              <input name="contact" value={form.contact} onChange={handle} required placeholder="10-digit number"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group *</label>
              <select name="blood_group" value={form.blood_group} onChange={handle} required
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400">
                <option value="">Select blood group</option>
                {bloodTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Place of Residence *</label>
              <input name="place_of_residence" value={form.place_of_residence} onChange={handle} required placeholder="District"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Locality *</label>
              <input name="current_locality" value={form.current_locality} onChange={handle} required placeholder="City / Town"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age *</label>
              <input name="age" type="number" min="18" max="65" value={form.age} onChange={handle} required placeholder="e.g. 25"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg) *</label>
              <input name="weight" type="number" min="45" value={form.weight} onChange={handle} required placeholder="e.g. 65"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available?</label>
              <select name="availability" value={form.availability} onChange={handle}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-red-400">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition-colors mt-2">
            {loading ? 'Registering...' : 'Register as Donor'}
          </button>

        </form>
      </div>
    </div>
  )
}