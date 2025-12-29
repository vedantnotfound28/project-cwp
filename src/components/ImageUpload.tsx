import { useCallback, useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const clearImage = () => {
    onChange('');
  };

  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border bg-card">
        <img
          src={value}
          alt="Uploaded preview"
          className="w-full aspect-video object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8"
          onClick={clearImage}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
        isDragging
          ? "border-primary bg-accent/50"
          : "border-border hover:border-primary/50 hover:bg-accent/30"
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
        <Camera className="h-7 w-7 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          Drag and drop an image, or click to browse
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG up to 10MB
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Upload className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Upload Photo</span>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="sr-only"
      />
    </label>
  );
}
