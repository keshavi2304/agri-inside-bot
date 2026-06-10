import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { useFarmerProfile, useChatMessages, useAlerts, useRecommendedCrops } from '@/hooks/useFarmer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { getLoginUrl } from '@/const';
import { Sprout, Cloud, AlertCircle, MessageSquare, TrendingUp, LogOut, ArrowRight, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { profile, isLoading: profileLoading } = useFarmerProfile();
  const { history: chatHistory, isLoading: chatLoading } = useChatMessages();
  const { alerts, isLoading: alertsLoading } = useAlerts();
  const { crops: recommendedCrops, isLoading: cropsLoading } = useRecommendedCrops();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/' as any);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Mock weather data (would be replaced with real API)
  const weather = {
    temperature: '28°C',
    humidity: '65%',
    windSpeed: '12 km/h',
    condition: 'Partly Cloudy',
  };

  const isLoading = profileLoading || chatLoading || alertsLoading || cropsLoading;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-gradient">Agri Insights</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              {t.nav.logout}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2">
            {t.dashboard.welcome}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your farming dashboard with personalized insights and recommendations.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="card-base p-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all" onClick={() => setLocation('/chat' as any)}>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Start New Chat</p>
              <p className="text-2xl font-bold">Ask AI</p>
            </div>
            <MessageSquare className="w-8 h-8 text-accent" />
          </Card>
          <Card className="card-base p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Chats</p>
              <p className="text-2xl font-bold">{chatHistory?.length || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent" />
          </Card>
          <Card className="card-base p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
              <p className="text-2xl font-bold">{alerts?.length || 0}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-accent" />
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Chat History & Alerts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Chats */}
            <Card className="card-base p-6 animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-accent" />
                {t.dashboard.chatHistory}
              </h2>
              {chatLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : chatHistory && chatHistory.length > 0 ? (
                <div className="space-y-3">
                  {chatHistory.slice(0, 5).map((chat, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                      <p className="font-semibold text-sm">{chat.userMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">{t.dashboard.noChats}</p>
              )}
            </Card>

            {/* Alerts */}
            <Card className="card-base p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-accent" />
                {t.dashboard.alerts}
              </h2>
              {alertsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : alerts && alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' :
                      alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20' :
                      'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    }`}>
                      <p className="font-semibold text-sm">{alert.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">{t.dashboard.noAlerts}</p>
              )}
            </Card>
          </div>

          {/* Right Column - Weather & Recommendations */}
          <div className="space-y-8">
            {/* Weather */}
            <Card className="card-base p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Cloud className="w-6 h-6 text-accent" />
                {t.dashboard.weatherUpdates}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">{t.dashboard.temperature}</span>
                  <span className="font-semibold">{weather.temperature}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">{t.dashboard.humidity}</span>
                  <span className="font-semibold">{weather.humidity}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">{t.dashboard.windSpeed}</span>
                  <span className="font-semibold">{weather.windSpeed}</span>
                </div>
              </div>
            </Card>

            {/* Recommended Crops */}
            <Card className="card-base p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sprout className="w-6 h-6 text-accent" />
                {t.dashboard.recommendedCrops}
              </h2>
              {cropsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : recommendedCrops && recommendedCrops.length > 0 ? (
                <div className="space-y-2">
                  {recommendedCrops.map((crop) => (
                    <div key={crop.id} className="p-3 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">{crop.cropName}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">{crop.season}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          crop.suitability === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {crop.suitability || 'Medium'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">{t.dashboard.noCrops}</p>
              )}
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="card-base p-8 mt-8 bg-gradient-to-r from-accent/10 to-green-600/10 border-accent/20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need farming advice?</h3>
              <p className="text-muted-foreground">Chat with our AI assistant for personalized crop guidance and solutions.</p>
            </div>
            <Button onClick={() => setLocation('/chat' as any)} className="btn-primary whitespace-nowrap">
              Start Chat
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
