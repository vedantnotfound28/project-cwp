import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ReportCard } from '@/components/ReportCard';
import { useReports } from '@/context/ReportsContext';
import { useAuth } from '@/context/AuthContext';
import { ReportStatus, CATEGORIES, ProblemCategory } from '@/types/report';
import { Plus, Filter, Search, FileX, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FilterStatus = 'all' | ReportStatus;

export default function Reports() {
  const { reports } = useReports();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<ProblemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Status filter
      if (statusFilter !== 'all' && report.status !== statusFilter) {
        return false;
      }
      
      // Category filter
      if (categoryFilter !== 'all' && report.category !== categoryFilter) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          report.title.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          report.location.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [reports, statusFilter, categoryFilter, searchQuery]);

  const statusCounts = useMemo(() => {
    return {
      all: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      in_progress: reports.filter(r => r.status === 'in_progress').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
    };
  }, [reports]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Community Reports
            </h1>
            <p className="text-muted-foreground">
              {reports.length === 0 
                ? 'No reports submitted yet' 
                : `${filteredReports.length} ${filteredReports.length === 1 ? 'report' : 'reports'} found`
              }
            </p>
          </div>
          {user ? (
            <Link to="/submit">
              <Button variant="hero">
                <Plus className="h-5 w-5" />
                New Report
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="hero">
                <LogIn className="h-5 w-5" />
                Sign In to Report
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{statusCounts.all}</p>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-status-pending">{statusCounts.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-status-progress">{statusCounts.in_progress}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-status-resolved">{statusCounts.resolved}</p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </div>
        </div>

        {/* Filters - only show if there are reports */}
        {reports.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                    <SelectItem value="pending">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-status-pending" />
                        Pending ({statusCounts.pending})
                      </span>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-status-progress" />
                        In Progress ({statusCounts.in_progress})
                      </span>
                    </SelectItem>
                    <SelectItem value="resolved">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-status-resolved" />
                        Resolved ({statusCounts.resolved})
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ProblemCategory | 'all')}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Reports Grid or Empty State */}
        {reports.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <FileX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              No reports yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Be the first to report an issue in your community. Help make your neighborhood a better place!
            </p>
            {user ? (
              <Link to="/submit">
                <Button variant="hero" size="lg">
                  <Plus className="h-5 w-5" />
                  Submit First Report
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="lg">
                  <LogIn className="h-5 w-5" />
                  Sign In to Submit a Report
                </Button>
              </Link>
            )}
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No matching reports
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
