import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { 
  getFarmerByUserId, 
  upsertFarmerProfile, 
  saveChatMessage, 
  getChatHistory, 
  createAlert, 
  getAlerts, 
  markAlertAsRead,
  getRecommendedCrops,
  addRecommendedCrop
} from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Farmer Profile
  farmer: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await getFarmerByUserId(ctx.user.id);
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        mobile: z.string().optional(),
        location: z.string().optional(),
        state: z.string().optional(),
        district: z.string().optional(),
        languagePreference: z.enum(['en', 'hi', 'gu']).optional(),
        cropTypes: z.string().optional(),
        farmSize: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await upsertFarmerProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Chat
  chat: router({
    sendMessage: protectedProcedure
      .input(z.object({
        userMessage: z.string(),
        language: z.enum(['en', 'hi', 'gu']),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          // Call LLM to generate response
          const systemPrompt = `You are an AI farming assistant helping Indian farmers with crop guidance, weather advice, pest control, fertilizer recommendations, and market prices. 
          Respond in ${input.language === 'en' ? 'English' : input.language === 'hi' ? 'Hindi' : 'Gujarati'}.
          Keep responses concise and practical for farmers.`;

          const response = await invokeLLM({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: input.userMessage },
            ],
          });

          const content = response.choices[0]?.message?.content;
          const assistantResponse = typeof content === 'string' ? content : 'Unable to generate response';

          // Save to database
          if (assistantResponse && typeof assistantResponse === 'string') {
            await saveChatMessage(ctx.user.id, {
              userMessage: input.userMessage,
              assistantResponse,
              language: input.language,
              category: categorizeQuery(input.userMessage),
            });
          }

          return {
            userMessage: input.userMessage,
            assistantResponse: assistantResponse || 'Unable to generate response',
          };
        } catch (error) {
          console.error('Chat error:', error);
          throw error;
        }
      }),

    getHistory: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
      }))
      .query(async ({ ctx, input }) => {
        return await getChatHistory(ctx.user.id, input.limit);
      }),
  }),

  // Alerts
  alerts: router({
    getAlerts: protectedProcedure
      .input(z.object({
        unreadOnly: z.boolean().default(false),
      }))
      .query(async ({ ctx, input }) => {
        return await getAlerts(ctx.user.id, input.unreadOnly);
      }),

    markAsRead: protectedProcedure
      .input(z.object({
        alertId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await markAlertAsRead(input.alertId);
        return { success: true };
      }),

    createAlert: protectedProcedure
      .input(z.object({
        type: z.enum(['rain', 'pest', 'disease', 'weather', 'market-price']),
        title: z.string(),
        message: z.string(),
        severity: z.enum(['low', 'medium', 'high']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await createAlert(ctx.user.id, {
          type: input.type,
          title: input.title,
          message: input.message,
          severity: input.severity || 'medium',
        });
        return { success: true };
      }),
  }),

  // Recommended Crops
  crops: router({
    getRecommended: protectedProcedure.query(async ({ ctx }) => {
      return await getRecommendedCrops(ctx.user.id);
    }),

    addRecommendation: protectedProcedure
      .input(z.object({
        cropName: z.string(),
        season: z.string(),
        reason: z.string().optional(),
        suitability: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await addRecommendedCrop(ctx.user.id, input);
        return { success: true };
      }),
  }),
});

// Helper function to categorize queries
function categorizeQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('crop') || lowerQuery.includes('plant') || lowerQuery.includes('grow')) {
    return 'crop-guidance';
  } else if (lowerQuery.includes('pest') || lowerQuery.includes('insect') || lowerQuery.includes('disease')) {
    return 'pest-control';
  } else if (lowerQuery.includes('fertilizer') || lowerQuery.includes('soil') || lowerQuery.includes('nutrient')) {
    return 'fertilizer';
  } else if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || lowerQuery.includes('temperature')) {
    return 'weather';
  } else if (lowerQuery.includes('price') || lowerQuery.includes('market') || lowerQuery.includes('mandi')) {
    return 'market-price';
  }
  
  return 'general';
}

export type AppRouter = typeof appRouter;
