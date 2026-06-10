# Agri Insights Bot - Project TODO

## Phase 1: Database & Schema
- [x] Create database schema for farmers table (profile, location, language preference)
- [x] Create chat_history table (userId, message, response, timestamp)
- [x] Create alerts table (userId, type: rain/pest, message, timestamp)
- [x] Create recommended_crops table (userId, crop, season, reason)
- [x] Apply database migrations

## Phase 2: Core UI Pages
- [x] Homepage with hero section: "Smart Farming Starts Here 🌱"
- [x] Homepage subheading and description
- [x] Chatbot preview input box on homepage
- [x] CTA buttons: Start Chat, Login, Explore Features
- [x] Features section with 5 cards (AI Crop Guidance, Weather, Soil & Fertilizer, Pest & Disease, Market Price)
- [x] How It Works section with 3-step visual flow
- [x] About section explaining mission
- [x] Contact section with form (name, mobile/email, message)
- [x] Footer with navigation links and social media icons
- [x] Navigation navbar with language switcher

## Phase 3: Authentication
- [x] Implement Manus OAuth login flow (via template)
- [ ] Implement signup flow with farmer profile creation
- [ ] Store farmer profile data (name, mobile, location, language preference)
- [x] Create protected routes for dashboard
- [x] Implement logout functionality

## Phase 4: AI Chatbot
- [x] Build chatbot UI component with message history
- [ ] Integrate LLM backend (OpenAI/Manus API)
- [x] Implement example queries (crop selection, pest control, fertilizer advice)
- [ ] Add voice input option (optional)
- [ ] Implement chat history persistence
- [x] Add multi-language support to chatbot responses

## Phase 5: Farmer Dashboard
- [x] Create dashboard layout with sidebar
- [x] Display personalized welcome message
- [x] Show saved chat history
- [ ] Integrate weather updates based on location
- [x] Display recommended crops for season
- [x] Show alerts (rain, pests)
- [ ] Create alert notification system

## Phase 6: Multi-language Support
- [x] Create translation files (English, Hindi, Gujarati)
- [x] Implement language context/provider
- [x] Add language switcher in navbar
- [x] Translate all UI text
- [x] Translate chatbot responses

## Phase 7: Dark Mode & Polish
- [x] Implement dark mode toggle
- [x] Apply green and natural color theme
- [x] Add smooth animations and transitions
- [x] Ensure mobile-first responsive design
- [ ] Test on mobile, tablet, desktop
- [ ] Optimize performance

## Phase 8: Testing & Final Polish
- [ ] Test authentication flow
- [ ] Test chatbot functionality
- [ ] Test multi-language switching
- [x] Test dark mode toggle
- [ ] Test responsive design
- [ ] Test chat history persistence
- [ ] Test alert notifications
- [ ] Optimize images and assets
- [ ] SEO optimization

## Phase 9: Deployment
- [ ] Create final checkpoint
- [ ] Deploy to production
