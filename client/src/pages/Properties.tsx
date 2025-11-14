import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '../lib/trpc';

export default function Properties() {
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Fetch properties from backend
  const { data: properties = [], isLoading, error } = trpc.properties.list.useQuery({
    city: city || undefined,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/">
            <a className="text-white mb-4 hover:underline text-lg block">← Back to Home</a>
          </Link>
          <h1 className="text-4xl font-bold">Properties</h1>
          <p className="text-lg mt-2 opacity-90">Find your perfect home</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Search Properties</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                placeholder="e.g., Orlando"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="$200,000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="$500,000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading properties...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">Error loading properties</p>
            </div>
          )}

          {!isLoading && properties.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-blue-700 text-lg">No properties found. Try adjusting your search criteria.</p>
            </div>
          )}

          {!isLoading && properties.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {properties.length} Properties Found
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {properties.map((prop: any) => (
                  <div key={prop.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-48 flex items-center justify-center">
                      <div className="text-white text-6xl">🏠</div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{prop.address || 'Property'}</h3>
                      <p className="text-gray-600 mb-4">{prop.city || 'Central Florida'}, FL</p>
                      <p className="text-3xl font-bold text-green-600 mb-4">
                        ${prop.price ? prop.price.toLocaleString() : 'N/A'}
                      </p>
                      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                        <div>
                          <p className="text-gray-600 text-sm">Bedrooms</p>
                          <p className="text-2xl font-bold text-gray-900">{prop.beds || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Bathrooms</p>
                          <p className="text-2xl font-bold text-gray-900">{prop.baths || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Sqft</p>
                          <p className="text-2xl font-bold text-gray-900">{prop.sqft ? prop.sqft.toLocaleString() : '-'}</p>
                        </div>
                      </div>
                      <Link href={`/properties/${prop.id}`}>
                        <a className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors text-center">
                          View Details & Inquire
                        </a>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
