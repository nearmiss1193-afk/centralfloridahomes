import axios from 'axios';

const BASE44_API_URL = 'https://app.base44.com/api/apps';
const BASE44_API_KEY = process.env.BASE44_API_KEY;
const BASE44_APP_ID = process.env.BASE44_APP_ID;

if (!BASE44_API_KEY || !BASE44_APP_ID) {
  console.warn('[Base44] API credentials not configured');
}

const base44Client = axios.create({
  baseURL: `${BASE44_API_URL}/${BASE44_APP_ID}/entities/Property`,
  headers: {
    'Authorization': `Bearer ${BASE44_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function getProperties(filters?: any) {
  try {
    const response = await base44Client.get('/', { params: filters });
    return response.data;
  } catch (error) {
    console.error('[Base44] Error fetching properties:', error);
    return [];
  }
}

export async function getPropertyById(id: string) {
  try {
    const response = await base44Client.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('[Base44] Error fetching property:', error);
    return null;
  }
}

export async function updateProperty(id: string, data: any) {
  try {
    const response = await base44Client.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('[Base44] Error updating property:', error);
    throw error;
  }
}
