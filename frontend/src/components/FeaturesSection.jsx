import { Brain, Zap, GitBranch, Shield, Search, Bell } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Donor Matching',
    desc: 'Machine learning ranks donors by compatibility, proximity, and health score for the best match.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900',
  },
  {
    icon: GitBranch,
    title: 'Knowledge Graph',
    desc: 'Neo4j powered GraphRAG understands donor-patient relationships and blood type compatibility.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900',
  },
  {
    icon: Zap,
    title: 'Emergency Alerts',
    desc: 'Instant notifications sent to nearby eligible donors during critical blood shortage emergencies.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900',
  },
  {
    icon: Search,
    title: 'Smart Search',
    desc: 'Search donors by blood type, location, and availability with real-time ML ranking scores.',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900',
  },
  {
    icon: Bell,
    title: 'Real-time Updates',
    desc: 'Live status updates on blood requests and donor availability across all cities.',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900',
  },
  {
    icon: Shield,
    title: 'Verified Donors',
    desc: 'All donors are verified with health screening scores to ensure safe and reliable donations.',
    color: 'text-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-900',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose BloodLink?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Powered by AI, GraphRAG, and real-time data to save lives faster than ever.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 hover:shadow-xl transition-shadow group"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.bg} mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className={feature.color} size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-red-500 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Save a Life Today?
          </h3>
          <p className="text-red-100 mb-8 text-lg">
            Join thousands of donors making a difference every day.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/register" className="bg-white text-red-500 font-semibold px-8 py-3 rounded-full hover:bg-red-50 transition-colors">
              Register as Donor
            </a>
            <a href="/search" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-red-600 transition-colors">
              Find Donors
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}