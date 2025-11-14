import axios from 'axios';

const GHL_API_URL = 'https://api.gohighlevel.com/v1';
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.warn('[GoHighLevel] API credentials not configured');
}

const ghlClient = axios.create({
  baseURL: GHL_API_URL,
  headers: {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function createContact(data: any) {
  try {
    const response = await ghlClient.post('/contacts/', {
      ...data,
      locationId: GHL_LOCATION_ID,
    });
    return response.data;
  } catch (error) {
    console.error('[GoHighLevel] Error creating contact:', error);
    throw error;
  }
}

export async function createOpportunity(data: any) {
  try {
    const response = await ghlClient.post('/opportunities/', data);
    return response.data;
  } catch (error) {
    console.error('[GoHighLevel] Error creating opportunity:', error);
    throw error;
  }
}

export async function submitBuyerLead(data: any) {
  try {
    const contact = await createContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      tags: ['buyer_lead', 'website'],
    });
    return contact;
  } catch (error) {
    console.error('[GoHighLevel] Error submitting buyer lead:', error);
    throw error;
  }
}

export async function submitAgentInquiry(data: any) {
  try {
    const contact = await createContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      tags: ['agent_inquiry', 'website'],
    });
    return contact;
  } catch (error) {
    console.error('[GoHighLevel] Error submitting agent inquiry:', error);
    throw error;
  }
}
