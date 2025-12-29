import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { MapPin, FileText, Users, CheckCircle, ArrowRight, Leaf, LogIn, Eye } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-6">
              <Leaf className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Community-Driven Change</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Let's save the environment{' '}
              <span className="text-primary">together.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Report local civic problems like potholes, broken streetlights, and garbage issues. 
              Help make your community a better place to live.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/submit">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    <FileText className="h-5 w-5" />
                    Report a Problem
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    <LogIn className="h-5 w-5" />
                    Login to Report
                  </Button>
                </Link>
              )}
              <Link to="/reports">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  <Eye className="h-5 w-5" />
                  View Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-card border-y border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              About LocalFix
            </h2>
            <p className="text-muted-foreground text-lg">
              LocalFix is a community-driven platform that empowers citizens of Pune and PCMC to report civic issues 
              directly to local authorities. Our mission is to create cleaner, safer, and more livable neighborhoods 
              by bridging the gap between residents and municipal services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Free to Use</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Report Anytime</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Pune</div>
              <p className="text-muted-foreground">& PCMC Coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How LocalFix Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to report and track civic issues in your area
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card border border-border animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-hero mb-5">
                <MapPin className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Spot a Problem
              </h3>
              <p className="text-muted-foreground">
                Found a pothole, broken light, or garbage pile? Take a photo and note the location.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-card border border-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-hero mb-5">
                <FileText className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Submit Report
              </h3>
              <p className="text-muted-foreground">
                Fill out a simple form with details about the issue. Upload a photo for better visibility.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-card border border-border animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-hero mb-5">
                <CheckCircle className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Track Progress
              </h3>
              <p className="text-muted-foreground">
                Follow the status of your report from pending to resolved. Stay informed every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Problem Categories
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Report a wide range of civic issues affecting your community
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: '🕳️', label: 'Potholes' },
              { icon: '💡', label: 'Streetlights' },
              { icon: '🗑️', label: 'Garbage' },
              { icon: '💧', label: 'Water Leaks' },
              { icon: '🚶', label: 'Sidewalks' },
              { icon: '🚦', label: 'Traffic' },
              { icon: '🎨', label: 'Graffiti' },
              { icon: '📋', label: 'Other' },
            ].map((item, index) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-card transition-all duration-200 animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Join the community
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to make a difference?
            </h2>
            <p className="text-muted-foreground mb-8">
              {user 
                ? "You're all set! Start reporting issues in your neighborhood."
                : "Create an account to start reporting issues and tracking their resolution."
              }
            </p>
            {user ? (
              <Link to="/submit">
                <Button variant="hero" size="lg">
                  Report a Problem
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="lg">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-hero flex items-center justify-center">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">LocalFix</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 LocalFix. Making Pune & PCMC better, one report at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
