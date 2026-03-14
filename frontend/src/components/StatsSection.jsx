import { Users, Heart, MapPin, Clock } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Registered Donors',
    desc: 'Active donors across India',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900',
  },
  {
    icon: Heart,
    value: '5,200+',
    label: 'Lives Saved',
    desc: 'Successful blood donations',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900',
  },
  {
    icon: MapPin,
    value: '50+',
    label: 'Cities Covered',
    desc: 'Expanding across India',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900',
  },
  {
    icon: Clock,
    value: '< 10 min',
    label: 'Avg Response Time',
    desc: 'AI-powered fast matching',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900',
  },
]

export default function StatsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            BloodLink is making a real difference — one donation at a time.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${stat.bg} mb-4`}>
                <stat.icon className={stat.color} size={28} />
              </div>
              <p className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-gray-800 dark:text-white font-semibold mb-1">{stat.label}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}