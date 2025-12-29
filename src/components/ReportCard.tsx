import { Report, getCategoryInfo } from '@/types/report';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { useReports } from '@/context/ReportsContext';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const { updateReportStatus } = useReports();
  const { user } = useAuth();
  const category = getCategoryInfo(report.category);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-status-resolved text-primary-foreground';
      case 'in_progress':
        return 'bg-status-progress text-foreground';
      default:
        return 'bg-status-pending text-primary-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'Resolved';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 animate-scale-in">
      {report.imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={report.imageUrl}
            alt={report.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label={category.label}>
              {category.icon}
            </span>
            <Badge variant="secondary" className="text-xs font-medium">
              {category.label}
            </Badge>
          </div>
          <Badge className={`${getStatusColor(report.status)} text-xs font-semibold`}>
            {getStatusLabel(report.status)}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {report.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {report.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{report.location}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(report.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatTime(report.createdAt)}</span>
            </div>
          </div>
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                Update Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => updateReportStatus(report.id, 'pending')}
                className="gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-status-pending" />
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => updateReportStatus(report.id, 'in_progress')}
                className="gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-status-progress" />
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => updateReportStatus(report.id, 'resolved')}
                className="gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-status-resolved" />
                Mark as Resolved
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  );
}
