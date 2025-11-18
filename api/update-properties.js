export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { properties } = req.body || {};
      if (!Array.isArray(properties)) {
        return res.status(400).json({ error: 'properties must be an array' });
      }

      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await fetch(`${process.env.KV_REST_API_URL}/set/properties`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(properties)
        });
      }

      return res.status(200).json({ success: true, count: properties.length });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update properties' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
