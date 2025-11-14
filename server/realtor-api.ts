

/**
 * Realtor.com Property API Integration via RapidAPI
 * Provides access to 7,948+ Florida property listings
 */

const RAPIDAPI_HOST = 'realtor-com-real-estate.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';

interface RealtorProperty {
  property_id: string;
  listing_id: string;
  prop_type: string;
  address: {
    line: string;
    street_name: string;
    street_number: string;
    street_suffix: string;
    city: string;
    state: string;
    state_code: string;
    postal_code: string;
    county: string;
    lat: number;
    lon: number;
  };
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lot_sqft: number;
  year_built: number;
  list_date: string;
  status: string;
  description: {
    text: string;
  };
  photos: Array<{
    href: string;
  }>;
  virtual_tours?: Array<{
    href: string;
  }>;
  agents?: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
  schools?: Array<{
    name: string;
    rating: number;
    distance: number;
  }>;
  features?: string[];
  hoa?: {
    fee: number;
    fee_frequency: string;
  };
}

interface RealtorSearchParams {
  city?: string;
  state_code?: string;
  limit?: number;
  offset?: number;
  status?: 'for_sale' | 'for_rent' | 'sold';
  sort?: 'relevance' | 'price_high' | 'price_low' | 'newest';
  price_min?: number;
  price_max?: number;
  beds_min?: number;
  baths_min?: number;
  sqft_min?: number;
  prop_type?: string;
}

/**
 * Search for properties using Realtor.com API
 */
export async function searchProperties(params: RealtorSearchParams): Promise<RealtorProperty[]> {
  if (!RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY is not configured');
  }

  const url = new URL(`https://${RAPIDAPI_HOST}/properties/v3/list`);
  
  // Add query parameters
  if (params.city) url.searchParams.append('city', params.city);
  if (params.state_code) url.searchParams.append('state_code', params.state_code);
  if (params.limit) url.searchParams.append('limit', params.limit.toString());
  if (params.offset) url.searchParams.append('offset', params.offset.toString());
  if (params.status) url.searchParams.append('status', params.status);
  if (params.sort) url.searchParams.append('sort', params.sort);
  if (params.price_min) url.searchParams.append('price_min', params.price_min.toString());
  if (params.price_max) url.searchParams.append('price_max', params.price_max.toString());
  if (params.beds_min) url.searchParams.append('beds_min', params.beds_min.toString());
  if (params.baths_min) url.searchParams.append('baths_min', params.baths_min.toString());
  if (params.sqft_min) url.searchParams.append('sqft_min', params.sqft_min.toString());
  if (params.prop_type) url.searchParams.append('prop_type', params.prop_type);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`Realtor API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.home_search?.results || [];
  } catch (error) {
    console.error('[Realtor API] Search failed:', error);
    throw error;
  }
}

/**
 * Get property details by ID
 */
export async function getPropertyDetails(propertyId: string): Promise<RealtorProperty | null> {
  if (!RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY is not configured');
  }

  const url = `https://${RAPIDAPI_HOST}/properties/v3/detail?property_id=${propertyId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`Realtor API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.home || null;
  } catch (error) {
    console.error('[Realtor API] Get property details failed:', error);
    return null;
  }
}

/**
 * Fetch all properties for Central Florida cities
 */
export async function fetchAllFloridaProperties(): Promise<RealtorProperty[]> {
  const cities = ['Tampa', 'Orlando', 'St. Petersburg', 'Kissimmee', 'Lakeland', 'Daytona Beach'];
  const allProperties: RealtorProperty[] = [];

  for (const city of cities) {
    console.log(`[Realtor API] Fetching properties for ${city}...`);
    
    try {
      const properties = await searchProperties({
        city,
        state_code: 'FL',
        status: 'for_sale',
        limit: 200, // Max per request
      });

      allProperties.push(...properties);
      console.log(`[Realtor API] Found ${properties.length} properties in ${city}`);
      
      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`[Realtor API] Failed to fetch properties for ${city}:`, error);
    }
  }

  return allProperties;
}

/**
 * Map Realtor.com property to our database schema
 */
export function mapRealtorPropertyToDb(property: RealtorProperty) {
  return {
    mlsId: property.listing_id || property.property_id,
    address: property.address.line,
    city: property.address.city,
    state: property.address.state_code,
    zipCode: property.address.postal_code,
    price: property.price,
    bedrooms: property.beds,
    bathrooms: property.baths,
    squareFeet: property.sqft,
    lotSize: property.lot_sqft,
    yearBuilt: property.year_built,
    propertyType: property.prop_type,
    status: property.status === 'for_sale' ? 'active' : property.status,
    description: property.description?.text || '',
    features: property.features || [],
    images: property.photos?.map(p => p.href) || [],
    virtualTourUrl: property.virtual_tours?.[0]?.href || null,
    latitude: property.address.lat,
    longitude: property.address.lon,
    listingDate: property.list_date ? new Date(property.list_date) : new Date(),
    hoaFee: property.hoa?.fee || null,
    agentName: property.agents?.[0]?.name || null,
    agentEmail: property.agents?.[0]?.email || null,
    agentPhone: property.agents?.[0]?.phone || null,
  };
}
