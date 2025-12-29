export type ProblemCategory = 
  | 'pothole'
  | 'streetlight'
  | 'garbage'
  | 'water'
  | 'sidewalk'
  | 'traffic'
  | 'graffiti'
  | 'other';

export type ReportStatus = 'pending' | 'in_progress' | 'resolved';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ProblemCategory;
  location: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface CategoryInfo {
  id: ProblemCategory;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'pothole', label: 'Pothole / Road Damage', icon: '🕳️', color: 'hsl(25, 95%, 53%)' },
  { id: 'streetlight', label: 'Broken Streetlight', icon: '💡', color: 'hsl(45, 93%, 47%)' },
  { id: 'garbage', label: 'Garbage / Waste Issue', icon: '🗑️', color: 'hsl(142, 76%, 36%)' },
  { id: 'water', label: 'Water Leak / Drainage', icon: '💧', color: 'hsl(199, 89%, 48%)' },
  { id: 'sidewalk', label: 'Sidewalk Damage', icon: '🚶', color: 'hsl(280, 65%, 60%)' },
  { id: 'traffic', label: 'Traffic Signal Issue', icon: '🚦', color: 'hsl(0, 72%, 51%)' },
  { id: 'graffiti', label: 'Graffiti / Vandalism', icon: '🎨', color: 'hsl(320, 70%, 50%)' },
  { id: 'other', label: 'Other', icon: '📋', color: 'hsl(215, 16%, 47%)' },
];

export const getCategoryInfo = (id: ProblemCategory): CategoryInfo => {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[7];
};
