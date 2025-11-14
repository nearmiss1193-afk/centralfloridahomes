import { int, mysqlTable, text, varchar, timestamp, decimal, mysqlEnum, index } from "drizzle-orm/mysql-core";

/**
 * Properties from Base44
 */
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  externalId: varchar("external_id", { length: 100 }).unique().notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  zip: varchar("zip", { length: 20 }).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  beds: int("beds").notNull(),
  baths: varchar("baths", { length: 10 }).notNull(),
  sqft: int("sqft"),
  lotSize: int("lot_size"),
  yearBuilt: int("year_built"),
  propertyType: varchar("property_type", { length: 50 }),
  image: text("image"),
  imageGallery: text("image_gallery"),
  description: text("description"),
  hasPool: int("has_pool").default(0),
  hasWaterfront: int("has_waterfront").default(0),
  hasGarage: int("has_garage").default(0),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  priceIdx: index("price_idx").on(table.price),
  statusIdx: index("status_idx").on(table.status),
  externalIdIdx: index("external_id_idx").on(table.externalId),
}));

/**
 * Leads captured from website
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  ghlContactId: varchar("ghl_contact_id", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  leadType: mysqlEnum("lead_type", ["buyer", "seller", "investor"]).notNull(),
  propertyId: int("property_id"),
  message: text("message"),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "lost"]).default("new").notNull(),
  source: varchar("source", { length: 50 }).default("website").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  propertyIdIdx: index("property_id_idx").on(table.propertyId),
  emailIdx: index("email_idx").on(table.email),
}));

/**
 * Agent subscriptions
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agent_id", { length: 100 }).unique().notNull(),
  plan: mysqlEnum("plan", ["starter", "professional", "premium"]).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 100 }),
  status: mysqlEnum("status", ["active", "canceled", "past_due"]).default("active").notNull(),
  startDate: timestamp("start_date").notNull(),
  renewalDate: timestamp("renewal_date"),
  canceledAt: timestamp("canceled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  agentIdIdx: index("agent_id_idx").on(table.agentId),
  statusIdx: index("status_idx").on(table.status),
}));

/**
 * Lead purchases by agents
 */
export const leadPurchases = mysqlTable("lead_purchases", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscription_id").notNull(),
  leadId: int("lead_id").notNull(),
  
  // Payment
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 100 }),
  
  // Status
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  subscriptionIdIdx: index("subscription_id_idx").on(table.subscriptionId),
  leadIdIdx: index("lead_id_idx").on(table.leadId),
}));

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type LeadPurchase = typeof leadPurchases.$inferSelect;
export type InsertLeadPurchase = typeof leadPurchases.$inferInsert;
