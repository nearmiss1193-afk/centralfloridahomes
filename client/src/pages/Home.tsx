import { Link } from 'wouter';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold">Central Florida Homes</h1>
          <p className="text-lg mt-2 opacity-90">Find Your Perfect Property Today</p>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Central Florida Homes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover premium properties, connect with top agents, and grow your real estate business with our platform.
          </p>
        </section>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Card 1: Browse Properties */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 border-t-4 border-blue-500">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Browse Properties</h3>
            <p className="text-gray-600 mb-6">
              Explore our extensive listing of homes in Central Florida. Find your dream property with advanced filters.
            </p>
            <Link href="/properties">
              <a className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center">
                View Properties →
              </a>
            </Link>
          </div>

          {/* Card 2: Agent Signup */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 border-t-4 border-green-500">
            <div className="text-4xl mb-4">👔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Become an Agent</h3>
            <p className="text-gray-600 mb-6">
              Join our network of professional real estate agents. Access premium leads and grow your business.
            </p>
            <Link href="/agent-signup">
              <a className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center">
                Apply Now →
              </a>
            </Link>
          </div>

          {/* Card 3: Subscriptions */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 border-t-4 border-purple-500">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Subscription Plans</h3>
            <p className="text-gray-600 mb-6">
              Choose the perfect plan for your needs. Get access to leads, tools, and support.
            </p>
            <Link href="/checkout">
              <a className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center">
                View Plans →
              </a>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-12 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <p className="text-lg opacity-90">Properties Listed</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-lg opacity-90">Active Agents</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-lg opacity-90">Happy Customers</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Central Florida Homes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
