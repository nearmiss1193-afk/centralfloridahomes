import { Link } from 'wouter';
import { useState } from 'react';

export default function AgentSignup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert(`✅ Application submitted!\n\nWe'll review your application and contact you at ${formData.email} within 24 hours.`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/">
            <a className="text-white mb-4 hover:underline text-lg block">← Back to Home</a>
          </Link>
          <h1 className="text-4xl font-bold">Become an Agent Partner</h1>
          <p className="text-lg mt-2 opacity-90">Join Central Florida's leading real estate network</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefits */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Join Us?</h2>
            <div className="space-y-4">
              {[
                { icon: '📊', title: 'Premium Leads', desc: 'Access to qualified buyer and seller leads' },
                { icon: '💰', title: 'Competitive Commissions', desc: 'Industry-leading commission rates' },
                { icon: '🛠️', title: 'Advanced Tools', desc: 'CRM, marketing tools, and analytics' },
                { icon: '👥', title: 'Agent Support', desc: '24/7 support from our team' },
                { icon: '📈', title: 'Growth Opportunities', desc: 'Expand your business with our network' },
                { icon: '🎓', title: 'Training', desc: 'Ongoing training and resources' },
              ].map((benefit, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">{benefit.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Apply Now</h3>

              {submitted ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h4 className="text-2xl font-bold text-green-600 mb-2">Application Submitted!</h4>
                  <p className="text-gray-600 mb-4">
                    Thank you for your interest in joining Central Florida Homes.
                  </p>
                  <p className="text-gray-600 mb-6">
                    We'll review your application and contact you within 24 hours.
                  </p>
                  <Link href="/">
                    <a className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg text-center">
                      Back to Home
                    </a>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      ℹ️ By applying, you agree to our terms and conditions. We'll contact you to discuss partnership opportunities.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors text-lg"
                  >
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
