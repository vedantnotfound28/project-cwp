import { ProblemCategory, CATEGORIES } from '@/types/report';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  value: ProblemCategory | '';
  onChange: (category: ProblemCategory) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
            "hover:border-primary/50 hover:bg-accent/50",
            value === category.id
              ? "border-primary bg-accent shadow-md"
              : "border-border bg-card"
          )}
        >
          <span className="text-3xl" role="img" aria-label={category.label}>
            {category.icon}
          </span>
          <span className="text-xs font-medium text-center text-foreground leading-tight">
            {category.label}
          </span>
        </button>
      ))}
    </div>
  );
}
