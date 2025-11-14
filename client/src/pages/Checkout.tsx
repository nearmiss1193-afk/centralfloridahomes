import { Link } from 'wouter';
import { useState } from 'react';

export default function Checkout() {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const plans = {
    starter: { name: 'Starter', price: 199, leads: 10, features: ['10 leads/month', 'Basic support', 'Email notifications'] },
    professional: { name: 'Professional', price: 299, leads: 30, features: ['30 leads/month', 'Priority support', 'Advanced analytics'] },
    premium: { name: 'Premium', price: 449, leads: 100, features: ['100 leads/month', '24/7 support', 'Custom integrations'] },
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checkout:', { plan: selectedPlan, ...formData });
    setSubmitted(true);
    setTimeout(() => {
      alert(`✅ Subscription to ${plans[selectedPlan as keyof typeof plans].name} plan initiated!\n\nName: ${formData.name}\nEmail: ${formData.email}`);
    }, 500);
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/">
            <button className="text-white mb-4 hover:underline text-lg">← Back to Home</button>
          </Link>
          <h1 className="text-4xl font-bold">Subscription Plans</h1>
          <p className="text-lg mt-2 opacity-90">Choose the perfect plan for your business</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`rounded-lg p-8 cursor-pointer transition-all transform ${
                selectedPlan === key
                  ? 'bg-blue-50 border-2 border-blue-500 shadow-xl scale-105'
                  : 'bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">${plan.price}</div>
                <p className="text-gray-600 text-sm">/month</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-2xl font-bold text-blue-600">{plan.leads}</p>
                <p className="text-gray-600">leads per month</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full font-bold py-3 px-6 rounded-lg transition-colors ${
                  selectedPlan === key
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                {selectedPlan === key ? '✓ Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Complete Your Purchase</h2>

            {submitted ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Order Confirmed!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for subscribing to the {currentPlan.name} plan.
                </p>
                <p className="text-gray-600 mb-6">
                  A confirmation email has been sent to {formData.email}
                </p>
                <Link href="/">
                  <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg">
                    Back to Home
                  </button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-bold text-gray-900">{currentPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Leads per month:</span>
                    <span className="font-bold text-gray-900">{currentPlan.leads}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-3xl font-bold text-green-600">${currentPlan.price}/mo</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-colors text-lg"
                >
                  Proceed to Payment
                </button>

                <p className="text-center text-gray-600 text-sm">
                  💳 Secure payment powered by Stripe
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
