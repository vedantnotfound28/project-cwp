import { useState } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
  value: string;
  onChange: (location: string, lat?: number, lng?: number) => void;
}

// Pune and PCMC bounding box coordinates
const PUNE_PCMC_BOUNDS = {
  minLat: 18.3,
  maxLat: 18.8,
  minLng: 73.7,
  maxLng: 74.1,
};

// Allowed location keywords
const ALLOWED_KEYWORDS = [
  'pune',
  'pcmc',
  'pimpri',
  'chinchwad',
  'nigdi',
  'akurdi',
  'bhosari',
  'kothrud',
  'wakad',
  'hinjewadi',
  'baner',
  'pashan',
  'aundh',
  'shivajinagar',
  'deccan',
  'swargate',
  'hadapsar',
  'magarpatta',
  'kharadi',
  'viman nagar',
  'koregaon',
  'yerawada',
  'wagholi',
  'manjri',
  'mundhwa',
  'kondhwa',
  'katraj',
  'bibvewadi',
  'warje',
  'karve',
  'paud',
  'bavdhan',
  'sus',
  'mulshi',
  'lavasa',
  'talegaon',
  'lonavala',
  'dehu',
  'alandi',
  'chakan',
  'rajgurunagar',
  'sangvi',
  'dapodi',
  'kasarwadi',
  'phugewadi',
  'moshi',
  'dighi',
  'talawade',
];

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  const isLocationInPunePCMC = (lat: number, lng: number): boolean => {
    return (
      lat >= PUNE_PCMC_BOUNDS.minLat &&
      lat <= PUNE_PCMC_BOUNDS.maxLat &&
      lng >= PUNE_PCMC_BOUNDS.minLng &&
      lng <= PUNE_PCMC_BOUNDS.maxLng
    );
  };

  const isAddressInPunePCMC = (address: string): boolean => {
    const lowerAddress = address.toLowerCase();
    return ALLOWED_KEYWORDS.some(keyword => lowerAddress.includes(keyword));
  };

  const validateAndSetLocation = (address: string, lat?: number, lng?: number) => {
    // Check coordinates if available
    if (lat !== undefined && lng !== undefined) {
      if (!isLocationInPunePCMC(lat, lng)) {
        setLocationError('Location must be within India');
        setCoords(null);
        onChange('');
        toast({
          title: "Invalid Location",
          description: "Reports can only be submitted for locations within India.",
          variant: "destructive",
        });
        return false;
      }
    }

    // Also validate address text
    if (address && !isAddressInPunePCMC(address)) {
      setLocationError('Please enter a location ');
      return false;
    }

    setLocationError(null);
    if (lat !== undefined && lng !== undefined) {
      setCoords({ lat, lng });
    }
    onChange(address, lat, lng);
    return true;
  };

  const handleManualInput = (address: string) => {
    if (!address) {
      setLocationError(null);
      setCoords(null);
      onChange('');
      return;
    }

    // Just update the value, validation happens on form submit
    if (isAddressInPunePCMC(address)) {
      setLocationError(null);
    } else if (address.length > 5) {
      setLocationError('Location must be within India');
    }
    onChange(address);
  };

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
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Check if location is within Pune/PCMC bounds
        if (!isLocationInPunePCMC(latitude, longitude)) {
          setIsGettingLocation(false);
          setLocationError('Your current location ');
          toast({
            title: "Location Outside Service Area",
            description: "RuralFix Accept location all over India.",
            variant: "destructive",
          });
          return;
        }

        // Try to get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          setCoords({ lat: latitude, lng: longitude });
          onChange(address, latitude, longitude);
          setLocationError(null);
          
          toast({
            title: "Location detected",
            description: "Your current location has been added",
          });
        } catch {
          // Fallback to coordinates if reverse geocoding fails
          setCoords({ lat: latitude, lng: longitude });
          onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, latitude, longitude);
          setLocationError(null);
        }
        
        setIsGettingLocation(false);
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
            onChange={(e) => handleManualInput(e.target.value)}
            placeholder="Enter location "
            className={`pl-10 ${locationError ? 'border-destructive' : ''}`}
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

      {locationError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{locationError}</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        📍 Service area: all over India
      </p>

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
      
      {!coords && value && !locationError && (
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
