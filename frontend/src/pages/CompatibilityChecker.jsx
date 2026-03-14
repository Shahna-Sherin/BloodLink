import { useState } from 'react'
import client from '../api/client'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function CompatibilityChecker() {
  const [donor, setDonor] = useState('')
  const [recipient, setRecipient] = useState('')
  const [result, setResult] = useState(null)
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(false)

  async function checkCompatibility() {
    if (!donor || !recipient) return
    setLoading(true)
    try {
      const res = await client.get(`/graph/check/${donor}/${recipient}`)
      setResult(res.data)
    } catch (err) {
      setResult({ error: 'Failed to check compatibility' })
    } finally {
      setLoading(false)
    }
  }

  async function findDonors() {
    if (!recipient) return
    setLoading(true)
    try {
      const res = await client.get(`/graph/compatible-donors/${recipient}`)
      setDonors(res.data.compatible_donors)
      setResult(null)
    } catch (err) {
      setDonors([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-red-100 dark:bg-red-900 text-red-500 text-sm font-medium px-4 py-1 rounded-full mb-4">
            🧬 Neo4j GraphRAG Powered
          </span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Blood Compatibility Checker
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Check blood type compatibility instantly using our knowledge graph
          </p>
        </div>

        {/* Checker Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Check Compatibility
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Donor */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Donor Blood Type
              </label>
              <div className="flex flex-wrap gap-2">
                {bloodTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setDonor(type)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      donor === type
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Recipient Blood Type
              </label>
              <div className="flex flex-wrap gap-2">
                {bloodTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setRecipient(type)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      recipient === type
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected display */}
          {(donor || recipient) && (
            <div className="flex items-center justify-center gap-6 py-4 mb-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">{donor || '?'}</p>
                <p className="text-xs text-gray-400 mt-1">Donor</p>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">{recipient || '?'}</p>
                <p className="text-xs text-gray-400 mt-1">Recipient</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={checkCompatibility}
              disabled={!donor || !recipient || loading}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Checking...' : '🔍 Check Compatibility'}
            </button>
            <button
              onClick={findDonors}
              disabled={!recipient || loading}
              className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Finding...' : '🩸 Find All Compatible Donors'}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && !result.error && (
          <div className={`rounded-2xl p-8 text-center shadow-sm mb-6 ${
            result.compatible
              ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700'
          }`}>
            <p className="text-6xl mb-4">{result.compatible ? '✅' : '❌'}</p>
            <p className={`text-2xl font-bold mb-2 ${result.compatible ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
              {result.message}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {result.compatible
                ? `${result.donor} donors can safely donate to ${result.recipient} recipients`
                : `${result.donor} donors cannot donate to ${result.recipient} recipients`}
            </p>
          </div>
        )}

        {/* Compatible donors list */}
        {donors.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Compatible Blood Types for {recipient}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              These blood types can safely donate to {recipient} recipients
            </p>
            <div className="flex flex-wrap gap-3">
              {donors.map(type => (
                <div
                  key={type}
                  className="flex flex-col items-center bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl px-6 py-4"
                >
                  <p className="text-2xl font-bold text-green-600 dark:text-green-300">{type}</p>
                  <p className="text-xs text-gray-400 mt-1">Can donate</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            📊 Blood Type Compatibility Chart
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left py-2 pr-4">Blood Type</th>
                  <th className="text-left py-2 pr-4">Can Donate To</th>
                  <th className="text-left py-2">Can Receive From</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { type: 'O-', donate: 'Everyone', receive: 'O-' },
                  { type: 'O+', donate: 'O+, A+, B+, AB+', receive: 'O+, O-' },
                  { type: 'A-', donate: 'A-, A+, AB-, AB+', receive: 'A-, O-' },
                  { type: 'A+', donate: 'A+, AB+', receive: 'A+, A-, O+, O-' },
                  { type: 'B-', donate: 'B-, B+, AB-, AB+', receive: 'B-, O-' },
                  { type: 'B+', donate: 'B+, AB+', receive: 'B+, B-, O+, O-' },
                  { type: 'AB-', donate: 'AB-, AB+', receive: 'A-, B-, AB-, O-' },
                  { type: 'AB+', donate: 'AB+ only', receive: 'Everyone' },
                ].map(row => (
                  <tr key={row.type} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-2 pr-4 font-bold text-red-500">{row.type}</td>
                    <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{row.donate}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-300">{row.receive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}