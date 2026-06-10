import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Farmer profile extension
export const farmers = mysqlTable("farmers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  mobile: varchar("mobile", { length: 20 }),
  location: varchar("location", { length: 255 }),
  state: varchar("state", { length: 100 }),
  district: varchar("district", { length: 100 }),
  languagePreference: mysqlEnum("languagePreference", ["en", "hi", "gu"]).default("en").notNull(),
  cropTypes: text("cropTypes"), // JSON array of crops
  farmSize: varchar("farmSize", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Farmer = typeof farmers.$inferSelect;
export type InsertFarmer = typeof farmers.$inferInsert;

// Chat history
export const chatHistory = mysqlTable("chatHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userMessage: text("userMessage").notNull(),
  assistantResponse: text("assistantResponse").notNull(),
  language: mysqlEnum("language", ["en", "hi", "gu"]).default("en").notNull(),
  category: varchar("category", { length: 100 }), // crop-guidance, pest-control, fertilizer, weather, market-price
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = typeof chatHistory.$inferInsert;

// Alerts (rain, pest, etc.)
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["rain", "pest", "disease", "weather", "market-price"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high"]).default("medium").notNull(),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

// Recommended crops
export const recommendedCrops = mysqlTable("recommendedCrops", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cropName: varchar("cropName", { length: 100 }).notNull(),
  season: varchar("season", { length: 50 }).notNull(),
  reason: text("reason"),
  suitability: varchar("suitability", { length: 50 }), // high, medium, low
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RecommendedCrop = typeof recommendedCrops.$inferSelect;
export type InsertRecommendedCrop = typeof recommendedCrops.$inferInsert;
