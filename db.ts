import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, farmers, InsertFarmer, chatHistory, InsertChatHistory, alerts, InsertAlert, recommendedCrops, InsertRecommendedCrop } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Farmer profile functions
export async function getFarmerByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(farmers).where(eq(farmers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertFarmerProfile(userId: number, data: Partial<InsertFarmer>) {
  const db = await getDb();
  if (!db) return;

  const existing = await getFarmerByUserId(userId);
  
  if (existing) {
    await db.update(farmers).set(data).where(eq(farmers.userId, userId));
  } else {
    await db.insert(farmers).values({ userId, ...data });
  }
}

// Chat history functions
export async function saveChatMessage(userId: number, data: Omit<InsertChatHistory, 'userId'>) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(chatHistory).values({ userId, ...data });
}

export async function getChatHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(chatHistory)
    .where(eq(chatHistory.userId, userId))
    .orderBy(chatHistory.createdAt)
    .limit(limit);
  
  return result;
}

// Alert functions
export async function createAlert(userId: number, data: Omit<InsertAlert, 'userId'>) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(alerts).values({ userId, ...data });
}

export async function getAlerts(userId: number, unreadOnly: boolean = false) {
  const db = await getDb();
  if (!db) return [];
  
  if (unreadOnly) {
    const result = await db.select().from(alerts)
      .where(eq(alerts.userId, userId))
      .orderBy(alerts.createdAt);
    return result.filter(a => a.isRead === 0);
  }
  
  const result = await db.select().from(alerts)
    .where(eq(alerts.userId, userId))
    .orderBy(alerts.createdAt);
  return result;
}

export async function markAlertAsRead(alertId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(alerts).set({ isRead: 1 }).where(eq(alerts.id, alertId));
}

// Recommended crops functions
export async function getRecommendedCrops(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(recommendedCrops)
    .where(eq(recommendedCrops.userId, userId))
    .orderBy(recommendedCrops.createdAt);
  
  return result;
}

export async function addRecommendedCrop(userId: number, data: Omit<InsertRecommendedCrop, 'userId'>) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(recommendedCrops).values({ userId, ...data });
}
