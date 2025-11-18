import axios from 'axios';

export default async function handler(req, res) {
  try {
    const FLORIDA_MARKETS = [
      { city: 'Tampa', state: 'FL' },
      { city: 'St Petersburg', state: 'FL' },
      { city: 'Clearwater', state: 'FL' },
      { city: 'Lakeland', state: 'FL' },
      { city: 'Orlando', state: 'FL' },
      { city: 'Kissimmee', state: 'FL' },
      { city: 'Daytona Beach', state: 'FL' }
      // Full list can be added here.
    ];

    // Placeholder: integrate your Node scraper or external service here.
    const properties = [];

    return res.status(200).json({
      success: true,
      properties: properties.length,
      markets: FLORIDA_MARKETS.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Scrape failed' });
  }
}
