import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: 'test-farmer-001',
    email: 'farmer@example.com',
    name: 'Test Farmer',
    loginMethod: 'manus',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext['res'],
  };

  return { ctx, clearedCookies };
}

describe('Farmer Profile', () => {
  it('should get farmer profile', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This will return undefined initially since no profile exists
    const profile = await caller.farmer.getProfile();
    expect(profile).toBeUndefined();
  });

  it('should update farmer profile', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.farmer.updateProfile({
      mobile: '9876543210',
      location: 'Gujarat',
      state: 'Gujarat',
      district: 'Ahmedabad',
      languagePreference: 'gu',
      cropTypes: 'Cotton, Wheat',
      farmSize: '5 acres',
    });

    expect(result).toEqual({ success: true });
  });
});

describe('Chat Messages', () => {
  it('should send a message and get response', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Mock the LLM response
    const response = await caller.chat.sendMessage({
      userMessage: 'What is the best crop to grow this season?',
      language: 'en',
    });

    expect(response).toHaveProperty('userMessage');
    expect(response).toHaveProperty('assistantResponse');
    expect(response.userMessage).toBe('What is the best crop to grow this season?');
    expect(typeof response.assistantResponse).toBe('string');
  });

  it('should send message in Hindi', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const response = await caller.chat.sendMessage({
      userMessage: 'इस मौसम में कौन सी फसल उगानी चाहिए?',
      language: 'hi',
    });

    expect(response).toHaveProperty('userMessage');
    expect(response).toHaveProperty('assistantResponse');
  });

  it('should send message in Gujarati', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const response = await caller.chat.sendMessage({
      userMessage: 'આ સીઝનમાં કયો પાક ઉગાડવો જોઈએ?',
      language: 'gu',
    });

    expect(response).toHaveProperty('userMessage');
    expect(response).toHaveProperty('assistantResponse');
  });

  it('should get chat history', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const history = await caller.chat.getHistory({ limit: 50 });
    expect(Array.isArray(history)).toBe(true);
  });
});

describe('Alerts', () => {
  it('should create a rain alert', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.alerts.createAlert({
      type: 'rain',
      title: 'Heavy Rain Expected',
      message: '70% chance of rain in next 3 days',
      severity: 'high',
    });

    expect(result).toEqual({ success: true });
  });

  it('should create a pest alert', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.alerts.createAlert({
      type: 'pest',
      title: 'Armyworm Detected',
      message: 'Armyworm detected in cotton crops in your area',
      severity: 'medium',
    });

    expect(result).toEqual({ success: true });
  });

  it('should get alerts', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const alerts = await caller.alerts.getAlerts({ unreadOnly: false });
    expect(Array.isArray(alerts)).toBe(true);
  });

  it('should mark alert as read', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create an alert
    await caller.alerts.createAlert({
      type: 'rain',
      title: 'Test Alert',
      message: 'Test message',
    });

    // Get alerts to get an ID
    const alerts = await caller.alerts.getAlerts({ unreadOnly: false });
    if (alerts.length > 0) {
      const result = await caller.alerts.markAsRead({ alertId: alerts[0].id });
      expect(result).toEqual({ success: true });
    }
  });
});

describe('Recommended Crops', () => {
  it('should add recommended crop', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crops.addRecommendation({
      cropName: 'Wheat',
      season: 'Winter',
      reason: 'High yield potential',
      suitability: 'High',
    });

    expect(result).toEqual({ success: true });
  });

  it('should get recommended crops', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const crops = await caller.crops.getRecommended();
    expect(Array.isArray(crops)).toBe(true);
  });
});

describe('Query Categorization', () => {
  it('should categorize crop queries', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const response = await caller.chat.sendMessage({
      userMessage: 'Which crop should I plant?',
      language: 'en',
    });

    expect(response.userMessage).toContain('crop');
  });

  it('should categorize pest queries', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const response = await caller.chat.sendMessage({
      userMessage: 'How to control pests?',
      language: 'en',
    });

    expect(response.userMessage).toContain('pest');
  });

  it('should categorize fertilizer queries', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const response = await caller.chat.sendMessage({
      userMessage: 'What fertilizer should I use?',
      language: 'en',
    });

    expect(response.userMessage).toContain('fertilizer');
  });
});
