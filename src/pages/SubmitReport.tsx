import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { CategorySelector } from '@/components/CategorySelector';
import { ImageUpload } from '@/components/ImageUpload';
import { LocationPicker } from '@/components/LocationPicker';
import { useReports } from '@/context/ReportsContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProblemCategory } from '@/types/report';
import { Send, AlertTriangle } from 'lucide-react';

export default function SubmitReport() {
  const navigate = useNavigate();
  const { addReport } = useReports();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProblemCategory | ''>('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationChange = (loc: string, lat?: number, lng?: number) => {
    setLocation(loc);
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) {
      toast({
        title: "Please select a category",
        description: "Choose the type of problem you're reporting.",
        variant: "destructive",
      });
      return;
    }

    if (!location) {
      toast({
        title: "Please add a location",
        description: "Enter the address or use your current location.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    addReport({
      title,
      description,
      category,
      location,
      latitude,
      longitude,
      imageUrl: imageUrl || undefined,
      userId: user?.id,
    });

    toast({
      title: "Report submitted!",
      description: "Thank you for helping improve your community.",
    });

    navigate('/reports');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Sign in required
              </h2>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to submit a report.
              </p>
              <Link to="/auth">
                <Button>Sign In to Continue</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Submit a Report
            </h1>
            <p className="text-muted-foreground">
              Help us identify and fix problems in your community.
            </p>
          </div>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-3">
                  <Label className="text-base">Problem Category *</Label>
                  <CategorySelector value={category} onChange={setCategory} />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Problem Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief title describing the issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide more details about the problem..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    maxLength={1000}
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Photo (optional)</Label>
                  <ImageUpload value={imageUrl} onChange={setImageUrl} />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <LocationPicker value={location} onChange={handleLocationChange} />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Send className="h-5 w-5" />
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
