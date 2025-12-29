import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
  value: string;
  onChange: (location: string, lat?: number, lng?: number) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        
        // Try to get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          onChange(address, latitude, longitude);
        } catch {
          // Fallback to coordinates if reverse geocoding fails
          onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, latitude, longitude);
        }
        
        setIsGettingLocation(false);
        toast({
          title: "Location detected",
          description: "Your current location has been added",
        });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "Error",
          description: "Unable to retrieve your location. Please enter it manually.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter address or use current location"
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="flex-shrink-0"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          <span className="hidden sm:inline ml-2">
            {isGettingLocation ? 'Detecting...' : 'Use My Location'}
          </span>
        </Button>
      </div>

      {coords && (
        <div className="rounded-xl overflow-hidden border border-border bg-muted">
          <iframe
            width="100%"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${coords.lat},${coords.lng}&zoom=16`}
            allowFullScreen
          />
        </div>
      )}
      
      {!coords && value && (
        <div className="rounded-xl overflow-hidden border border-border bg-muted">
          <iframe
            width="100%"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(value)}&zoom=14`}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
