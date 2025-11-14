import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import { createLead, createSubscription } from './db';
import axios from 'axios';

// Realtor.com API via RapidAPI
const RAPIDAPI_HOST = 'realtor-com-real-estate.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';

// GoHighLevel configuration
const GHL_API_KEY = process.env.GOHIGHLEVEL_API_KEY || '';
const GHL_LOCATION_ID = process.env.GOHIGHLEVEL_LOCATION_ID || '';

async function fetchRealtorProperties(filters?: {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  try {
    if (!RAPIDAPI_KEY) {
      console.warn('[Realtor API] No API key configured');
      return [];
    }

    const searchQuery = filters?.city ? filters.city : 'Orlando, Florida';
    
    const response = await axios.get('https://realtor-com-real-estate.p.rapidapi.com/properties/list-for-sale', {
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
      params: {
        location: searchQuery,
        limit: 20,
        offset: 0,
      },
    });

    const properties = response.data.properties || [];
    
    // Filter by price if specified
    return properties.filter((prop: any) => {
      const price = prop.price || 0;
      if (filters?.minPrice && price < filters.minPrice) return false;
      if (filters?.maxPrice && price > filters.maxPrice) return false;
      return true;
    }).map((prop: any) => ({
      id: prop.property_id || prop.listing_id,
      address: prop.address?.line || 'Property',
      city: prop.address?.city || 'Florida',
      price: prop.price,
      beds: prop.beds,
      baths: prop.baths,
      sqft: prop.sqft,
      description: prop.description?.text,
      photos: prop.photos || [],
    }));
  } catch (error) {
    console.error('[Realtor API] Error fetching properties:', error);
    return [];
  }
}

export const appRouter = router({
  // Properties endpoints
  properties: router({
    list: publicProcedure
      .input(z.object({
        city: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        limit: z.number().default(20),
      }).optional())
      .query(async (opts) => {
        return await fetchRealtorProperties({
          city: opts.input?.city,
          minPrice: opts.input?.minPrice,
          maxPrice: opts.input?.maxPrice,
        });
      }),

    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async (opts) => {
        try {
          if (!RAPIDAPI_KEY) return null;

          const response = await axios.get(`https://realtor-com-real-estate.p.rapidapi.com/properties/detail`, {
            headers: {
              'x-rapidapi-host': RAPIDAPI_HOST,
              'x-rapidapi-key': RAPIDAPI_KEY,
            },
            params: {
              property_id: opts.input.id,
            },
          });

          const prop = response.data;
          return {
            id: prop.property_id || prop.listing_id,
            address: prop.address?.line || 'Property',
            city: prop.address?.city || 'Florida',
            price: prop.price,
            beds: prop.beds,
            baths: prop.baths,
            sqft: prop.sqft,
            description: prop.description?.text,
            photos: prop.photos || [],
          };
        } catch (error) {
          console.error('[Realtor API] Error fetching property detail:', error);
          return null;
        }
      }),

    search: publicProcedure
      .input(z.object({
        query: z.string(),
      }))
      .query(async (opts) => {
        return await fetchRealtorProperties({
          city: opts.input.query,
        });
      }),
  }),

  // Leads endpoints
  leads: router({
    submit: publicProcedure
      .input(z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        propertyId: z.string().optional(),
        leadType: z.enum(['buyer', 'seller', 'investor']),
        message: z.string().optional(),
      }))
      .mutation(async (opts) => {
        try {
          // Submit to GoHighLevel
          if (GHL_API_KEY && GHL_LOCATION_ID) {
            await axios.post(
              `https://rest.gohighlevel.com/v1/contacts/`,
              {
                firstName: opts.input.firstName,
                lastName: opts.input.lastName,
                email: opts.input.email,
                phone: opts.input.phone,
                locationId: GHL_LOCATION_ID,
                tags: [opts.input.leadType, 'central-florida-homes'],
                customFields: {
                  propertyId: opts.input.propertyId,
                  message: opts.input.message,
                },
              },
              {
                headers: {
                  'Authorization': `Bearer ${GHL_API_KEY}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          }

          // Also save to database
          await createLead({
            firstName: opts.input.firstName,
            lastName: opts.input.lastName,
            email: opts.input.email,
            phone: opts.input.phone || '',
            propertyId: parseInt(opts.input.propertyId || '0') || 0,
            leadType: opts.input.leadType,
            message: opts.input.message || '',
          });

          return { success: true, leadId: 0 };
        } catch (error) {
          console.error('[Leads] Error submitting lead:', error);
          throw new Error('Failed to submit lead');
        }
      }),
  }),

  // Subscriptions endpoints
  subscriptions: router({
    create: publicProcedure
      .input(z.object({
        agentName: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        planType: z.enum(['starter', 'professional', 'premium']),
      }))
      .mutation(async (opts) => {
        try {
          await createSubscription({
            agentId: opts.input.email,
            plan: opts.input.planType,
            startDate: new Date(),
          });

          return { success: true, subscriptionId: 0 };
        } catch (error) {
          console.error('[Subscriptions] Error creating subscription:', error);
          throw new Error('Failed to create subscription');
        }
      }),
  }),

  // Health check
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date(),
  })),
});

export type AppRouter = typeof appRouter;
