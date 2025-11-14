import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      console.warn('[Database] DATABASE_URL not configured');
      return null;
    }

    try {
      const connection = await mysql.createConnection(process.env.DATABASE_URL);
      _db = drizzle(connection, { schema, mode: 'default' });
    } catch (error) {
      console.error('[Database] Failed to connect:', error);
      return null;
    }
  }

  return _db;
}

// ============ PROPERTIES ============

export async function getProperties(filters?: {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [];
  
  if (filters?.city) {
    conditions.push(eq(schema.properties.city, filters.city));
  }
  if (filters?.minPrice) {
    conditions.push(gte(schema.properties.price, filters.minPrice.toString()));
  }
  if (filters?.maxPrice) {
    conditions.push(lte(schema.properties.price, filters.maxPrice.toString()));
  }
  if (filters?.beds) {
    conditions.push(gte(schema.properties.beds, filters.beds));
  }

  try {
    const query = db
      .select()
      .from(schema.properties)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(filters?.limit || 20)
      .offset(filters?.offset || 0);

    return await query;
  } catch (error) {
    console.error('[Database] Error fetching properties:', error);
    return [];
  }
}

export async function getPropertyById(id: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(schema.properties)
      .where(eq(schema.properties.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('[Database] Error fetching property:', error);
    return null;
  }
}

export async function createProperty(data: schema.InsertProperty) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .insert(schema.properties)
      .values(data);

    return result;
  } catch (error) {
    console.error('[Database] Error creating property:', error);
    throw error;
  }
}

export async function updateProperty(id: number, data: Partial<schema.InsertProperty>) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(schema.properties)
      .set(data)
      .where(eq(schema.properties.id, id));

    return getPropertyById(id);
  } catch (error) {
    console.error('[Database] Error updating property:', error);
    throw error;
  }
}

// ============ LEADS ============

export async function createLead(data: schema.InsertLead) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .insert(schema.leads)
      .values(data);

    return result;
  } catch (error) {
    console.error('[Database] Error creating lead:', error);
    throw error;
  }
}

export async function getLead(id: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(schema.leads)
      .where(eq(schema.leads.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('[Database] Error fetching lead:', error);
    return null;
  }
}

export async function getLeadsByStatus(status: string, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(schema.leads)
      .where(eq(schema.leads.status, status as any))
      .orderBy(desc(schema.leads.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error('[Database] Error fetching leads:', error);
    return [];
  }
}

export async function updateLead(id: number, data: Partial<schema.InsertLead>) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(schema.leads)
      .set(data)
      .where(eq(schema.leads.id, id));

    return getLead(id);
  } catch (error) {
    console.error('[Database] Error updating lead:', error);
    throw error;
  }
}

// ============ SUBSCRIPTIONS ============

export async function createSubscription(data: schema.InsertSubscription) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .insert(schema.subscriptions)
      .values(data);

    return result;
  } catch (error) {
    console.error('[Database] Error creating subscription:', error);
    throw error;
  }
}

export async function getSubscription(id: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(schema.subscriptions)
      .where(eq(schema.subscriptions.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('[Database] Error fetching subscription:', error);
    return null;
  }
}

export async function getSubscriptionByAgentId(agentId: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(schema.subscriptions)
      .where(eq(schema.subscriptions.agentId, agentId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('[Database] Error fetching subscription:', error);
    return null;
  }
}

export async function updateSubscription(id: number, data: Partial<schema.InsertSubscription>) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(schema.subscriptions)
      .set(data)
      .where(eq(schema.subscriptions.id, id));

    return getSubscription(id);
  } catch (error) {
    console.error('[Database] Error updating subscription:', error);
    throw error;
  }
}

// ============ LEAD PURCHASES ============

export async function createLeadPurchase(data: schema.InsertLeadPurchase) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .insert(schema.leadPurchases)
      .values(data);

    return result;
  } catch (error) {
    console.error('[Database] Error creating lead purchase:', error);
    throw error;
  }
}

export async function getLeadPurchase(id: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(schema.leadPurchases)
      .where(eq(schema.leadPurchases.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('[Database] Error fetching lead purchase:', error);
    return null;
  }
}

export async function getLeadPurchasesBySubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(schema.leadPurchases)
      .where(eq(schema.leadPurchases.subscriptionId, subscriptionId))
      .orderBy(desc(schema.leadPurchases.createdAt));
  } catch (error) {
    console.error('[Database] Error fetching lead purchases:', error);
    return [];
  }
}

export async function updateLeadPurchase(id: number, data: Partial<schema.InsertLeadPurchase>) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(schema.leadPurchases)
      .set(data)
      .where(eq(schema.leadPurchases.id, id));

    return getLeadPurchase(id);
  } catch (error) {
    console.error('[Database] Error updating lead purchase:', error);
    throw error;
  }
}

export type InsertProperty = schema.InsertProperty;
export type InsertLead = schema.InsertLead;
export type InsertSubscription = schema.InsertSubscription;
export type InsertLeadPurchase = schema.InsertLeadPurchase;
