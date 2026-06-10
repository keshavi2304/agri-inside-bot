import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { Sprout, Cloud, Droplets, Bug, TrendingUp, ArrowRight, MessageSquare, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartChat = () => {
    if (isAuthenticated) {
      setLocation('/chat' as any);
    } else {
      window.location.href = getLoginUrl();
    }
  };

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleExploreFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-gradient">Agri Insights</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-accent transition-colors">{t.nav.features}</a>
            <a href="#how-it-works" className="hover:text-accent transition-colors">{t.nav.howItWorks}</a>
            <a href="#about" className="hover:text-accent transition-colors">{t.nav.about}</a>
            <a href="#contact" className="hover:text-accent transition-colors">{t.nav.contact}</a>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-muted text-foreground border border-border text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="gu">ગુજરાતી</option>
            </select>

            {/* Theme Toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Button onClick={() => setLocation('/dashboard' as any)} className="btn-primary">
                {t.nav.dashboard}
              </Button>
            ) : (
              <Button onClick={handleLogin} className="btn-primary">
                {t.auth.login}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="container py-4 flex flex-col gap-4">
              <a href="#features" className="hover:text-accent transition-colors">{t.nav.features}</a>
              <a href="#how-it-works" className="hover:text-accent transition-colors">{t.nav.howItWorks}</a>
              <a href="#about" className="hover:text-accent transition-colors">{t.nav.about}</a>
              <a href="#contact" className="hover:text-accent transition-colors">{t.nav.contact}</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t.hero.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleStartChat} className="btn-primary">
                  {t.hero.startChat}
                </Button>
                <Button onClick={handleLogin} className="btn-secondary">
                  {t.hero.login}
                </Button>
                <Button onClick={handleExploreFeatures} className="btn-outline">
                  {t.hero.exploreFeatures}
                </Button>
              </div>
            </div>

            {/* Chatbot Preview */}
            <div className="animate-fade-in-down">
              <Card className="p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="bg-accent/10 rounded-lg p-4 text-sm">
                    <p className="text-accent font-semibold">{t.chatbot.title}</p>
                  </div>
                  <input
                    type="text"
                    placeholder={t.hero.chatPlaceholder}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled
                  />
                  <Button className="w-full btn-primary">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t.chatbot.sendMessage}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t.features.title}</h2>
            <p className="text-xl text-muted-foreground">{t.features.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Crop Guidance */}
            <Card className="card-base p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Sprout className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">{t.features.aiCropGuidance}</h3>
              </div>
              <p className="text-muted-foreground">{t.features.aiCropGuidanceDesc}</p>
            </Card>

            {/* Weather Forecast */}
            <Card className="card-base p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Cloud className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">{t.features.weatherForecast}</h3>
              </div>
              <p className="text-muted-foreground">{t.features.weatherForecastDesc}</p>
            </Card>

            {/* Soil & Fertilizer */}
            <Card className="card-base p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Droplets className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">{t.features.soilFertilizer}</h3>
              </div>
              <p className="text-muted-foreground">{t.features.soilFertilizerDesc}</p>
            </Card>

            {/* Pest & Disease */}
            <Card className="card-base p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Bug className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">{t.features.pestDisease}</h3>
              </div>
              <p className="text-muted-foreground">{t.features.pestDiseaseDesc}</p>
            </Card>

            {/* Market Price */}
            <Card className="card-base p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">{t.features.marketPrice}</h3>
              </div>
              <p className="text-muted-foreground">{t.features.marketPriceDesc}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t.howItWorks.title}</h2>
            <p className="text-xl text-muted-foreground">{t.howItWorks.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.howItWorks.step1}</h3>
              <p className="text-muted-foreground">{t.howItWorks.step1Desc}</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-accent" />
            </div>

            {/* Step 2 */}
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.howItWorks.step2}</h3>
              <p className="text-muted-foreground">{t.howItWorks.step2Desc}</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-accent" />
            </div>

            {/* Step 3 */}
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.howItWorks.step3}</h3>
              <p className="text-muted-foreground">{t.howItWorks.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-bold mb-6">{t.about.title}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-accent">{t.about.mission}</h3>
                  <p className="text-muted-foreground">{t.about.missionDesc}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-accent">{t.about.vision}</h3>
                  <p className="text-muted-foreground">{t.about.visionDesc}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-fade-in-down">
              <Card className="card-base p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">10K+</div>
                <p className="text-sm text-muted-foreground">Active Farmers</p>
              </Card>
              <Card className="card-base p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">50K+</div>
                <p className="text-sm text-muted-foreground">Chats Answered</p>
              </Card>
              <Card className="card-base p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">95%</div>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </Card>
              <Card className="card-base p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Support</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-muted/50">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t.contact.title}</h2>
            <p className="text-xl text-muted-foreground">{t.contact.subtitle}</p>
          </div>

          <Card className="card-base p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">{t.contact.name}</label>
                <input
                  type="text"
                  placeholder={t.contact.name}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t.contact.email}</label>
                <input
                  type="text"
                  placeholder={t.contact.email}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t.contact.message}</label>
                <textarea
                  placeholder={t.contact.message}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <Button className="w-full btn-primary">
                {t.contact.send}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-6 h-6 text-accent" />
                <span className="font-bold">Agri Insights Bot</span>
              </div>
              <p className="text-sm text-muted-foreground">Empowering farmers with AI</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.about}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-accent transition-colors">{t.nav.about}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">{t.footer.privacy}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.contact}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#contact" className="hover:text-accent transition-colors">{t.nav.contact}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">{t.footer.terms}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.followUs}</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">Twitter</a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">Facebook</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
