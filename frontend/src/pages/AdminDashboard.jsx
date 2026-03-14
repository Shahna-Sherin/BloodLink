import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import donorsData from '../api/donorsData'
import { Users, Heart, MapPin, TrendingUp } from 'lucide-react'

// Process real data
const totalDonors = donorsData.length
const available = donorsData.filter(d => d.availability).length
const unavailable = totalDonors - available
const totalDonations = donorsData.reduce((s, d) => s + d.total_donations, 0)

// Blood group distribution
const bloodGroupMap = {}
donorsData.forEach(d => {
  bloodGroupMap[d.blood_group] = (bloodGroupMap[d.blood_group] || 0) + 1
})
const bloodGroupData = Object.entries(bloodGroupMap)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value)

// Location distribution (top 8)
const locationMap = {}
donorsData.forEach(d => {
  const loc = d.place_of_residence
  locationMap[loc] = (locationMap[loc] || 0) + 1
})
const locationData = Object.entries(locationMap)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 8)

// Availability pie
const availData = [
  { name: 'Available', value: available },
  { name: 'Unavailable', value: unavailable }
]

// ML Score distribution
const scoreRanges = { 'Excellent (90-100%)': 0, 'Good (70-89%)': 0, 'Fair (<70%)': 0 }
donorsData.forEach(d => {
  const s = d.ml_score * 100
  if (s >= 90) scoreRanges['Excellent (90-100%)']++
  else if (s >= 70) scoreRanges['Good (70-89%)']++
  else scoreRanges['Fair (<70%)']++
})
const scoreData = Object.entries(scoreRanges).map(([name, value]) => ({ name, value }))

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']
const AVAIL_COLORS = ['#22c55e', '#d1d5db']

const stats = [
  { icon: Users, label: 'Total Donors', value: totalDonors, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900' },
  { icon: Heart, label: 'Available Now', value: available, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900' },
  { icon: TrendingUp, label: 'Total Donations', value: totalDonations, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900' },
  { icon: MapPin, label: 'Locations', value: Object.keys(locationMap).length, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900' },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Real-time insights from your BloodLink donor database</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${s.bg} mb-3`}>
                <s.icon className={s.color} size={22} />
              </div>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Blood Group Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Donors by Blood Group</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bloodGroupData}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {bloodGroupData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Availability Pie */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Donor Availability</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={availData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {availData.map((_, i) => <Cell key={i} fill={AVAIL_COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Location Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Locations</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={locationData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ML Score Pie */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">ML Score Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={scoreData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                  label={({ name, value }) => `${value}`}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#eab308" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}