import { Link } from 'wouter';
import { useState } from 'react';
import { trpc } from '../lib/trpc';

export default function PropertyDetail() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    leadType: 'buyer' as const,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const submitLead = trpc.leads.submit.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitLead.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        propertyId: '123',
        leadType: formData.leadType,
        message: formData.message,
      });
      
      setSubmitted(true);
      setTimeout(() => {
        alert(`✅ Lead submitted successfully!\n\nWe'll contact you soon at ${formData.email}`);
      }, 500);
    } catch (error) {
      alert('Error submitting lead. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/properties">
            <a className="text-white mb-4 hover:underline text-lg block">← Back to Properties</a>
          </Link>
          <h1 className="text-4xl font-bold">Property Details</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Property Info */}
          <div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 h-96 rounded-lg mb-6 flex items-center justify-center">
              <div className="text-white text-8xl">🏠</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">123 Main Street</h2>
              <p className="text-gray-600 text-lg mb-6">Orlando, FL 32801</p>
              <p className="text-4xl font-bold text-green-600 mb-8">$350,000</p>

              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm">Bedrooms</p>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Bathrooms</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Sqft</p>
                  <p className="text-3xl font-bold text-gray-900">1,500</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">About This Property</h3>
                <p className="text-gray-600 leading-relaxed">
                  Beautiful home in the heart of Orlando with modern amenities. Features include updated kitchen, 
                  spacious living areas, and a well-maintained yard. Perfect for families or investors looking for 
                  a great property in a growing neighborhood.
                </p>
              </div>
            </div>
          </div>

          {/* Lead Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Interested in this property?</h3>

              {submitted ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h4 className="text-xl font-bold text-green-600 mb-2">Inquiry Submitted!</h4>
                  <p className="text-gray-600 mb-4">
                    Thank you for your interest. An agent will contact you shortly.
                  </p>
                  <Link href="/properties">
                    <a className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg text-center">
                      Back to Properties
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
                    <select
                      value={formData.leadType}
                      onChange={(e) => setFormData({...formData, leadType: e.target.value as any})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="investor">Investor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                    <textarea
                      placeholder="Tell us more about your interest..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitLead.isPending}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors text-lg"
                  >
                    {submitLead.isPending ? 'Submitting...' : 'Submit Inquiry'}
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
